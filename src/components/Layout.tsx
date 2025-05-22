import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Home, User, Settings, LayoutDashboard, Menu, X, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { useState } from "react";
import axios from "axios";

interface LayoutProps {
  children?: ReactNode;
}

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message
}: ConfirmationModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  console.log(error)
  // Navigation items
  const navItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/dashboard/modelcategory", icon: Home, label: "Model Category" },
    { path: "/dashboard/modeltheme", icon: Home, label: "Model Theme" },
    { path: "/dashboard/color", icon: Home, label: "Color" },
    { path: "/dashboard/manufacturer-options", icon: Home, label: "Manufacturer Options" },
    { path: "/dashboard/vanari-options", icon: Home, label: "Vanari Options" },
    { path: "/dashboard/submission", icon: Home, label: "Submission" }
  ];

  const handleLogout = async () => {
    setError(null);
    const token = localStorage.getItem("token");

    if (!token) {
      // If no token exists, just redirect to login
      localStorage.clear();
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        "https://ben10.scaleupdevagency.com/api/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
    } catch (err) {
      // Even if logout API fails, we still want to clear local storage
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          // Token was already invalid - we can proceed with client-side cleanup
          console.log("Session already expired, proceeding with client-side logout");
        } else {
          console.error("Logout failed:", err);
          setError("Logout failed. You have been signed out locally.");
        }
      } else {
        console.error("Unexpected error during logout:", err);
        setError("An unexpected error occurred during logout.");
      }
    } finally {
      // Always clear local storage and redirect
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  const openLogoutConfirmation = () => {
    setShowLogoutModal(true);
  };

  const closeLogoutConfirmation = () => {
    setShowLogoutModal(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900 md:flex-row">
      {/* Mobile header */}
      <header className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 shadow-md md:hidden">
        <Link to="/" className="text-xl font-bold">
          Dashboard
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside
        className={cn(
          "w-full md:w-64 bg-white dark:bg-gray-800 shadow-md transform transition-all duration-300 ease-in-out fixed md:static inset-0 z-40",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="h-full overflow-y-auto p-4 flex flex-col">
          <div className="mb-8 hidden md:block">
            <Link to="/" className="text-xl font-bold">
              Dashboard
            </Link>
          </div>

          <nav className="space-y-2 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center p-3 rounded-lg transition-colors",
                    location.pathname === item.path
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <button
            onClick={openLogoutConfirmation}
            className="flex items-center p-3 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 dark:text-red-400 mt-auto"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 py-8 ">
        <div className="px-4">
          {children ?? <Outlet />}
        </div>
      </main>

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={closeLogoutConfirmation}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
      />
    </div>
  );
}