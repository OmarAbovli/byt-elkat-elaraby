
import { useState, useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";
import UserDropdown from "./UserDropdown";
import CalligraphyTitle from "./CalligraphyTitle";
import { ShoppingCart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/providers/CartProvider";
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { setIsOpen: setIsCartOpen, items } = useCart();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "الرئيسية", labelEn: "Home", href: "/" },
    { label: "الدورات", labelEn: "Courses", href: "/courses" },
    { label: "شجرة العائلة", labelEn: "Family Tree", href: "/family-tree" },
    { label: "المسارات", labelEn: "Paths", href: "/paths" },
    { label: "المتجر", labelEn: "Store", href: "/store", isSpecial: true },
    { label: "المدونة", labelEn: "Blog", href: "/blog" },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? "bg-[#0E1A2A]/80 backdrop-blur-xl border-b border-white/5 py-4"
          : "bg-transparent py-6"
        }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.a
            href="/"
            className="flex items-center gap-3 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img src="/logo.webp" alt="Logo" className="h-12 w-auto relative z-10" />
            </div>
            <div className="flex flex-col">
              <CalligraphyTitle size="sm" className="h-10 w-auto text-foreground" />
              <span className="hidden sm:block text-[10px] text-muted-foreground mt-1 group-hover:text-primary transition-colors">
                المنصة الأولى للخط العربي
              </span>
            </div>
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2 bg-white/5 p-1.5 rounded-full border border-white/5 backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  className={`relative px-5 py-2 rounded-full font-cairo text-sm font-medium transition-all duration-300 ${isActive
                      ? "bg-primary text-primary-foreground shadow-[0_0_20px_rgba(46,182,232,0.3)]"
                      : link.isSpecial
                        ? "text-accent hover:bg-accent/10"
                        : "text-foreground/70 hover:text-foreground hover:bg-white/5"
                    }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-primary rounded-full -z-10"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </div>

          {/* Auth & Cart */}
          <div className="hidden lg:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-foreground/80 hover:text-primary hover:bg-primary/10 rounded-full w-10 h-10"
                  onClick={() => setIsCartOpen(true)}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {items.length > 0 && (
                    <span className="absolute top-0 right-0 w-2 h-2 bg-accent rounded-full animate-pulse ring-2 ring-background"></span>
                  )}
                </Button>
                <UserDropdown />
              </>
            ) : (
              <div className="flex items-center gap-3">
                <a href="/auth">
                  <Button variant="ghost" className="text-foreground/70 hover:text-foreground hover:bg-white/5 rounded-full">
                    تسجيل الدخول
                  </Button>
                </a>
                <a href="/auth?mode=register">
                  <Button className="bg-gradient-to-r from-accent to-accent/80 text-white border-0 hover:shadow-[0_0_20px_rgba(243,156,18,0.4)] transition-all duration-300 rounded-full px-6">
                    ابدأ الآن
                  </Button>
                </a>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-foreground/80 hover:text-primary transition-colors"
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
            className="lg:hidden bg-[#0E1A2A]/95 backdrop-blur-xl border-b border-white/5 overflow-hidden"
          >
            <div className="container mx-auto px-6 py-6 space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={`block px-4 py-3 rounded-xl transition-all duration-300 font-cairo ${location.pathname === link.href
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/70 hover:bg-white/5 hover:text-foreground"
                    }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-4 border-t border-white/10 mt-4 space-y-3">
                {!isAuthenticated && (
                  <>
                    <a href="/auth" className="block">
                      <Button variant="ghost" className="w-full justify-center rounded-xl">
                        تسجيل الدخول
                      </Button>
                    </a>
                    <a href="/auth?mode=register" className="block">
                      <Button className="w-full justify-center bg-accent text-white hover:bg-accent/90 rounded-xl">
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
