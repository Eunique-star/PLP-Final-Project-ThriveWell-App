import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import { ThemeProvider } from "./contexts/ThemeContext";
import { setAuthToken } from "./services/api";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Categories from "./pages/Categories";
import CategoryTopics from "./pages/CategoryTopics";
import ArticleView from "./pages/ArticleView";
import SignInPage from "./pages/SignIn";
import SignUpPage from "./pages/SignUp";
import ApplyRole from "./pages/ApplyRole";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Component to handle auth token
function AuthTokenHandler() {
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    const updateToken = async () => {
      if (isSignedIn) {
        const token = await getToken();
        setAuthToken(token);
      } else {
        setAuthToken(null);
      }
    };

    updateToken();
  }, [isSignedIn, getToken]);

  return null;
}

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <ThemeProvider>
        <Router>
          <AuthTokenHandler />
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/categories/:slug" element={<CategoryTopics />} />
                <Route path="/articles/:slug" element={<ArticleView />} />
                <Route path="/sign-in/*" element={<SignInPage />} />
                <Route path="/sign-up/*" element={<SignUpPage />} />
                <Route path="/apply" element={<ApplyRole />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </ThemeProvider>
    </ClerkProvider>
  );
}

export default App;
