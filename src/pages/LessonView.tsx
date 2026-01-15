import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronRight,
    ChevronLeft,
    Play,
    Lock,
    CheckCircle2,
    BookOpen,
    Menu,
    X,
    Loader2,
    ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import VideoPlayer from "@/components/VideoPlayer";
import { db } from "@/lib/db";
import { courses, lessons, enrollments, packageCourses, packageLessons, pathCourses, certificates } from "@/lib/schema";
import { eq, and, asc, or } from "drizzle-orm";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/hooks/use-toast";

const LessonView = () => {
    const { slug, lessonId } = useParams();
    const { user } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();

    const [course, setCourse] = useState<any>(null);
    const [currentLesson, setCurrentLesson] = useState<any>(null);
    const [lessonList, setLessonList] = useState<any[]>([]);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [currentEnrollmentId, setCurrentEnrollmentId] = useState<string | null>(null);
    const [completedLessons, setCompletedLessons] = useState<string[]>([]);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!slug || !lessonId) return;
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

                // 3. Find current lesson
                const foundLesson = lessonsResult.find(l => l.id === lessonId);
                if (!foundLesson) {
                    setIsLoading(false);
                    return;
                }
                setCurrentLesson(foundLesson);

                // 4. Check Access & Enrollment
                let enrolled = false;
                if (user?.id) {
                    // Try to find direct enrollment first
                    const directEnrollment = await db.select()
                        .from(enrollments)
                        .where(and(eq(enrollments.userId, user.id), eq(enrollments.courseId, foundCourse.id)))
                        .limit(1);

                    if (directEnrollment.length > 0) {
                        enrolled = true;
                        setCurrentEnrollmentId(directEnrollment[0].id);
                        // Cast to string[] safely
                        const completed = (directEnrollment[0].completedLessons as string[]) || [];
                        setCompletedLessons(completed);
                    } else {
                        // Check package/path enrollment (Simplified: we only track progress on DIRECT course enrollments or create one if package exists?)
                        // For now, if package exists, we might need to CREATE a direct enrollment record to track progress correctly 
                        // OR we update the package enrollment? 
                        // The schema has courseId, packageId, pathId nullable.
                        // Ideally, we should find the RELEVANT enrollment record.

                        // Check package enrollment
                        const packageEnrollment = await db
                            .select({
                                id: enrollments.id,
                                completedLessons: enrollments.completedLessons
                            })
                            .from(enrollments)
                            .innerJoin(packageCourses, eq(enrollments.packageId, packageCourses.packageId))
                            .where(and(eq(enrollments.userId, user.id), eq(packageCourses.courseId, foundCourse.id)))
                            .limit(1);

                        if (packageEnrollment.length > 0) {
                            enrolled = true;
                            // Note: Tracking progress on a package enrollment for a specific course lesson is tricky if we store all completed lessons in one array.
                            // If the schema stores ALL completed lesson IDs in one array, it works fine across courses.
                            setCurrentEnrollmentId(packageEnrollment[0].id);
                            setCompletedLessons((packageEnrollment[0].completedLessons as string[]) || []);
                        }
                    }
                }
                setIsEnrolled(enrolled);

                // Access Control Enforcement
                if (!foundLesson.isFree && !enrolled) {
                    toast({
                        title: "عذراً، المحتوى غير متاح",
                        description: "يجب عليك الاشتراك في الدورة لمشاهدة هذا الدرس.",
                        variant: "destructive"
                    });
                    navigate(`/course/${slug}`);
                }
            } catch (error) {
                console.error("Error fetching lesson detail:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [slug, lessonId, user, navigate, toast]);

    const handleMarkComplete = async () => {
        if (!currentEnrollmentId || !currentLesson || isUpdating) return;

        setIsUpdating(true);
        try {
            const newCompleted = [...new Set([...completedLessons, currentLesson.id])];

            // Calculate progress for THIS course
            // We need to know which of these completed lessons belong to the current course
            const courseLessonIds = lessonList.map(l => l.id);
            const courseCompletedCount = newCompleted.filter(id => courseLessonIds.includes(id)).length;
            const progressPercent = Math.round((courseCompletedCount / lessonList.length) * 100);

            await db.update(enrollments)
                .set({
                    completedLessons: newCompleted,
                    progressPercent: progressPercent,
                    completedAt: progressPercent === 100 ? new Date() : null
                })
                .where(eq(enrollments.id, currentEnrollmentId));

            setCompletedLessons(newCompleted);

            if (progressPercent === 100 && user?.id && course) {
                // Check if certificate already exists
                // Note: We need to import certificates table
                // For now, let's assume we can insert unique certificate
                toast({
                    title: "مبارك!",
                    description: "لقد أكملت الدورة بنجاح!",
                    className: "bg-gold text-white border-none"
                });

                // Trigger certificate generation logic here or via a separate function
                createCertificate();
            } else {
                toast({
                    title: "أحسنت!",
                    description: "تم تسجيل الدرس كمكتمل",
                });
            }

        } catch (error) {
            console.error("Error updating progress:", error);
            toast({ title: "حدث خطأ", variant: "destructive" });
        } finally {
            setIsUpdating(false);
        }
    };

    const createCertificate = async () => {
        if (!user || !course) return;

        try {
            // Check if certificate exists
            const existingCert = await db.select()
                .from(certificates)
                .where(and(eq(certificates.userId, user.id), eq(certificates.courseId, course.id)))
                .limit(1);

            if (existingCert.length > 0) return;

            const certificateNumber = `CERT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

            await db.insert(certificates).values({
                userId: user.id,
                courseId: course.id,
                certificateNumber: certificateNumber,
                issuedAt: new Date()
            });

            toast({
                title: "شهادة جديدة!",
                description: "تم إصدار شهادة إتمام الدورة. يمكنك تحميلها من لوحة التحكم.",
                className: "bg-gold text-white border-none"
            });

        } catch (error) {
            console.error("Error creating certificate:", error);
        }
    };

    const nextLesson = lessonList[lessonList.indexOf(currentLesson) + 1];
    const prevLesson = lessonList[lessonList.indexOf(currentLesson) - 1];
    const isCompleted = completedLessons.includes(currentLesson?.id);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gold" />
            </div>
        );
    }

    if (!course || !currentLesson) {
        return <div className="min-h-screen bg-background flex items-center justify-center font-cairo">الدرس غير موجود</div>;
    }

    return (
        <div className="min-h-screen bg-background flex flex-col" dir="rtl">
            <Navbar />

            <div className="flex-1 pt-20 flex overflow-hidden">
                {/* Sidebar (Desktop) */}
                <aside className="hidden lg:flex flex-col w-80 border-l border-border/50 bg-card/30 backdrop-blur-xl">
                    <div className="p-6 border-b border-border/50">
                        <h2 className="font-amiri font-bold text-xl text-gold-gradient">{course.title}</h2>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground font-cairo mt-2">
                            <BookOpen className="w-3 h-3" />
                            <span>{lessonList.length} دروس</span>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {lessonList.map((lesson, idx) => {
                            const isActive = lesson.id === currentLesson.id;
                            const isLocked = !isEnrolled && !lesson.isFree;

                            return (
                                <Link
                                    key={lesson.id}
                                    to={isLocked ? "#" : `/course/${slug}/lesson/${lesson.id}`}
                                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${isActive ? 'bg-gold/20 text-gold border border-gold/30' :
                                        isLocked ? 'opacity-50 cursor-not-allowed' : 'hover:bg-muted'
                                        }`}
                                    onClick={(e) => {
                                        if (isLocked) {
                                            e.preventDefault();
                                            toast({ title: "محتوى مقفل", variant: "destructive" });
                                        }
                                    }}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${isActive ? 'border-gold' : 'border-border'
                                        }`}>
                                        {isLocked ? <Lock className="w-3 h-3" /> : <Play className={`w-3 h-3 ${isActive ? 'fill-gold' : ''}`} />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-cairo line-clamp-1 ${isActive ? 'font-bold' : ''}`}>
                                            {idx + 1}. {lesson.title}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground">{lesson.duration} دقيقة</p>
                                    </div>
                                    {lesson.isFree && !isEnrolled && (
                                        <span className="text-[8px] bg-emerald/10 text-emerald-light px-1.5 py-0.5 rounded-full">مجاني</span>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto">
                    <div className="max-w-5xl mx-auto p-6 lg:p-10 space-y-8">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <nav className="flex items-center gap-2 text-xs text-muted-foreground font-cairo mb-2 lg:hidden">
                                    <Link to={`/course/${slug}`} className="hover:text-gold">{course.title}</Link>
                                    <ChevronLeft className="w-3 h-3" />
                                    <span className="text-gold">الدرس {lessonList.indexOf(currentLesson) + 1}</span>
                                </nav>
                                <h1 className="text-2xl md:text-3xl font-amiri font-bold text-foreground">
                                    {currentLesson.title}
                                </h1>
                            </div>
                            <Button
                                variant="outline"
                                className="lg:hidden gap-2 font-cairo border-gold/30 text-gold"
                                onClick={() => setIsSidebarOpen(true)}
                            >
                                <Menu className="w-4 h-4" /> قائمة الدروس
                            </Button>
                        </div>

                        {/* Video Player */}
                        <VideoPlayer
                            url={currentLesson.videoUrl}
                            title={currentLesson.title}
                        />

                        {/* Progress & Actions */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-b border-border/50">
                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                <Button
                                    onClick={handleMarkComplete}
                                    disabled={isCompleted || isUpdating}
                                    className={`w-full sm:w-auto gap-2 font-cairo transition-all ${isCompleted
                                        ? "bg-emerald-500 hover:bg-emerald-600 text-white border-none"
                                        : "btn-outline border-gold/50 text-gold hover:bg-gold/10"
                                        }`}
                                >
                                    {isUpdating ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : isCompleted ? (
                                        <>
                                            <CheckCircle2 className="w-4 h-4" /> مكتمل
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 className="w-4 h-4" /> تحديد كمكتمل
                                        </>
                                    )}
                                </Button>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    className="gap-2 font-cairo"
                                    disabled={!prevLesson}
                                    onClick={() => navigate(`/course/${slug}/lesson/${prevLesson?.id}`)}
                                >
                                    <ChevronRight className="w-4 h-4" /> الدرس السابق
                                </Button>

                                <Button
                                    className="btn-gold gap-2 font-cairo"
                                    disabled={!nextLesson}
                                    onClick={() => {
                                        if (!isEnrolled && !nextLesson.isFree) {
                                            toast({ title: "المحتوى القادم يتطلب اشتراك", variant: "destructive" });
                                        } else {
                                            navigate(`/course/${slug}/lesson/${nextLesson?.id}`);
                                        }
                                    }}
                                >
                                    الدرس القادم <ChevronLeft className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Lesson Content */}
                        <div className="prose prose-invert max-w-none">
                            <h2 className="text-xl font-amiri font-bold border-b border-gold/20 pb-4 mb-6">عن هذا الدرس</h2>
                            <p className="text-muted-foreground font-cairo leading-relaxed whitespace-pre-wrap">
                                {currentLesson.content || "لا يوجد وصف إضافي لهذا الدرس."}
                            </p>
                        </div>
                    </div>

                    <Footer />
                </main>
            </div>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                            onClick={() => setIsSidebarOpen(false)}
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 20 }}
                            className="fixed inset-y-0 right-0 w-80 bg-background z-[70] shadow-2xl flex flex-col"
                        >
                            <div className="p-6 border-b border-border flex items-center justify-between">
                                <h3 className="font-amiri font-bold text-lg">محتوى الدورة</h3>
                                <Button size="icon" variant="ghost" onClick={() => setIsSidebarOpen(false)}>
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                                {lessonList.map((lesson, idx) => {
                                    const isActive = lesson.id === currentLesson.id;
                                    const isLocked = !isEnrolled && !lesson.isFree;

                                    return (
                                        <div
                                            key={lesson.id}
                                            className={`flex items-center gap-3 p-3 rounded-xl transition-all ${isActive ? 'bg-gold/20 text-gold border border-gold/30' :
                                                isLocked ? 'opacity-50' : 'hover:bg-muted active:scale-95'
                                                }`}
                                            onClick={() => {
                                                if (isLocked) {
                                                    toast({ title: "محتوى مقفل", variant: "destructive" });
                                                } else {
                                                    navigate(`/course/${slug}/lesson/${lesson.id}`);
                                                    setIsSidebarOpen(false);
                                                }
                                            }}
                                        >
                                            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-border">
                                                {isLocked ? <Lock className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                                            </div>
                                            <div className="flex-1 min-w-0 text-right">
                                                <p className="text-sm font-cairo line-clamp-1">{lesson.title}</p>
                                                <p className="text-[10px] text-muted-foreground">{lesson.duration} دقيقة</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LessonView;
