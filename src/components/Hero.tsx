
import { motion } from "framer-motion";
import { Play, Award, Users, BookOpen, Feather } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-main.png";
import { useEffect, useState } from "react";
import { db } from "@/lib/db";
import { courses, profiles, enrollments } from "@/lib/schema";
import { sql } from "drizzle-orm";
import { Link } from "react-router-dom";
import CalligraphyTitle from "./CalligraphyTitle";

const Hero = () => {
  const [counts, setCounts] = useState({
    courses: 0,
    students: 0,
    certificates: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const coursesCount = await db.select({ count: sql<number>`count(*)` }).from(courses);
        const studentsCount = await db.select({ count: sql<number>`count(*)` }).from(profiles);
        const enrollmentsCount = await db.select({ count: sql<number>`count(*)` }).from(enrollments);

        setCounts({
          courses: Number(coursesCount[0]?.count) || 0,
          students: Number(studentsCount[0]?.count) || 0,
          certificates: Number(enrollmentsCount[0]?.count) || 0
        });

      } catch (error) {
        console.error("Error fetching hero stats:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { icon: BookOpen, value: isLoading ? "..." : `+${counts.courses}`, label: "دورة تعليمية", color: "text-primary" },
    { icon: Users, value: isLoading ? "..." : `+${counts.students}`, label: "طالب مسجل", color: "text-accent" },
    { icon: Award, value: isLoading ? "..." : "100%", label: "شهادات معتمدة", color: "text-primary" },
  ];

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20 bg-background">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />

        {/* Animated Glows */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[100px] animate-pulse delay-1000" />

        {/* Subtle Texture */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('/noise.png')] mix-blend-overlay" />

        {/* Hero Image Overlay */}
        <div className="absolute inset-0 z-0 opacity-10">
          <img src={heroImage} className="w-full h-full object-cover object-center grayscale mix-blend-overlay" alt="Background" />
        </div>
      </div>

      <div className="relative container mx-auto px-6 z-10">
        <div className="max-w-5xl mx-auto text-center">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-md mb-8"
          >
            <Feather className="w-4 h-4 text-accent animate-pulse" />
            <span className="text-foreground/90 text-sm font-medium font-cairo">
              أكاديمية الخط العربي الأولى عالمياً
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6 flex justify-center"
          >
            <CalligraphyTitle size="lg" className="h-auto w-full max-w-[800px] text-foreground drop-shadow-[0_0_15px_rgba(46,182,232,0.3)]" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-2xl text-muted-foreground font-cairo max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            حيث يلتقي <span className="text-primary font-bold">الفن الأصيل</span> بالتعليم الحديث.
            انضم إلينا لتعلم أسرار الخط العربي من كبار الأساتذة.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20"
          >
            <Link to="/auth?mode=register">
              <Button className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-white text-lg shadow-[0_0_30px_rgba(46,182,232,0.3)] hover:shadow-[0_0_50px_rgba(46,182,232,0.5)] transition-all duration-300">
                ابدأ رحلتك مجاناً
              </Button>
            </Link>
            <Link to="/courses">
              <Button variant="outline" className="h-14 px-8 rounded-2xl border-white/10 hover:bg-white/5 text-lg backdrop-blur-sm group">
                <Play className="ml-2 w-5 h-5 group-hover:text-accent transition-colors" />
                شاهد الدورات
              </Button>
            </Link>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 max-w-4xl mx-auto border-t border-white/5 pt-12"
          >
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <stat.icon className={`w-6 h-6 ${stat.color} mb-1`} />
                <div className="text-3xl font-bold font-cairo">{stat.value}</div>
                <div className="text-muted-foreground text-sm font-cairo">{stat.label}</div>
              </div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
