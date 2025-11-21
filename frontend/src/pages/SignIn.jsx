import { SignIn } from "@clerk/clerk-react";
import { motion } from "framer-motion";

const SignInPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome Back!
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Sign in to access your health companion
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <SignIn
            appearance={{
              elements: {
                formButtonPrimary:
                  "bg-primary-500 hover:bg-primary-600 text-sm normal-case",
                card: "shadow-none",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton:
                  "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700",
                formFieldInput:
                  "border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white",
                footerActionLink: "text-primary-500 hover:text-primary-600",
              },
            }}
            routing="path"
            path="/sign-in"
            signUpUrl="/sign-up"
            afterSignInUrl="/"
          />
        </div>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          By signing in, you agree to our{" "}
          <a href="/terms" className="text-primary-500 hover:text-primary-600">
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="/privacy"
            className="text-primary-500 hover:text-primary-600"
          >
            Privacy Policy
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default SignInPage;
