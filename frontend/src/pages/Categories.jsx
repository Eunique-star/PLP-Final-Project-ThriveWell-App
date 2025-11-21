import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getCategories } from "../services/api";
import { Loader2, Search, ArrowRight } from "lucide-react";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Category icons mapping (you can customize these)
  const categoryIcons = {
    nutrition: "🥗",
    "mental-health": "🧠",
    "first-aid": "🩹",
    "child-care": "👶",
    "maternal-care": "🤱",
    fitness: "💪",
    "general-health": "❤️",
    "sexual-health": "💑",
    "dental-health": "🦷",
    "eye-health": "👁️",
    default: "🏥",
  };

  // Category color schemes
  const categoryColors = [
    "from-green-400 to-emerald-500",
    "from-purple-400 to-pink-500",
    "from-red-400 to-orange-500",
    "from-blue-400 to-cyan-500",
    "from-orange-400 to-yellow-500",
    "from-pink-400 to-rose-500",
    "from-teal-400 to-cyan-500",
    "from-indigo-400 to-purple-500",
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getCategories();
      setCategories(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load categories. Please try again later.");
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (slug) => {
    return categoryIcons[slug] || categoryIcons["default"];
  };

  const getColor = (index) => {
    return categoryColors[index % categoryColors.length];
  };

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Loading categories...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 px-6">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={fetchCategories}
            className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-primary-500 to-secondary-500 py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Health Categories
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Explore comprehensive health information across various topics
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {filteredCategories.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                No categories found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try searching with different keywords
              </p>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCategories.map((category, index) => (
                <motion.div
                  key={category._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <Link to={`/categories/${category.slug}`}>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden border border-gray-100 dark:border-gray-700 h-full">
                      {/* Gradient Header */}
                      <div
                        className={`bg-gradient-to-br ${getColor(
                          index
                        )} p-8 text-center`}
                      >
                        <div className="text-6xl mb-4">
                          {getIcon(category.slug)}
                        </div>
                        <h2 className="text-2xl font-bold text-white">
                          {category.name}
                        </h2>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-3">
                          {category.description ||
                            "Explore articles and information about " +
                              category.name}
                        </p>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500 dark:text-gray-500">
                            {category.articleCount || 0} articles
                          </span>
                          <div className="flex items-center text-primary-500 font-semibold group-hover:gap-2 transition-all">
                            Explore
                            <ArrowRight className="w-5 h-5 ml-1 group-hover:ml-2 transition-all" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Can't find what you're looking for?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                Try our AI Assistant for personalized health guidance
              </p>
              <Link to="/ai-chat">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-semibold shadow-lg inline-flex items-center gap-2"
                >
                  Ask AI Assistant
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Categories;
