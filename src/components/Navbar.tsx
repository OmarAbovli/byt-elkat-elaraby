import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import UserDropdown from "./UserDropdown";
import CalligraphyTitle from "./CalligraphyTitle";
import { ShoppingCart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/providers/CartProvider";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuth(); // Get auth state
  const { setIsOpen: setIsCartOpen, items } = useCart();

  const navLinks = [
    { label: "الرئيسية", labelEn: "Home", href: "/" },
    { label: "الدورات", labelEn: "Courses", href: "/courses" },
    { label: "شجرة العائلة", labelEn: "Family Tree", href: "/family-tree" },
    { label: "المسارات", labelEn: "Paths", href: "/paths" },
    { label: "المتجر", labelEn: "Store", href: "/store" },
    { label: "المدونة", labelEn: "Blog", href: "/blog" },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50"
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-3 cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.location.href = "/"}
          >
            <img src="/logo.webp" alt="Logo" className="h-12 w-auto" />
            <div className="flex flex-col">
              <CalligraphyTitle size="sm" className="h-10 w-auto" />
              <span className="hidden sm:block text-[10px] text-muted-foreground mt-1">
                المنصة الأولى للخط العربي
              </span>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link, index) => (
              <motion.a
                key={link.label}
                href={link.href}
                className="relative text-foreground/80 hover:text-foreground transition-colors underline-animated py-2"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <span className="font-cairo font-medium">{link.label}</span>
              </motion.a>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  onClick={() => setIsCartOpen(true)}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {items.length > 0 && (
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  )}
                </Button>
                <UserDropdown />
              </>
            ) : (
              <>
                <a href="/auth">
                  <Button variant="ghost" className="text-foreground/80 hover:text-foreground">
                    تسجيل الدخول
                  </Button>
                </a>
                <a href="/auth?mode=register">
                  <Button className="btn-gold text-sm px-6 py-2">
                    ابدأ الآن
                  </Button>
                </a>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-foreground"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background/95 backdrop-blur-xl border-b border-border"
          >
            <div className="container mx-auto px-6 py-6 space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block text-foreground/80 hover:text-foreground transition-colors py-2 font-cairo"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-3 pt-4 border-t border-border">
                {isAuthenticated ? (
                  <div className="flex flex-col gap-2">
                    <a href="/dashboard" className="w-full">
                      <Button className="btn-gold w-full justify-center">
                        لوحة التحكم
                      </Button>
                    </a>
                  </div>
                ) : (
                  <>
                    <a href="/auth" className="w-full">
                      <Button variant="ghost" className="w-full justify-center">
                        تسجيل الدخول
                      </Button>
                    </a>
                    <a href="/auth?mode=register" className="w-full">
                      <Button className="btn-gold w-full justify-center">
                        ابدأ الآن
                      </Button>
                    </a>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
