import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutGrid,
  BarChart3,
  Clock,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  BookOpen,
  Users,
  Award,
  ChevronRight,
  Zap,
} from "lucide-react";
import { useAuth } from "../../../../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = ({ isOpen, setIsOpen, kpis, productivityScore }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const photoURL = `https://ui-avatars.com/api/?name=${user?.fullName?.replace(
    " ",
    "+"
  )}`;

  const navigationItems = [
    { icon: LayoutGrid, label: "Dashboard", path: "/dashboard", id: "dashboard" },
    { icon: BarChart3, label: "Analytics", path: "/analytics", id: "analytics" },
    { icon: Clock, label: "Sessions", path: "/sessions", id: "sessions" },
    { icon: BookOpen, label: "Insights", path: "/insights", id: "insights" },
    { icon: Users, label: "Users", path: "/admin/users", id: "users", admin: true },
    { icon: Settings, label: "Settings", path: "/settings", id: "settings" },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const sidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: -320, opacity: 0 },
  };

  const containerVariants = {
    open: {
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
    closed: {
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  const itemVariants = {
    open: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
    closed: {
      opacity: 0,
      x: -20,
      transition: { duration: 0.2 },
    },
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-6 left-6 z-50">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg bg-button-primary text-button-primary-text shadow-lg hover:shadow-xl transition-shadow"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 lg:hidden z-30"
            onClick={() => setIsOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        variants={sidebarVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        className={`fixed left-0 top-0 h-screen w-80 ${
          isCollapsed ? "w-24" : "w-80"
        } bg-card-background border-r border-card-border shadow-xl z-40 lg:translate-x-0 transition-all duration-300 flex flex-col pt-24 lg:pt-0 theme-transition`}
      >
        {/* Header Section */}
        <motion.div
          className="px-6 py-8 border-b border-card-border"
          variants={itemVariants}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3 flex-1">
              <motion.img
                src={photoURL}
                alt="Profile"
                className="w-12 h-12 rounded-full border-2 border-button-primary"
                whileHover={{ scale: 1.05 }}
              />
              {!isCollapsed && (
                <motion.div variants={itemVariants}>
                  <p className="font-bold text-text-primary text-sm">
                    {user?.fullName?.split(" ")[0] || "User"}
                  </p>
                  <p className="text-xs text-text-muted">@{user?.username}</p>
                </motion.div>
              )}
            </div>
            <motion.button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-lg hover:bg-background-secondary transition-colors hidden lg:block"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight
                size={18}
                className={`transition-transform ${
                  isCollapsed ? "" : "rotate-180"
                }`}
              />
            </motion.button>
          </div>

          {/* Productivity Score Mini */}
          {!isCollapsed && (
            <motion.div
              className="p-3 rounded-lg bg-background-secondary"
              variants={itemVariants}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-text-secondary">
                  Score
                </span>
                <Award size={16} className="text-button-primary" />
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-text-primary">
                  {productivityScore}%
                </p>
                <span className="text-xs text-text-muted">
                  {productivityScore >= 80 ? "🎉" : "💪"}
                </span>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Quick Stats */}
        {!isCollapsed && kpis && (
          <motion.div
            className="px-6 py-4 border-b border-card-border space-y-2"
            variants={containerVariants}
          >
            <motion.div
              className="flex items-center justify-between p-2 rounded-lg hover:bg-background-secondary transition-colors"
              variants={itemVariants}
            >
              <span className="text-xs text-text-secondary">Focus Time</span>
              <span className="font-semibold text-sm text-text-primary">
                {Math.floor(kpis.totalFocusTime / 3600)}h{" "}
                {Math.floor((kpis.totalFocusTime % 3600) / 60)}m
              </span>
            </motion.div>
            <motion.div
              className="flex items-center justify-between p-2 rounded-lg hover:bg-background-secondary transition-colors"
              variants={itemVariants}
            >
              <span className="text-xs text-text-secondary">Sessions</span>
              <span className="font-semibold text-sm text-text-primary">
                {kpis.sessionsCompleted}
              </span>
            </motion.div>
            <motion.div
              className="flex items-center justify-between p-2 rounded-lg hover:bg-background-secondary transition-colors"
              variants={itemVariants}
            >
              <span className="text-xs text-text-secondary">Avg. Mood</span>
              <span className="font-semibold text-sm text-text-primary">
                {kpis.avgMood}/5
              </span>
            </motion.div>
          </motion.div>
        )}

        <motion.nav
          className="flex-1 px-4 py-6 overflow-y-auto"
          variants={containerVariants}
          initial="closed"
          animate="open"
        >
          <motion.div className="space-y-2" variants={containerVariants}>
            {navigationItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => {
                  navigate(item.path);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive(item.path)
                    ? "bg-button-primary text-button-primary-text shadow-md"
                    : "text-text-secondary hover:text-text-primary hover:bg-background-secondary"
                } ${isCollapsed ? "justify-center" : ""}`}
                variants={itemVariants}
                whileHover={{ x: isCollapsed ? 0 : 4 }}
                whileTap={{ scale: 0.95 }}
                title={isCollapsed ? item.label : ""}
              >
                <item.icon size={20} />
                {!isCollapsed && <span className="font-medium">{item.label}</span>}
                {isActive(item.path) && !isCollapsed && (
                  <ChevronRight size={16} className="ml-auto" />
                )}
              </motion.button>
            ))}
          </motion.div>
        </motion.nav>

        <motion.div
          className="border-t border-card-border px-4 py-4 space-y-2"
          variants={containerVariants}
        >
          <motion.button
            onClick={() => navigate("/settings")}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-text-secondary hover:text-text-primary hover:bg-background-secondary transition-all duration-200"
            variants={itemVariants}
            whileHover={{ x: isCollapsed ? 0 : 4 }}
            whileTap={{ scale: 0.95 }}
            title={isCollapsed ? "Settings" : ""}
          >
            <Settings size={20} />
            {!isCollapsed && <span className="font-medium">Settings</span>}
          </motion.button>

          <motion.button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-500 hover:bg-red-500/10 transition-all duration-200"
            variants={itemVariants}
            whileHover={{ x: isCollapsed ? 0 : 4 }}
            whileTap={{ scale: 0.95 }}
            title={isCollapsed ? "Logout" : ""}
          >
            <LogOut size={20} />
            {!isCollapsed && <span className="font-medium">Logout</span>}
          </motion.button>
        </motion.div>

        {isCollapsed && (
          <motion.div className="px-4 py-4 text-center">
            <Zap size={20} className="text-button-primary mx-auto" />
          </motion.div>
        )}
      </motion.div>

      {isOpen && !isCollapsed && (
        <div className="fixed inset-0 lg:static lg:w-80" />
      )}
    </>
  );
};

export default Sidebar;