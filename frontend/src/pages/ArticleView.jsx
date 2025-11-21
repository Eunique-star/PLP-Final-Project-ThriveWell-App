import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getArticle } from "../services/api";
import {
  Loader2,
  ArrowLeft,
  Clock,
  User,
  Calendar,
  Share2,
  BookmarkPlus,
  ChevronRight,
} from "lucide-react";

const ArticleView = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArticle();
  }, [slug]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const response = await getArticle(slug);
      setArticle(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load article. Please try again later.");
      console.error("Error fetching article:", err);
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
    const words = content?.split(" ").length || 0;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt || article.content?.substring(0, 150),
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 px-6">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">📄</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Article Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || "This article doesn't exist or has been removed."}
          </p>
          <button
            onClick={() => navigate("/categories")}
            className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold transition-colors"
          >
            Browse Categories
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Breadcrumb Navigation */}
      <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Link to="/" className="hover:text-primary-500 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link
              to="/categories"
              className="hover:text-primary-500 transition-colors"
            >
              Categories
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link
              to={`/categories/${article.category?.slug}`}
              className="hover:text-primary-500 transition-colors"
            >
              {article.category?.name}
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-gray-900 dark:text-white truncate max-w-xs">
              {article.title}
            </span>
          </div>
        </div>
      </div>

      {/* Article Header */}
      <article className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Category Badge */}
          <Link
            to={`/categories/${article.category?.slug}`}
            className="inline-block"
          >
            <span className="inline-flex items-center px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-semibold hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors mb-6">
              {article.category?.name}
            </span>
          </Link>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            {article.title}
          </h1>

          {/* Excerpt */}
          {article.excerpt && (
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              {article.excerpt}
            </p>
          )}

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 pb-8 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <User className="w-5 h-5 mr-2" />
              <span className="font-medium">
                {article.author?.name || "ThriveWell Team"}
              </span>
            </div>

            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Calendar className="w-5 h-5 mr-2" />
              <span>
                {formatDate(article.publishedAt || article.createdAt)}
              </span>
            </div>

            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Clock className="w-5 h-5 mr-2" />
              <span>{getReadingTime(article.content)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 py-6 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>

            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors">
              <BookmarkPlus className="w-4 h-4" />
              Save
            </button>
          </div>
        </motion.div>

        {/* Featured Image */}
        {article.featuredImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="my-12 rounded-2xl overflow-hidden max-h-[500px]"
          >
            <img
              src={article.featuredImage}
              alt={article.title}
              className="w-full h-auto object-cover"
            />
          </motion.div>
        )}

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="article-content text-lg"
        >
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </motion.div>

        {/* Author Info */}
        {article.author && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 p-8 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              About the Author
            </h3>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                {article.author.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {article.author.name}
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {article.author.bio ||
                    "Healthcare professional and content writer at ThriveWell."}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Back Button */}
        <div className="mt-12">
          <Link
            to={`/categories/${article.category?.slug}`}
            className="inline-flex items-center text-primary-500 hover:text-primary-600 font-semibold transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to {article.category?.name}
          </Link>
        </div>
      </article>

      {/* Related Articles CTA */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Explore More Health Topics
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Continue your health journey with more informative articles
          </p>
          <Link to="/categories">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-semibold shadow-lg inline-flex items-center gap-2"
            >
              Browse All Categories
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ArticleView;
