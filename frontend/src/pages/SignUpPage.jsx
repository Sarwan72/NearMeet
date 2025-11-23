



import { useState } from "react";
import { Link } from "react-router";
import { Mail, Lock, User, MessageCircle } from "lucide-react";
import useSignUp from "../hooks/useSignUp";

const SignUpPage = () => {
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { isPending, error, signupMutation } = useSignUp();

  const handleSignup = (e) => {
    e.preventDefault();
    signupMutation(signupData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="w-full max-w-6xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row">
          {/* Signup Form Section */}
          <div className="w-full lg:w-1/2 p-8 md:p-12 relative">
            {/* Logo */}
            <div className="mb-10 flex items-center gap-4">
              <div className="relative  from-primary to-secondary p-3 rounded-2xl">
                 <img className="w-12 h-12 rounded-full" src="./logo.png" alt="NearMeet Logo" />
              </div>
              <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 tracking-wider">
                NearMeet
              </span>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl backdrop-blur-sm">
                <span className="text-red-200">
                  {error.response?.data?.message || "Signup failed"}
                </span>
              </div>
            )}

            {/* Welcome */}
            <div className="space-y-2 mb-8">
              <h2 className="text-3xl font-bold text-white">
                Join NearMeet Today!
              </h2>
              <p className="text-gray-300 text-lg">
                Create your account and start connecting globally.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSignup} className="space-y-6">
              {/* Full Name */}
              <div className="relative">
                <User className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Your full name"
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 backdrop-blur-sm"
                  value={signupData.fullName}
                  onChange={(e) =>
                    setSignupData({ ...signupData, fullName: e.target.value })
                  }
                  required
                />
              </div>

              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 backdrop-blur-sm"
                  value={signupData.email}
                  onChange={(e) =>
                    setSignupData({ ...signupData, email: e.target.value })
                  }
                  required
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 backdrop-blur-sm"
                  value={signupData.password}
                  onChange={(e) =>
                    setSignupData({ ...signupData, password: e.target.value })
                  }
                  required
                />
                <p className="text-xs text-gray-400 mt-1">
                  At least 6 characters long
                </p>
              </div>

              {/* Terms */}
              <label className="flex items-center gap-2 text-sm text-gray-300">
                <input type="checkbox" required className="accent-primary" />
                I agree to the{" "}
                <span className="text-primary hover:underline">terms</span> &{" "}
                <span className="text-primary hover:underline">privacy</span>
              </label>

              {/* Signup Button */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-gradient-to-r from-primary to-secondary py-4 px-6 rounded-xl font-semibold text-white shadow-lg flex items-center justify-center gap-3 hover:opacity-90 transition"
              >
                {isPending ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    
                    <span>Create Account</span>
                  </>
                )}
              </button>

              {/* Login Link */}
              <div className="text-center pt-2">
                <p className="text-gray-300">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-primary hover:text-secondary font-semibold hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </div>

          {/* Illustration Section */}
          <div className="hidden lg:flex w-full lg:w-1/2 bg-gradient-to-br from-primary/20 to-secondary/20 items-center justify-center p-12">
            <div className="max-w-md text-center space-y-6">
              <h3 className="text-2xl font-bold text-white">
                Join the Global Community
              </h3>
              <p className="text-gray-300 text-sm">
                Find partners, practice languages, and grow together.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
