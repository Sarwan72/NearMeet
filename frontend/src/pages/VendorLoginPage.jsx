import { useState } from "react";
import { Link } from "react-router";
import { Eye, EyeOff, Mail, Lock, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { toast } from "react-hot-toast";

const VendorLoginPage = () => {
  const [loginData, setLoginData] = useState({
    ownerEmail: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
const navigate = useNavigate();


  // const handleLogin = (e) => {
  //   e.preventDefault();
  //   console.log("Vendor Login Data:", loginData);
  //   // TODO; //call vendor login api
  //   navigate("/vendor-home"); // 
  //   // TODO: Call vendor login API
  // };


const handleLogin = async (e) => {
  e.preventDefault();
  try {
    // const res = await fetch("/api/vendors/login", {
    const res = await fetch("http://localhost:5001/api/vendors/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(loginData),
    });

    if (!res.ok) throw new Error("Login failed");

    const resData = await res.json();

    // ✅ Save only vendor info, not the entire response
    localStorage.setItem("vendor", JSON.stringify(resData.vendor));

    // Redirect to vendor dashboard
    navigate("/vendor-home");
  } catch (err) {
    console.error("Vendor login error:", err);
    toast.error("Login failed, please check your credentials.");
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">

        {/* Left Section - Form */}
        <div className="w-full p-8 md:p-12">
          {/* Logo / Title */}
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-2xl">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
              Vendor Login
            </span>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">
            Welcome Back, Partner!
          </h2>
          <p className="text-gray-300 mb-8">
            Login to manage your venue and connect with NearMeet users.
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
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500/50 focus:outline-none"
                  value={loginData.ownerEmail}
                  onChange={(e) =>
                    setLoginData({ ...loginData, ownerEmail: e.target.value })
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
                  className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500/50 focus:outline-none"
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
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 py-3 rounded-xl font-semibold text-white shadow-lg hover:opacity-90 transition"
            >
              Login as Vendor
            </button>
          </form>

          {/* Signup Link */}
          <p className="text-gray-300 text-center mt-6">
            New to NearMeet?{" "}
            <Link
              to="/vendor-signup"
              className="text-yellow-400 hover:text-orange-400 font-semibold underline"
            >
              Sign up as Vendor
            </Link>
          </p>

          {/* Back to User Login */}
           <Link
          to='/login'
          className='bg-[#10b461] mt-5 flex items-center justify-center text-white font-semibold mb-5 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base'
        >Sign in as User</Link>

          
        </div>
      </div>
    </div>
  );
};

export default VendorLoginPage;
