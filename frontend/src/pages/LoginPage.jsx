// import OAuth from "../components/OAuth";

import { useState } from "react";
import { Link } from "react-router";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Globe,
  Users,
  MessageCircle,
} from "lucide-react";
import useLogin from "../hooks/useLogin";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
//  const { loginMutation, isPending, error } = useLogin();
  const { isPending, error, loginMutation } = useLogin();

  
const handleLogin = (e) => {
  e.preventDefault();
  loginMutation({
    email: loginData.email,
    password: loginData.password,
  });
};
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        {/* Left Section - Form */}
        <div className="w-full lg:w-1/2 p-8 md:p-12">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-gradient-to-r from-primary to-secondary p-3 rounded-2xl">
                  <img className="w-12 h-12 rounded-full" src="./logo.png" alt="NearMeet Logo" />
            </div>
            <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
              NearMeet
            </span>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200">
              {error.response?.data?.message || "Login failed"}
            </div>
          )}

          {/* Welcome */}
          <h2 className="text-2xl font-bold text-white mb-2">Welcome Back!</h2>
          <p className="text-gray-300 mb-8">
            Ready to continue your language adventure? Let's get you signed in.
          </p>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 focus:outline-none"
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({ ...loginData, email: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-secondary/50 focus:outline-none"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                  required
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-gradient-to-r from-primary to-secondary py-3 rounded-xl font-semibold text-white shadow-lg hover:opacity-90 transition"
            >
              {isPending ? "Loading..." : "Enter NearMeet"}
            </button>
          </form>
          {/* <OAuth /> */}

          {/* Signup Link */}
          <p className="text-gray-300 text-center mt-6">
            New to our community?{" "}
            <Link
              to="/signup"
              className="text-primary hover:text-secondary font-semibold underline"
            >
              Sign up
            </Link>
          </p>

          {/* Hotel Malik Link */}
         <Link
          to='/vendor-login'
          className='bg-[#10b461] mt-5 flex items-center justify-center text-white font-semibold mb-5 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base'
        >Sign in as vendor</Link>




        </div>

        {/* Right Section - Illustration */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-gradient-to-br from-primary/20 to-secondary/20 items-center justify-center p-8">
          <div className="max-w-sm text-center space-y-6">
            <div className="flex justify-center gap-6">
              <Users className="w-16 h-16 text-primary" />
              <Globe className="w-16 h-16 text-secondary" />
            </div>
            <h3 className="text-2xl font-bold text-white">
              Global Connections
            </h3>
            <p className="text-gray-300">
              Connect with speakers from 50+ countries
            </p>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-white/10 rounded-xl p-4">
                <div className="text-3xl mb-2">🎯</div>
                <h4 className="text-white font-semibold">Smart Matching</h4>
                <p className="text-gray-300 text-sm">
                  AI-powered partner suggestions
                </p>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <div className="text-3xl mb-2">⚡</div>
                <h4 className="text-white font-semibold">Real-time Chat</h4>
                <p className="text-gray-300 text-sm">Instant conversations</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
