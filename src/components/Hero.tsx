import { motion } from "framer-motion";
import { Play, Award, Users, BookOpen, Loader2 } from "lucide-react";
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
        // Fetch counts using raw sql or aggregation
        // Count courses
        const coursesCount = await db.select({ count: sql<number>`count(*)` }).from(courses);

        // Count students (users with role 'student' or just all users)
        const studentsCount = await db.select({ count: sql<number>`count(*)` }).from(profiles);

        // Count enrollments as proxy for certificates or "active learning"
        const enrollmentsCount = await db.select({ count: sql<number>`count(*)` }).from(enrollments);

        setCounts({
          courses: Number(coursesCount[0]?.count) || 0,
          students: Number(studentsCount[0]?.count) || 0,
          certificates: Number(enrollmentsCount[0]?.count) || 0 // Using enrollments as "Certificates/Active" metric
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
    { icon: BookOpen, value: isLoading ? "..." : `+${counts.courses}`, label: "دورة تعليمية" },
    { icon: Users, value: isLoading ? "..." : `+${counts.students}`, label: "طالب مسجل" },
    { icon: Award, value: isLoading ? "..." : "100%", label: "شهادات معتمدة" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-[#000000]">
      {/* Dynamic Background with Reference Aesthetic */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a2f1f]/40 via-[#000000] to-[#000000]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#0d4d33]/20 rounded-full blur-[120px] anima-glow" />

        {/* Subtle Calligraphic Texture Background */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'contrast(1.5) brightness(0.5)'
          }}
        />
      </div>

      {/* Geometric Pattern Overlay */}
      <div className="absolute inset-0 geometric-pattern opacity-20" />

      {/* Content */}
      <div className="relative container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold/30 bg-gold/5 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span className="text-gold text-sm font-cairo">
              أكاديمية الخط العربي الأولى عالمياً
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8 flex justify-center overflow-visible"
          >
            <CalligraphyTitle size="lg" className="w-full max-w-[400px] md:max-w-[700px] lg:max-w-[900px] h-auto" />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-xl md:text-2xl text-foreground/80 font-cairo leading-relaxed mb-4"
          >
            حيث يلتقي الفن بالتعليم
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg text-muted-foreground font-cairo max-w-2xl mx-auto mb-10 leading-arabic"
          >
            انضم إلى أكبر منصة تعليمية للخط العربي في العالم. تعلم من كبار الخطاطين
            واحصل على شهادات معتمدة في فن الخط العربي الأصيل.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link to="/auth">
              <Button className="btn-gold text-lg px-10 py-6 group">
                <span>ابدأ رحلتك الآن</span>
                <motion.span
                  className="mr-2 inline-block"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  ←
                </motion.span>
              </Button>
            </Link>
            <Link to="/courses">
              <Button className="btn-emerald text-lg px-10 py-6 group">
                <Play size={20} className="ml-2" />
                <span>شاهد الدورات</span>
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-3 gap-8 max-w-2xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                <stat.icon className="w-6 h-6 text-gold mx-auto mb-2" />
                <div className="text-2xl md:text-3xl font-bold text-foreground font-cairo">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground font-cairo">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-gold/50 flex items-start justify-center p-2">
          <motion.div
            className="w-1.5 h-3 bg-gold rounded-full"
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
