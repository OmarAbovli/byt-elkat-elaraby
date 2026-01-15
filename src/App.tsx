import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./providers/AuthProvider";
import { CartProvider } from "./providers/CartProvider";
import CartDrawer from "./components/CartDrawer";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Courses from "./pages/admin/Courses";
import Packages from "./pages/admin/Packages";
import Lessons from "./pages/admin/Lessons";
import Paths from "./pages/admin/Paths";
import Products from "./pages/admin/Products";
import Users from "./pages/admin/Users";
import Payments from "./pages/admin/Payments";
import Certificates from "./pages/admin/Certificates";
import Analytics from "./pages/admin/Analytics";
import Settings from "./pages/admin/Settings";
import StudentDashboard from "./pages/student/Dashboard";
import StudentSettings from "./pages/student/Settings";
import StudentCertificates from "./pages/student/Certificates";
import CoursesPage from "./pages/Courses";
import PathsPage from "./pages/Paths";
import StorePage from "./pages/Store";
import BlogPage from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import AdminBlog from "@/pages/admin/Blog";
import FamilyTree from "./pages/FamilyTree";
import Checkout from "./pages/Checkout";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";
import CourseDetail from "./pages/CourseDetail";
import LessonView from "./pages/LessonView";
import PackageDetail from "./pages/PackageDetail";
import CertificatePreview from "./pages/CertificatePreview";
import CertificateVerify from "./pages/CertificateVerify";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <CartDrawer />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/course/:slug" element={<CourseDetail />} />
              <Route path="/course/:slug/lesson/:lessonId" element={<LessonView />} />
              <Route path="/package/:id" element={<PackageDetail />} />
              <Route path="/paths" element={<PathsPage />} />
              <Route path="/store" element={<StorePage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/family-tree" element={<FamilyTree />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/certificate-preview" element={<CertificatePreview />} />
              <Route path="/verify" element={<CertificateVerify />} />
              <Route path="/verify/:id" element={<CertificateVerify />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/dashboard" element={<StudentDashboard />} />
              <Route path="/my-certificates" element={<StudentCertificates />} />
              <Route path="/settings" element={<StudentSettings />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="courses" element={<Courses />} />
                <Route path="packages" element={<Packages />} />
                <Route path="lessons" element={<Lessons />} />
                <Route path="paths" element={<Paths />} />
                <Route path="products" element={<Products />} />
                <Route path="blog" element={<AdminBlog />} />
                <Route path="users" element={<Users />} />
                <Route path="payments" element={<Payments />} />
                <Route path="certificates" element={<Certificates />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="settings" element={<Settings />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
            <TooltipProvider>
              <Toaster />
              <Sonner />
            </TooltipProvider>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
