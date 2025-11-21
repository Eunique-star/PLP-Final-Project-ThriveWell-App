import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Heart,
  Brain,
  Activity,
  Users,
  BookOpen,
  Sparkles,
  ArrowRight,
  Shield,
  Clock,
  Award,
} from "lucide-react";

const Home = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Health Articles",
      description:
        "Access comprehensive health information on nutrition, mental health, childcare, and more.",
    },
    {
      icon: Sparkles,
      title: "AI Health Assistant",
      description:
        "Get instant answers to your health questions from our intelligent AI assistant.",
    },
    {
      icon: Users,
      title: "Book Professionals",
      description:
        "Connect with verified doctors, nurses, nutritionists, and therapists.",
    },
    {
      icon: Shield,
      title: "Trusted Content",
      description:
        "All articles written by verified healthcare professionals and experts.",
    },
  ];

  const stats = [
    { icon: Heart, number: "500+", label: "Health Articles" },
    { icon: Users, number: "100+", label: "Medical Professionals" },
    { icon: Activity, number: "24/7", label: "AI Support" },
    { icon: Award, number: "100%", label: "Verified Content" },
  ];

  const categories = [
    { name: "Nutrition", icon: "🥗", color: "from-green-400 to-emerald-500" },
    { name: "Mental Health", icon: "🧠", color: "from-purple-400 to-pink-500" },
    { name: "First Aid", icon: "🩹", color: "from-red-400 to-orange-500" },
    { name: "Child Care", icon: "👶", color: "from-blue-400 to-cyan-500" },
    { name: "Fitness", icon: "💪", color: "from-orange-400 to-yellow-500" },
    { name: "Maternal Care", icon: "🤱", color: "from-pink-400 to-rose-500" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section - Full Screen */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-800 dark:to-gray-900 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20 w-full">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-block mb-6 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 rounded-full"
              >
                <span className="text-primary-700 dark:text-primary-300 font-semibold text-sm">
                  🎯 Supporting SDG 3: Good Health & Well-being
                </span>
              </motion.div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Your Health,
                <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                  {" "}
                  Our Priority
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
                Access quality health information, consult with professionals,
                and get AI-powered health guidance - all in one place.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/categories">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-primary-500/30"
                  >
                    Explore Health Topics
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>

                <Link to="/ai-chat">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-semibold border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    Try AI Assistant
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            {/* Right Content - Animated Illustration */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden md:block"
            >
              <div className="relative w-full h-96">
                <motion.div
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full opacity-20 blur-3xl"
                />
                <motion.div
                  animate={{ y: [0, 20, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-accent-400 to-pink-400 rounded-full opacity-20 blur-3xl"
                />

                <div className="relative z-10 flex items-center justify-center h-full">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Heart
                      className="w-48 h-48 text-primary-500 dark:text-primary-400"
                      strokeWidth={1.5}
                    />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex flex-col items-center"
            >
              <span className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Scroll to explore
              </span>
              <div className="w-6 h-10 border-2 border-gray-400 dark:border-gray-500 rounded-full flex justify-center">
                <motion.div
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full mt-2"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <stat.icon className="w-10 h-10 mx-auto mb-4 text-primary-500" />
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Everything You Need for Better Health
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Comprehensive health resources and professional support at your
              fingertips
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100 dark:border-gray-800"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Explore Health Categories
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Find the information you need across various health topics
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="cursor-pointer"
              >
                <div
                  className={`bg-gradient-to-br ${category.color} p-8 rounded-2xl shadow-lg text-center h-full flex flex-col items-center justify-center hover:shadow-xl transition-shadow`}
                >
                  <div className="text-5xl mb-4">{category.icon}</div>
                  <h3 className="text-white font-bold text-lg">
                    {category.name}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Link to="/categories">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-semibold inline-flex items-center gap-2 shadow-lg"
              >
                View All Categories
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary-500 to-secondary-500">
        <div className="max-w-4xl mx-auto text-center px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Take Control of Your Health?
            </h2>
            <p className="text-xl text-white/90 mb-10 leading-relaxed">
              Join ThriveWell today and access expert health information, AI
              assistance, and professional consultations.
            </p>
            <Link to="/sign-up">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 bg-white text-primary-600 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all"
              >
                Get Started Free
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
