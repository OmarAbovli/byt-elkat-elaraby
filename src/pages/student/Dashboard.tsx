import { useAuth } from "@/providers/AuthProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { BookOpen, Award, GraduationCap, Loader2, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import { db } from "@/lib/db";
import { enrollments, courses, certificates, packageCourses, pathCourses } from "@/lib/schema";
import { eq, sql, inArray } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        enrolledCourses: 0,
        completionRate: 0,
        certificates: 0
    });
    const [enrolledCoursesList, setEnrolledCoursesList] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStudentData = async () => {
            if (!user?.id) return;

            try {
                // Fetch direct enrollments
                const studentEnrollments = await db
                    .select({
                        enrollment: enrollments,
                        course: courses
                    })
                    .from(enrollments)
                    .innerJoin(courses, eq(enrollments.courseId, courses.id))
                    .where(eq(enrollments.userId, user.id));

                // Fetch package enrollments
                const packageEnrolled = await db
                    .select({ packageId: enrollments.packageId })
                    .from(enrollments)
                    .where(sql`${enrollments.userId} = ${user.id} AND ${enrollments.packageId} IS NOT NULL`);

                let packageCoursesList: any[] = [];
                if (packageEnrolled.length > 0) {
                    const pkgIds = packageEnrolled.map(p => p.packageId as string);
                    packageCoursesList = await db
                        .select({
                            course: courses
                        })
                        .from(packageCourses)
                        .innerJoin(courses, eq(packageCourses.courseId, courses.id))
                        .where(inArray(packageCourses.packageId, pkgIds));
                }

                // Fetch path enrollments
                const pathEnrolled = await db
                    .select({ pathId: enrollments.pathId })
                    .from(enrollments)
                    .where(sql`${enrollments.userId} = ${user.id} AND ${enrollments.pathId} IS NOT NULL`);

                let pathCoursesList: any[] = [];
                if (pathEnrolled.length > 0) {
                    const pathIds = pathEnrolled.map(p => p.pathId as string);
                    pathCoursesList = await db
                        .select({
                            course: courses
                        })
                        .from(pathCourses)
                        .innerJoin(courses, eq(pathCourses.courseId, courses.id))
                        .where(inArray(pathCourses.pathId, pathIds));
                }

                // Combine all unique courses
                const allEnrolledCourses = [...studentEnrollments];
                const seenCourseIds = new Set(allEnrolledCourses.map(e => e.course.id));

                [...packageCoursesList, ...pathCoursesList].forEach(pc => {
                    if (!seenCourseIds.has(pc.course.id)) {
                        allEnrolledCourses.push({
                            enrollment: { progressPercent: 0, id: `indirect-${pc.course.id}` } as any,
                            course: pc.course
                        });
                        seenCourseIds.add(pc.course.id);
                    }
                });

                // Fetch certificates count
                const studentCertificates = await db
                    .select({ count: sql<number>`count(*)` })
                    .from(certificates)
                    .where(eq(certificates.userId, user.id));

                setStats({
                    enrolledCourses: allEnrolledCourses.length,
                    completionRate: allEnrolledCourses.length > 0
                        ? Math.round(allEnrolledCourses.reduce((acc, curr) => acc + (curr.enrollment.progressPercent || 0), 0) / allEnrolledCourses.length)
                        : 0,
                    certificates: Number(studentCertificates[0]?.count || 0)
                });

                setEnrolledCoursesList(allEnrolledCourses);
            } catch (error) {
                console.error("Error fetching student dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStudentData();
    }, [user?.id]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gold" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container mx-auto px-6 py-32">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-12"
                    >
                        <h1 className="text-4xl font-bold font-amiri mb-2 text-gold-gradient">
                            مرحباً، {user?.fullName}
                        </h1>
                        <p className="text-muted-foreground font-cairo">تابع تقدمك في تعلم الخط العربي</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <div className="card-luxury p-6 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
                                <BookOpen className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold font-cairo">{stats.enrolledCourses}</h3>
                                <p className="text-sm text-muted-foreground">دورات مسجلة</p>
                            </div>
                        </div>
                        <div className="card-luxury p-6 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-emerald/10 flex items-center justify-center text-emerald-light">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold font-cairo">{stats.completionRate}%</h3>
                                <p className="text-sm text-muted-foreground">معدل الإكمال</p>
                            </div>
                        </div>
                        <Link to="/my-certificates" className="card-luxury p-6 flex items-center gap-4 hover:border-gold/50 transition-colors cursor-pointer group">
                            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:text-gold group-hover:bg-gold/10 transition-colors">
                                <Award className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold font-cairo text-foreground">{stats.certificates}</h3>
                                <p className="text-sm text-muted-foreground">شهادات مكتسبة</p>
                            </div>
                        </Link>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-xl font-bold font-cairo mb-4 text-foreground">دوراتي الحالية</h2>
                        {enrolledCoursesList.length === 0 ? (
                            <div className="card-luxury p-12 text-center">
                                <BookOpen className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                                <h3 className="text-lg font-bold font-cairo mb-2 text-foreground">لا يوجد دورات مسجلة</h3>
                                <p className="text-muted-foreground font-cairo mb-6">
                                    تصفح الدورات المتاحة وابدأ رحلة تعلم الخط العربي
                                </p>
                                <a href="/courses" className="btn-gold inline-flex px-6 py-2 rounded-md">
                                    تصفح الدورات
                                </a>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {enrolledCoursesList.map(({ enrollment, course }) => (
                                    <motion.div
                                        key={enrollment.id}
                                        className="card-luxury overflow-hidden group border border-border/50"
                                        whileHover={{ y: -5 }}
                                    >
                                        <div className="aspect-video relative overflow-hidden">
                                            <img
                                                src={course?.coverImage || "/placeholder-course.jpg"}
                                                alt={course?.title}
                                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                            />
                                            <div className="absolute inset-x-0 bottom-0 h-1 bg-background/20">
                                                <div
                                                    className="h-full bg-gold transition-all duration-1000"
                                                    style={{ width: `${enrollment.progressPercent}%` }}
                                                />
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-bold font-cairo mb-2 text-foreground line-clamp-1">{course?.title}</h3>
                                            <div className="flex justify-between items-center text-sm text-muted-foreground">
                                                <span>التقدم: {enrollment.progressPercent}%</span>
                                                <Button variant="ghost" size="sm" className="text-gold hover:text-gold/80 p-0" onClick={() => window.location.href = `/course/${course?.slug}`}>
                                                    استكمال التعلم
                                                </Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Dashboard;
