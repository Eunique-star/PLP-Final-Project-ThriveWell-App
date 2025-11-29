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
import AIChat from "./pages/AIChat";
import BookProfessional from "./pages/BookProfessional";
import BookAppointment from "./pages/BookAppointment";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Component to handle auth token
function AuthTokenHandler() {
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    const updateToken = async () => {
      console.log("🔐 Auth state:", { isSignedIn });

      if (isSignedIn) {
        try {
          const token = await getToken();
          console.log(
            "✅ Token retrieved:",
            token ? "Token exists" : "No token"
          );
          console.log("Token preview:", token?.substring(0, 20) + "...");
          setAuthToken(token);
        } catch (error) {
          console.error("❌ Error getting token:", error);
          setAuthToken(null);
        }
      } else {
        console.log("⚠️ User not signed in, clearing token");
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
                <Route path="/ai-chat" element={<AIChat />} />
                <Route
                  path="/book-professional"
                  element={<BookProfessional />}
                />
                <Route
                  path="/book-appointment/:clerkId"
                  element={<BookAppointment />}
                />
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
