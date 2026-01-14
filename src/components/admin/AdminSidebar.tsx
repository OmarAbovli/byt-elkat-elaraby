import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Video,
  Users,
  CreditCard,
  Package,
  ShoppingBag,
  Award,
  Settings,
  BarChart3,
  Route,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";

const AdminSidebar = () => {
  const location = useLocation();
  const { logout, user } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: "لوحة التحكم", path: "/admin" },
    { icon: BookOpen, label: "الدورات", path: "/admin/courses" },
    { icon: Video, label: "الدروس", path: "/admin/lessons" },
    { icon: Route, label: "المسارات", path: "/admin/paths" },
    { icon: Package, label: "الباقات", path: "/admin/packages" },
    { icon: ShoppingBag, label: "المتجر", path: "/admin/products" },
    { icon: Users, label: "المستخدمين", path: "/admin/users" },
    { icon: CreditCard, label: "المدفوعات", path: "/admin/payments" },
    { icon: Award, label: "الشهادات", path: "/admin/certificates" },
    { icon: LayoutDashboard, label: "المدونة", path: "/admin/blog" },
    { icon: BarChart3, label: "الإحصائيات", path: "/admin/analytics" },
    { icon: Settings, label: "الإعدادات", path: "/admin/settings" },
  ];

  return (
    <motion.aside
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-64 h-screen bg-card border-l border-border fixed right-0 top-0 flex flex-col z-[60]"
    >
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link to="/" className="flex items-center gap-2">
          <h1 className="text-2xl font-amiri font-bold text-gold-gradient">
            بيت الخط
          </h1>
        </Link>
        <p className="text-xs text-muted-foreground font-cairo mt-1">
          لوحة التحكم
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-cairo text-sm ${isActive
                    ? "bg-gold/20 text-gold border border-gold/30"
                    : "text-foreground/70 hover:bg-muted hover:text-foreground"
                    }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
            <span className="text-gold font-bold">
              {user?.fullName?.charAt(0) || "A"}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold font-cairo text-foreground truncate">
              {user?.fullName || "Admin"}
            </p>
            <p className="text-xs text-muted-foreground">مدير</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 w-full px-4 py-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors font-cairo text-sm"
        >
          <LogOut className="w-4 h-4" />
          تسجيل الخروج
        </button>
      </div>
    </motion.aside>
  );
};

export default AdminSidebar;
