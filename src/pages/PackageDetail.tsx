import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import {
    Gem,
    CheckCircle2,
    Play,
    BookOpen,
    Clock,
    ChevronLeft,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { packages, packageCourses, courses, packageLessons, lessons } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { useCart } from "@/providers/CartProvider";

const PackageDetail = () => {
    const { id } = useParams();
    const { addItem } = useCart();
    const navigate = useNavigate();
    const [pkg, setPkg] = useState<any>(null);
    const [packageCoursesList, setPackageCoursesList] = useState<any[]>([]);
    const [packageLessonsList, setPackageLessonsList] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            try {
                // 1. Fetch Package
                const pkgResult = await db.select().from(packages).where(eq(packages.id, id)).limit(1);
                if (pkgResult.length === 0) {
                    setIsLoading(false);
                    return;
                }
                setPkg(pkgResult[0]);

                // 2. Fetch Courses in this package
                const coursesInPkg = await db
                    .select({
                        course: courses
                    })
                    .from(packageCourses)
                    .innerJoin(courses, eq(packageCourses.courseId, courses.id))
                    .where(eq(packageCourses.packageId, id));

                setPackageCoursesList(coursesInPkg.map(c => c.course));

                // 3. Fetch specific Lessons in this package
                const lessonsInPkg = await db
                    .select({
                        lesson: lessons,
                        courseSlug: courses.slug
                    })
                    .from(packageLessons)
                    .innerJoin(lessons, eq(packageLessons.lessonId, lessons.id))
                    .innerJoin(courses, eq(lessons.courseId, courses.id))
                    .where(eq(packageLessons.packageId, id));

                setPackageLessonsList(lessonsInPkg);
            } catch (error) {
                console.error("Error fetching package detail:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gold" />
            </div>
        );
    }

    if (!pkg) {
        return <div className="min-h-screen bg-background flex items-center justify-center font-cairo">الباقة غير موجودة</div>;
    }

    return (
        <div className="min-h-screen bg-background" dir="rtl">
            <Navbar />

            <main className="pt-32 pb-20">
                <div className="container mx-auto px-6">
                    <div className="max-w-6xl mx-auto">
                        {/* Package Header */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold/30 bg-gold/5 text-gold mb-4">
                                    <Gem className="w-4 h-4" />
                                    <span className="text-sm font-cairo">باقة اشتراك تعليمية</span>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-amiri font-bold text-foreground">
                                    {pkg.name}
                                </h1>
                                <p className="text-lg text-muted-foreground font-cairo leading-relaxed">
                                    {pkg.description}
                                </p>

                                <div className="space-y-4 py-6 text-foreground font-cairo">
                                    {(pkg.features as string[] || []).map((feature, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-gold" />
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex items-center gap-6 pt-4">
                                    <div className="text-4xl font-bold font-mono text-gold-gradient">
                                        ${pkg.price}
                                    </div>
                                    <Button className="btn-gold h-12 px-8 text-lg font-cairo" onClick={() => addItem({
                                        id: pkg.id,
                                        name: pkg.name,
                                        price: parseFloat(pkg.price),
                                        type: 'package'
                                    })}>
                                        اشترك الآن
                                    </Button>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="card-luxury p-8 bg-gold-dark/5 border-gold/20"
                            >
                                <div className="text-center space-y-4">
                                    <div className="w-20 h-20 rounded-2xl bg-gradient-gold flex items-center justify-center mx-auto text-background">
                                        <Gem className="w-10 h-10" />
                                    </div>
                                    <h3 className="text-xl font-bold font-cairo">محتويات الباقة</h3>
                                    <p className="text-muted-foreground font-cairo text-sm">
                                        تتضمن هذه الباقة {packageCoursesList.length} دورات تعليمية {packageLessonsList.length > 0 && `و ${packageLessonsList.length} دروس مختارة`}
                                    </p>
                                </div>
                            </motion.div>
                        </div>

                        {/* Individual Lessons List */}
                        {packageLessonsList.length > 0 && (
                            <div className="space-y-8 mb-20">
                                <h2 className="text-2xl font-bold font-amiri mb-8 border-r-4 border-gold pr-4">الدروس المشمولة</h2>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {packageLessonsList.map((item, idx) => (
                                        <motion.div
                                            key={item.lesson.id}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="card-luxury p-5 flex items-center gap-4 group hover:bg-gold/5"
                                        >
                                            <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold group-hover:scale-110 transition-transform">
                                                <Play className="w-5 h-5 fill-current" />
                                            </div>
                                            <div className="flex-1 overflow-hidden">
                                                <Link to={`/course/${item.courseSlug}/lesson/${item.lesson.id}`}>
                                                    <h4 className="font-bold font-cairo truncate group-hover:text-gold transition-colors">{item.lesson.title}</h4>
                                                    <p className="text-[10px] text-muted-foreground font-cairo truncate">درس مختار من الدورات</p>
                                                </Link>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Courses List */}
                        {packageCoursesList.length > 0 && (
                            <div className="space-y-8">
                                <h2 className="text-2xl font-bold font-amiri mb-8 border-r-4 border-gold pr-4">الدورات المشمولة</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {packageCoursesList.map((course, idx) => (
                                        <motion.div
                                            key={course.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="card-luxury p-4 group"
                                        >
                                            <Link to={`/course/${course.slug}`}>
                                                <div className="aspect-video overflow-hidden rounded-xl mb-4 relative">
                                                    <img
                                                        src={course.coverImage || "/placeholder.jpg"}
                                                        alt={course.title}
                                                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                                    />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <span className="text-white font-cairo border border-white/40 px-6 py-2 rounded-full backdrop-blur-md">عرض الدورة</span>
                                                    </div>
                                                </div>
                                                <h3 className="text-xl font-bold font-cairo mb-3 group-hover:text-gold transition-colors">
                                                    {course.title}
                                                </h3>
                                                <div className="flex items-center gap-4 text-sm text-muted-foreground font-cairo opacity-80">
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="w-4 h-4" />
                                                        <span>{course.durationHours} ساعة</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <BookOpen className="w-4 h-4" />
                                                        <span>{course.level}</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default PackageDetail;
