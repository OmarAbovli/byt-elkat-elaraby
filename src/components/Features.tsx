import { motion } from "framer-motion";
import { 
  Video, 
  Shield, 
  Award, 
  Brain, 
  ShoppingBag, 
  BookOpen,
  Lock,
  Globe
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Video,
      title: "دروس فيديو احترافية",
      titleEn: "Professional Video Lessons",
      description: "فيديوهات عالية الجودة مع حماية متقدمة ضد النسخ والتحميل",
    },
    {
      icon: Shield,
      title: "حماية المحتوى",
      titleEn: "Content Protection",
      description: "تشفير متقدم وعلامات مائية لحماية المحتوى الحصري",
    },
    {
      icon: Award,
      title: "شهادات معتمدة",
      titleEn: "Certified Credentials",
      description: "احصل على شهادات رقمية قابلة للتحقق عند إتمام كل دورة",
    },
    {
      icon: Brain,
      title: "مدرب الخط الذكي",
      titleEn: "AI Calligraphy Coach",
      description: "ذكاء اصطناعي يحلل خطك ويقدم ملاحظات فورية لتحسينه",
    },
    {
      icon: ShoppingBag,
      title: "متجر رقمي",
      titleEn: "Digital Store",
      description: "أوراق تمارين، كتب PDF، قوالب وأدوات رقمية حصرية",
    },
    {
      icon: BookOpen,
      title: "مسارات تعليمية",
      titleEn: "Learning Paths",
      description: "رحلات تعليمية مصممة بعناية من المبتدئين للمحترفين",
    },
    {
      icon: Lock,
      title: "محتوى حصري",
      titleEn: "Exclusive Content",
      description: "دروس ومواد متاحة فقط للمشتركين المميزين",
    },
    {
      icon: Globe,
      title: "دعم متعدد اللغات",
      titleEn: "Multi-language Support",
      description: "واجهة بالعربية والإنجليزية لتجربة سلسة عالمياً",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="relative py-32 overflow-hidden" id="features">
      {/* Background */}
      <div className="absolute inset-0 geometric-pattern opacity-20" />
      
      <div className="container mx-auto px-6 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="text-gold text-sm font-cairo tracking-wider uppercase mb-4 block">
            لماذا بيت الخط؟
          </span>
          <h2 className="text-4xl md:text-5xl font-amiri font-bold mb-6">
            <span className="text-gold-gradient">منصة متكاملة</span>
            <br />
            <span className="text-foreground">لتعلم الخط العربي</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-cairo leading-arabic">
            نجمع بين أصالة الفن العربي وأحدث التقنيات التعليمية لنقدم لك تجربة
            تعليمية فريدة لا مثيل لها
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group card-luxury p-8 hover:border-gold/30 transition-all duration-500"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold/20 to-emerald/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <feature.icon className="w-7 h-7 text-gold" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-cairo text-foreground group-hover:text-gold transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground font-cairo text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
