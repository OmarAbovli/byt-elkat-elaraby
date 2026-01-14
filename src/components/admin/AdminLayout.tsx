import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import AdminSidebar from "./AdminSidebar";
import { Loader2 } from "lucide-react";
import { useCart } from "@/providers/CartProvider";

const AdminLayout = () => {
  const { user, isAuthenticated } = useAuth();
  const { setIsOpen } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    // Close cart drawer when entering admin
    setIsOpen(false);
  }, [setIsOpen]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
    } else if (user?.role !== 'admin') {
      navigate("/");
    }
  }, [user, isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <h1 className="text-2xl font-bold text-destructive">غير مصرح لك بالدخول</h1>
        <p className="text-muted-foreground">هذه الصفحة مخصصة للمسؤولين فقط</p>
        <button onClick={() => navigate("/")} className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
          العودة للرئيسية
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <AdminSidebar />
      <main className="mr-64 min-h-screen p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
