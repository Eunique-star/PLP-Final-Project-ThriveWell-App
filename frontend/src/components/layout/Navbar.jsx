import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";
import { Menu, X, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "../ui/ThemeToggle";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Categories", path: "/categories" },
    { name: "AI Assistant", path: "/ai-chat" },
    { name: "Book Professional", path: "/book-professional" },
  ];

  const getDashboardLink = () => {
    const role = user?.publicMetadata?.role;
    if (role === "writer" || role === "medical" || role === "admin") {
      return { name: "Dashboard", path: "/dashboard" };
    }
    return null;
  };

  const dashboardLink = getDashboardLink();

  const userRole = user?.publicMetadata?.role;
  // Only show "Apply" link if user is signed in and role is 'user'
  const showApplyLink = user && userRole === "user";

  console.log("User:", user); // Debug log
  console.log("User role:", userRole); // Debug log
  console.log("Show apply link:", showApplyLink); // Debug log

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Heart className="w-8 h-8 text-primary-500 fill-primary-500" />
            </motion.div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
              ThriveWell
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors font-medium"
              >
                {link.name}
              </Link>
            ))}
            {showApplyLink && (
              <Link
                to="/apply"
                className="text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors font-medium"
              >
                Apply
              </Link>
            )}
            {dashboardLink && (
              <Link
                to={dashboardLink.path}
                className="text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors font-medium"
              >
                {dashboardLink.name}
              </Link>
            )}
          </div>

          {/* Right Side - Auth & Theme */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <SignedOut>
              <Link
                to="/sign-in"
                className="text-gray-700 dark:text-gray-300 hover:text-primary-500 transition-colors font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/sign-up"
                className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors"
              >
                Sign Up
              </Link>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 dark:border-gray-800"
          >
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block py-2 text-gray-700 dark:text-gray-300 hover:text-primary-500 transition-colors font-medium"
                >
                  {link.name}
                </Link>
              ))}
              {showApplyLink && (
                <Link
                  to="/apply"
                  onClick={() => setIsOpen(false)}
                  className="block py-2 text-gray-700 dark:text-gray-300 hover:text-primary-500 transition-colors font-medium"
                >
                  Apply
                </Link>
              )}
              {dashboardLink && (
                <Link
                  to={dashboardLink.path}
                  onClick={() => setIsOpen(false)}
                  className="block py-2 text-gray-700 dark:text-gray-300 hover:text-primary-500 transition-colors font-medium"
                >
                  {dashboardLink.name}
                </Link>
              )}
              <SignedOut>
                <Link
                  to="/sign-in"
                  onClick={() => setIsOpen(false)}
                  className="block py-2 text-gray-700 dark:text-gray-300 hover:text-primary-500 transition-colors font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/sign-up"
                  onClick={() => setIsOpen(false)}
                  className="block py-2 px-4 bg-primary-500 text-white rounded-lg font-medium text-center"
                >
                  Sign Up
                </Link>
              </SignedOut>
              <SignedIn>
                <div className="pt-2">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </SignedIn>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
