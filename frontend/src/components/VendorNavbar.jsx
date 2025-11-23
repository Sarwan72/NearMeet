import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BellIcon,
  LogOutIcon,
  HomeIcon,
  UserCheck,
  UserX,
  Star,
  MenuIcon,
} from "lucide-react";
import ThemeSelector from "./ThemeSelector";
  import { logoutVendor } from "../lib/vendor";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const VendorNavbar = ({
  onNavigate,
 
  profile,
}) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
const vendor = JSON.parse(localStorage.getItem("vendor"));

  const navLinks = [
    { to: "/vendor-home", page: "dashboard", label: "Dashboard", icon: HomeIcon },
    // { page: "accepted", label: "Accepted Users", icon: UserCheck, count: acceptedCount },
    // { page: "rejected", label: "Rejected Users", icon: UserX, count: rejectedCount },
    { to: vendor ? `/vendor/${vendor.id}/reviews` : "/vendor-home", page: "reviews", label: "User Reviews", icon: Star },
    // { page: "notifications", label: "Notifications", icon: BellIcon, count: notificationCount },
  ];
const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
  if (!confirmLogout) return;
  try {
    await logoutVendor(); // Call API
    localStorage.removeItem("vendor"); // Remove from storage
    toast.success("Logged out successfully!");
    navigate("/vendor-login"); // Redirect to login page
  } catch (error) {
    console.error("Logout failed:", error);
    toast.error("Failed to logout. Please try again.");
  }
};
  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          to="/vendor-home"
          onClick={() => onNavigate("dashboard")}
          className="flex items-center gap-2.5"
        >
          <img src="/logo.png" alt="logo" className="h-10 w-10 rounded-2xl" />
          <span className="text-xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wide">
            NearMeet Vendor
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex gap-2 items-center ml-8">
          {navLinks.map(({ page, label, icon: Icon, count, to }) => (
  <Link
    key={page}
    to={to}
    className={`flex items-center gap-1 px-3 py-2 rounded hover:bg-base-300 transition ${
      location.pathname.includes("reviews") && page === "reviews"
        ? "bg-base-300 font-bold"
        : ""
    }`}
  >
    <Icon className="w-5 h-5" />
    <span>{label}</span>
  </Link>
))}

        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          <ThemeSelector />
          <div className="tooltip tooltip-bottom" data-tip={profile?.name}>
            <div className="avatar">
              {/* <div className="w-9 rounded-full">
                <img
                  src={
                    profile?.profilePic ||
                    "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                  }
                  alt="Vendor Avatar"
                />
              </div> */}
              <Link to="/vendor-profile" className="avatar">
                <div className="w-9 rounded-full">
                  {/* <img src={authUser?.profilePic} alt="Vendor Avatar" /> */}
                   <img
                  src={
                    profile?.profilePic ||
                    "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                  }
                  alt="Vendor Avatar"
                />
                </div>
              </Link>
            </div>
          </div>
          <button
            className="btn btn-ghost btn-circle"
            onClick={handleLogout}
          >
            <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
          </button>
        </div>

        {/* Hamburger */}
        <button
          className="lg:hidden ml-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Open menu"
        >
          <MenuIcon className="h-7 w-7 text-base-content" />
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="lg:hidden absolute top-16 left-0 w-full bg-base-200 border-t border-base-300 shadow z-40">
          <div className="flex flex-col gap-1 px-4 py-2">
            {navLinks.map(({ page, label, icon: Icon, count }) => (
              <button
                key={page}
                onClick={() => {
                  onNavigate(page);
                  setMenuOpen(false);
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded hover:bg-base-300 transition relative ${
                  location.pathname.includes(page) ? "bg-base-300 font-bold" : ""
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
                {count > 0 && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 badge badge-primary border-0 w-5 h-5 min-h-0 flex items-center justify-center p-0 text-xs">
                    {count}
                  </span>
                )}
              </button>
            ))}
            {/* <div className="flex items-center gap-2 mt-2">
              <ThemeSelector />
              <div className="avatar">
                <div className="w-9 rounded-full">
                  <img
                    src={
                      profile?.profilePic ||
                      "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                    }
                    alt="Vendor Avatar"
                  />
                </div>
              </div>
              <button
                className="btn btn-ghost btn-circle"
                onClick={handleLogout}
              >
                <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
              </button>
            </div> */}
             <div className="flex items-center gap-2 mt-2">
              <ThemeSelector />
              <Link to="/vendor-profile" className="avatar">
                <div className="w-9 rounded-full">
                   src={
                      profile?.profilePic ||
                      "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                    }
                </div>
              </Link>
              <button className="btn btn-ghost btn-circle" onClick={logoutMutation}>
                <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default VendorNavbar;
