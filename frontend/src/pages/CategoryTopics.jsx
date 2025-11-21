import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getCategoryArticles, getCategory } from "../services/api";
import {
  Loader2,
  ArrowLeft,
  Clock,
  User,
  Calendar,
  ArrowRight,
} from "lucide-react";

const CategoryTopics = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategoryAndArticles();
  }, [slug]);

  const fetchCategoryAndArticles = async () => {
    try {
      setLoading(true);

      // Fetch category details and articles
      const [categoryRes, articlesRes] = await Promise.all([
        getCategory(slug),
        getCategoryArticles(slug),
      ]);

      setCategory(categoryRes.data);
      setArticles(articlesRes.data);
      setError(null);
    } catch (err) {
      setError("Failed to load articles. Please try again later.");
      console.error("Error fetching category articles:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getReadingTime = (content) => {
    // Estimate reading time (assuming 200 words per minute)
    const words = content?.split(" ").length || 0;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Loading articles...
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
            onClick={fetchCategoryAndArticles}
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
          <Link
            to="/categories"
            className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Categories
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              {category?.name}
            </h1>
            <p className="text-xl text-white/90 max-w-3xl">
              {category?.description}
            </p>
            <div className="mt-6 text-white/80">
              <span className="font-semibold">{articles.length}</span>{" "}
              {articles.length === 1 ? "article" : "articles"} available
            </div>
          </motion.div>
        </div>
      </section>

      {/* Articles Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {articles.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                No articles yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Articles in this category are coming soon. Check back later!
              </p>
              <Link to="/categories">
                <button className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold transition-colors">
                  Browse Other Categories
                </button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article, index) => (
                <motion.div
                  key={article._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <Link to={`/articles/${article.slug}`}>
                    <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden border border-gray-100 dark:border-gray-700 h-full flex flex-col">
                      {/* Article Image */}
                      {article.featuredImage && (
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={article.featuredImage}
                            alt={article.title}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      )}

                      {/* Content */}
                      <div className="p-6 flex-grow flex flex-col">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                          {article.title}
                        </h2>

                        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 flex-grow">
                          {article.excerpt ||
                            article.content?.substring(0, 150) + "..."}
                        </p>

                        {/* Meta Information */}
                        <div className="space-y-2 text-sm text-gray-500 dark:text-gray-500">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-2" />
                            <span>
                              By {article.author?.name || "ThriveWell Team"}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2" />
                              <span>{formatDate(article.createdAt)}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-2" />
                              <span>{getReadingTime(article.content)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Read More Link */}
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex items-center text-primary-500 font-semibold hover:gap-2 transition-all">
                            Read Article
                            <ArrowRight className="w-5 h-5 ml-1" />
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      {articles.length > 0 && (
        <section className="py-20 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Need Personalized Advice?
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                  Ask our AI Assistant for tailored health guidance
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
      )}
    </div>
  );
};

export default CategoryTopics;
