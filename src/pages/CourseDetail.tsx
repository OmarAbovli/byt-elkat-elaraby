import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { motion } from "framer-motion";
import { Play, Lock, Clock, BookOpen, CheckCircle2, ChevronLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { courses, lessons, enrollments, packageCourses, packageLessons, pathCourses } from "@/lib/schema";
import { eq, and, asc, sql } from "drizzle-orm";
import { useAuth } from "@/providers/AuthProvider";
import { useCart } from "@/providers/CartProvider";
import { useToast } from "@/hooks/use-toast";

const CourseDetail = () => {
    const { slug } = useParams();
    const { user } = useAuth();
    const { toast } = useToast();
    const { addItem } = useCart();
    const navigate = useNavigate();
    const [course, setCourse] = useState<any>(null);
    const [lessonList, setLessonList] = useState<any[]>([]);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [accessibleLessonIds, setAccessibleLessonIds] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!slug) return;
            try {
                // 1. Fetch Course
                const courseResult = await db.select().from(courses).where(eq(courses.slug, slug)).limit(1);
                if (courseResult.length === 0) {
                    setIsLoading(false);
                    return;
                }
                const foundCourse = courseResult[0];
                setCourse(foundCourse);

                // 2. Fetch Lessons
                const lessonsResult = await db.select()
                    .from(lessons)
                    .where(eq(lessons.courseId, foundCourse.id))
                    .orderBy(asc(lessons.order));
                setLessonList(lessonsResult);

                // 3. Check Enrollment if user is logged in
                if (user?.id) {
                    // Check direct enrollment
                    const directEnrollment = await db.select()
                        .from(enrollments)
                        .where(and(eq(enrollments.userId, user.id), eq(enrollments.courseId, foundCourse.id)))
                        .limit(1);

                    if (directEnrollment.length > 0) {
                        setIsEnrolled(true);
                    } else {
                        // Check if enrolled via a package
                        const packageEnrollment = await db
                            .select({ id: enrollments.id })
                            .from(enrollments)
                            .innerJoin(packageCourses, eq(enrollments.packageId, packageCourses.packageId))
                            .where(and(eq(enrollments.userId, user.id), eq(packageCourses.courseId, foundCourse.id)))
                            .limit(1);

                        if (packageEnrollment.length > 0) {
                            setIsEnrolled(true);
                        } else {
                            // Check for path access
                            const pathEnrollment = await db
                                .select({ id: enrollments.id })
                                .from(enrollments)
                                .innerJoin(pathCourses, eq(enrollments.pathId, pathCourses.pathId))
                                .where(and(eq(enrollments.userId, user.id), eq(pathCourses.courseId, foundCourse.id)))
                                .limit(1);

                            if (pathEnrollment.length > 0) {
                                setIsEnrolled(true);
                            }
                        }

                        // Also check for specific individual lessons from other packages
                        const packageLessonsAccess = await db
                            .select({ id: packageLessons.lessonId })
                            .from(enrollments)
                            .innerJoin(packageLessons, eq(enrollments.packageId, packageLessons.packageId))
                            .where(eq(enrollments.userId, user.id));

                        setAccessibleLessonIds(packageLessonsAccess.map(l => l.id));
                    }
                }
            } catch (error) {
                console.error("Error fetching course detail:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [slug, user?.id]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gold" />
            </div>
        );
    }

    if (!course) {
        return <div className="min-h-screen bg-background flex items-center justify-center font-cairo">الدورة غير موجودة</div>;
    }

    const courseSchema = {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": course.title,
        "description": course.description,
        "provider": {
            "@type": "Organization",
            "name": "بيت الخط العربي",
            "sameAs": "https://baytalkhattal-arabi.com"
        },
        "image": course.coverImage,
        "offers": {
            "@type": "Offer",
            "category": "Paid",
            "priceCurrency": "USD",
            "price": course.price,
            "availability": "https://schema.org/InStock"
        },
        "hasCourseInstance": {
            "@type": "CourseInstance",
            "courseMode": "Online",
            "courseWorkload": `PT${course.durationHours}H`
        }
    };

    return (
        <div className="min-h-screen bg-background" dir="rtl">
            <SEO
                title={course.title}
                description={course.description}
                image={course.coverImage}
                url={`https://baytalkhattal-arabi.com/course/${course.slug}`}
                type="article"
                keywords={`تعلم الخط العربي, ${course.title}, دورات خط عربي, محمد بيومي, ${course.title} online`}
                schema={courseSchema}
            />
            <Navbar />

            <main className="pt-32 pb-20">
                <div className="container mx-auto px-6">
                    {/* Course Hero */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="lg:col-span-2 space-y-6"
                        >
                            <nav className="flex items-center gap-2 text-sm text-muted-foreground font-cairo mb-4">
                                <Link to="/courses" className="hover:text-gold transition-colors">الدورات</Link>
                                <ChevronLeft className="w-4 h-4" />
                                <span className="text-gold">{course.title}</span>
                            </nav>

                            <h1 className="text-4xl md:text-5xl font-amiri font-bold text-foreground leading-tight">
                                {course.title}
                            </h1>

                            <p className="text-lg text-muted-foreground font-cairo leading-relaxed">
                                {course.description}
                            </p>

                            <div className="flex flex-wrap gap-6 pt-4">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-gold" />
                                    <span className="font-cairo text-sm">{course.durationHours} ساعة من المحتوى</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-gold" />
                                    <span className="font-cairo text-sm">{lessonList.length} درس تعليمي</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-gold" />
                                    <span className="font-cairo text-sm">شهادة إتمام</span>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="card-luxury p-6 h-fit sticky top-32"
                        >
                            <img
                                src={course.coverImage || "/placeholder.jpg"}
                                alt={course.title}
                                className="w-full aspect-video object-cover rounded-xl mb-6 shadow-2xl"
                            />

                            <div className="space-y-4">
                                <div className="text-3xl font-bold font-mono text-gold-gradient text-center">
                                    {course.isFree ? "مجاني" : `$${course.price}`}
                                </div>

                                {isEnrolled ? (
                                    <Button className="w-full btn-emerald h-12 text-lg font-cairo" onClick={() => {
                                        if (lessonList.length > 0) {
                                            navigate(`/course/${course.slug}/lesson/${lessonList[0].id}`);
                                        }
                                    }}>
                                        استكمال التعلم
                                    </Button>
                                ) : (
                                    <Button className="w-full btn-gold h-12 text-lg font-cairo" onClick={() => {
                                        addItem({
                                            id: course.id,
                                            name: course.title,
                                            price: parseFloat(course.price),
                                            image: course.coverImage,
                                            type: 'course'
                                        });
                                        navigate("/checkout");
                                    }}>
                                        اشترك الآن
                                    </Button>
                                )}

                                <p className="text-xs text-center text-muted-foreground font-cairo">
                                    ضمان استرداد الأموال خلال 14 يوماً
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Lesson List */}
                    <div className="max-w-4xl">
                        <h2 className="text-2xl font-bold font-amiri mb-8 border-r-4 border-gold pr-4">محتوى الدورة</h2>

                        <div className="space-y-4">
                            {lessonList.map((lesson, index) => {
                                const canWatch = isEnrolled || lesson.isFree || accessibleLessonIds.includes(lesson.id);

                                return (
                                    <motion.div
                                        key={lesson.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className={`card-luxury p-1 group transition-all ${canWatch ? 'hover:bg-gold/5 cursor-pointer' : 'opacity-70'}`}
                                        onClick={() => {
                                            if (canWatch) {
                                                navigate(`/course/${course.slug}/lesson/${lesson.id}`);
                                            } else {
                                                toast({
                                                    title: "محتوى مقفل",
                                                    description: "هذا الدرس يتطلب الاشتراك في الدورة لمشاهدته.",
                                                    variant: "destructive"
                                                });
                                            }
                                        }}
                                    >
                                        <div className="flex items-center gap-4 p-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${canWatch ? 'bg-gold/10 text-gold' : 'bg-muted text-muted-foreground'}`}>
                                                {canWatch ? <Play className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                                            </div>

                                            <div className="flex-1">
                                                <h3 className="font-bold font-cairo text-sm flex items-center gap-2">
                                                    <span>{index + 1}.</span>
                                                    {lesson.title}
                                                    {lesson.isFree && !isEnrolled && (
                                                        <span className="text-[10px] bg-emerald/10 text-emerald-light px-2 py-0.5 rounded-full">مجاني (معاينة)</span>
                                                    )}
                                                </h3>
                                                <p className="text-xs text-muted-foreground font-cairo mt-1">
                                                    {lesson.duration} دقيقة
                                                </p>
                                            </div>

                                            {canWatch && (
                                                <Button variant="ghost" className="text-gold opacity-0 group-hover:opacity-100 transition-opacity font-cairo text-xs">
                                                    شاهد الآن
                                                </Button>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default CourseDetail;
