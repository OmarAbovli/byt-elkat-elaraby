import { motion } from "framer-motion";
import {
  Facebook,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Send,
  MessageCircle
} from "lucide-react";

const Footer = () => {
  const socialLinks = [
    { icon: Youtube, href: "https://www.youtube.com/@Bayt_Alkhatt_Ar", label: "YouTube" },
    { icon: MessageCircle, href: "https://api.whatsapp.com/message/GVXG3RDYCH6ZP1?autoload=1&app_absent=0", label: "WhatsApp" },
    { icon: Send, href: "https://t.me/baitulkhtalarabi", label: "Telegram" },
    { icon: Twitter, href: "https://x.com/treedisgain", label: "X (Twitter)" },
  ];

  const quickLinks = [
    { label: "الدورات", href: "/courses" },
    { label: "شجرة العائلة", href: "/family-tree" },
    { label: "المسارات التعليمية", href: "/paths" },
    { label: "المتجر", href: "/store" },
    { label: "المدونة", href: "/blog" },
  ];

  const supportLinks = [
    { label: "سياسة الخصوصية", href: "/privacy-policy" },
    { label: "شروط الاستخدام", href: "/terms" },
    { label: "تواصل معنا", href: "/contact" },
  ];

  return (
    <footer className="relative pt-20 pb-10 overflow-hidden border-t border-border/50">
      {/* Background */}
      <div className="absolute inset-0 geometric-pattern opacity-10" />

      <div className="container mx-auto px-6 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-3xl font-amiri font-bold text-gold-gradient mb-4">
              بيت الخط
            </h3>
            <p className="text-muted-foreground font-cairo text-sm leading-relaxed mb-6">
              الأكاديمية العالمية الأولى لتعليم فن الخط العربي الأصيل. نجمع بين
              التراث والتقنية لنقدم تجربة تعليمية فريدة.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-xl bg-muted/50 hover:bg-gold/20 flex items-center justify-center transition-colors group"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-muted-foreground group-hover:text-gold transition-colors" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="text-lg font-bold font-cairo text-foreground mb-6">
              روابط سريعة
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-gold transition-colors font-cairo text-sm underline-animated"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-lg font-bold font-cairo text-foreground mb-6">
              الدعم
            </h4>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-gold transition-colors font-cairo text-sm underline-animated"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="text-lg font-bold font-cairo text-foreground mb-6">
              تواصل معنا
            </h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-gold" />
                </div>
                <span className="text-muted-foreground font-cairo text-sm">
                  abuhafs1979@gmail.com
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-gold" />
                </div>
                <span className="text-muted-foreground font-cairo text-sm" dir="ltr">
                  +20 109 704 7780
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-gold" />
                </div>
                <span className="text-muted-foreground font-cairo text-sm">
                  بيت الخط العربي - مصر
                </span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="divider-ornate mb-8" />

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <p className="text-muted-foreground text-sm font-cairo">
            © 2025 بيت الخط العربي. جميع الحقوق محفوظة.
          </p>
          <p className="text-muted-foreground/60 text-xs font-cairo mt-2">
            Bayt Al-Khatt - The Global Arabic Calligraphy Academy
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
