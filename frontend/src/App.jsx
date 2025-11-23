import { Routes, Route, Navigate } from "react-router";

import HomePage from "./pages/HomePage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import NotificationPage from "./pages/NotificationsPage.jsx";
// import CallPage from "./pages/CallPage.jsx";
// import ChatPage from "./pages/ChatPage.jsx";
import OnboardingPage from "./pages/OnboardingPage.jsx";

import { Toaster } from "react-hot-toast";
import PageLoader from "./components/PageLoader.jsx";
import useAuthUser from "./hooks/useAuthUser.js";
import Layout from "./components/Layout.jsx";
import { useThemeStore } from "./store/useThemeStore.js";
// import FriendsPage from "./pages/FriendsPage.jsx";
import HotelsPage from "./pages/HotelsPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import ChangePasswordPage from "./pages/ChangePasswordPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import FeaturesPage from "./pages/FeaturesPage.jsx";
import ContactsPage from "./pages/ContactsPage.jsx";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage.jsx";

import VendorSignupPage from "./pages/VendorSignupPage";
import VendorLoginPage from "./pages/VendorLoginPage";
import VendorDashboardPage from "./pages/VendorDashboardPage";
import PaymentPage from "./pages/PaymentPage";

import { AuthProvider } from "./context/AuthContext";
import VendorProfilePage from "./pages/VendorProfilePage.jsx";
import AiAgentPage from "./pages/AiAgentPage.jsx";
import VendorSideReview from "./pages/vendorSideReview.jsx";
const App = () => {
  const { isLoading, authUser } = useAuthUser();

  const { theme } = useThemeStore();

  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;

  if (isLoading) return <PageLoader />;

  return (
    
    <AuthProvider>

      <div className="min-h-screen" data-theme={theme}>
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated && isOnboarded ? (
                <Layout >
                  <HomePage />
                </Layout>
              ) : (
                <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
              )
            }
          />
          <Route
            path="/signup"
            element={
              !isAuthenticated ? (
                <SignUpPage />
              ) : (
                <Navigate to={isOnboarded ? "/" : "/onboarding"} replace />
              )
            }
          />
          <Route
            path="/login"
            element={
              !isAuthenticated ? (
                <LoginPage />
              ) : (
                <Navigate to={isOnboarded ? "/" : "/onboarding"} replace />
              )
            }
          />
          <Route
            path="/notifications"
            element={
              isAuthenticated && isOnboarded ? (
                <Layout >
                  <NotificationPage />
                </Layout>
              ) : (
                <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
              )
            }
          />
        
          <Route
            path="/onboarding"
            element={
              isAuthenticated ? (
                !isOnboarded ? (
                  <OnboardingPage />
                ) : (
                  <Navigate to={"/"} />
                )
              ) : (
                <Navigate to={"/login"} />
              )
            }
          />

          <Route
            path="/hotels"
            element={
              isAuthenticated && isOnboarded ? (
                <Layout >
                  <HotelsPage />
                </Layout>
              ) : (
                <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
              )
            }
          />
          {/* <Route path="/hotels" element={<HotelsPage />} /> */}
          <Route
            path="/profile"
            element={
              isAuthenticated && isOnboarded ? (
                <Layout >
                  <ProfilePage />
                </Layout>
              ) : (
                <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
              )
            }
          />
          <Route
            path="/change-password"
            element={
              isAuthenticated && isOnboarded ? (
                <Layout >
                  <ChangePasswordPage />
                </Layout>
              ) : (
                <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
              )
            }
          />
          <Route
            path="/about"
            element={
              isAuthenticated && isOnboarded ? (
                <Layout >
                  <AboutPage />
                </Layout>
              ) : (
                <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
              )
            }
          />
          <Route
            path="/features"
            element={
              isAuthenticated && isOnboarded ? (
                <Layout >
                  <FeaturesPage />
                </Layout>
              ) : (
                <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
              )
            }
          />
          <Route
            path="/contact"
            element={
              isAuthenticated && isOnboarded ? (
                <Layout >
                  <ContactsPage />
                </Layout>
              ) : (
                <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
              )
            }
          />
          <Route
            path="/privacy"
            element={
              isAuthenticated && isOnboarded ? (
                <Layout >
                  <PrivacyPolicyPage />
                </Layout>
              ) : (
                <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
              )
            }
          />
           <Route path="/vendor-signup" element={<VendorSignupPage />} />
          <Route path="/vendor-login" element={<VendorLoginPage />} />
          <Route path="/vendor-home" element={<VendorDashboardPage />} />
          <Route path="/vendor-profile" element={<VendorProfilePage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/ai" element={<AiAgentPage />} />
          <Route path="/vendor/:vendorId/reviews" element={<VendorSideReview />} />

        </Routes>

        <Toaster position="top-center" />
      </div>
    </AuthProvider>
  );
};

export default App;
