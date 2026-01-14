import { motion } from "framer-motion";
import { Clock, Users, Star, Lock, Play, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { db } from "@/lib/db";
import { courses, profiles } from "@/lib/schema";
import { desc, eq } from "drizzle-orm";

interface CoursePreview {
  id: string;
  title: string;
  instructor: string;
  image: string;
  duration: number;
  students: number;
  rating: string;
  level: string;
  price: string;
}

const CoursesPreview = () => {
  const [coursesList, setCoursesList] = useState<CoursePreview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Fetch top 3 published courses
        const data = await db
          .select({
            id: courses.id,
            title: courses.title,
            image: courses.coverImage,
            duration: courses.durationHours,
            students: courses.studentsCount,
            rating: courses.rating,
            level: courses.level,
            price: courses.price,
            instructorName: profiles.fullName,
            instructorUser: profiles.username
          })
          .from(courses)
          .leftJoin(profiles, eq(courses.instructorId, profiles.id))
          .where(eq(courses.isPublished, true))
          .orderBy(desc(courses.createdAt))
          .limit(3);

        setCoursesList(data.map(c => ({
          id: c.id,
          title: c.title,
          instructor: c.instructorName || c.instructorUser || "بيت الخط",
          image: c.image || "",
          duration: c.duration || 0,
          students: c.students || 0,
          rating: c.rating ? c.rating.toString() : "5.0",
          level: c.level === 'beginner' ? 'مبتدئ' : c.level === 'intermediate' ? 'متوسط' : 'متقدم',
          price: c.price ? c.price.toString() : "0",
        })));
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (isLoading) {
    return (
      <div className="py-24 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  if (coursesList.length === 0) return null;

  return (
    <section className="relative py-32 overflow-hidden" id="courses">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-obsidian-light/50 to-background" />
      <div className="absolute inset-0 geometric-pattern opacity-10" />

      <div className="container mx-auto px-6 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-gold text-sm font-cairo tracking-wider uppercase mb-4 block">
            اكتشف دوراتنا
          </span>
          <h2 className="text-4xl md:text-5xl font-amiri font-bold mb-6">
            <span className="text-foreground">دورات</span>{" "}
            <span className="text-gold-gradient">حصرية</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-cairo">
            تعلم من نخبة الخطاطين العرب عبر دورات مصممة بعناية فائقة
          </p>
        </motion.div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {coursesList.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group"
            >
              <div className="card-luxury overflow-hidden h-full flex flex-col">
                {/* Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden bg-background/50">
                  {course.image ? (
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-secondary/20">
                      <Play className="w-12 h-12 text-muted-foreground/30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-16 h-16 rounded-full bg-gold/90 flex items-center justify-center cursor-pointer"
                    >
                      <Play className="w-6 h-6 text-background mr-[-2px]" fill="currentColor" />
                    </motion.div>
                  </div>

                  {/* Level Badge */}
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-gold/90 text-background text-xs font-bold font-cairo">
                    {course.level}
                  </div>

                  {/* Lock Badge */}
                  <div className="absolute top-4 left-4 p-2 rounded-full bg-background/80 backdrop-blur-sm">
                    <Lock className="w-4 h-4 text-gold" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold font-cairo text-foreground mb-2 group-hover:text-gold transition-colors line-clamp-1">
                    {course.title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-cairo mb-4">
                    {course.instructor}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4 mt-auto">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span className="font-cairo">{course.duration} ساعة</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span className="font-cairo">{course.students.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-gold fill-gold" />
                      <span className="font-cairo text-gold">{course.rating}</span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-border mb-4" />

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-foreground font-cairo">
                        ${course.price}
                      </span>
                    </div>
                    <Button className="btn-gold text-sm px-6 py-2">
                      معاينة الدورة
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <a href="/courses">
            <Button className="btn-emerald text-lg px-10 py-6">
              استعرض جميع الدورات
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default CoursesPreview;
