import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Clock, Users, Star, BookOpen, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/db";
import { courses } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import { Link } from "react-router-dom";
import Breadcrumbs from "@/components/Breadcrumbs";
import SEO from "@/components/SEO";
import { Skeleton } from "@/components/ui/skeleton";

const CoursesPage = () => {
    const [coursesList, setCoursesList] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await db.select().from(courses).where(eq(courses.isPublished, true)).orderBy(desc(courses.createdAt));
                setCoursesList(data);
            } catch (error) {
                console.error("Error fetching courses:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const filteredCourses = coursesList.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-background">
            <SEO
                title="الدورات التعليمية"
                description="تصفح مجموعة واسعة من دورات الخط العربي لجميع المستويات. تعلم خط النسخ، الرقعة، الديواني، والمزيد من كبار الخطاطين."
            />
            <Navbar />

            <section className="pt-32 pb-20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-dark/5 blur-[120px] rounded-full -rotate-12 translate-x-1/2 -translate-y-1/2" />

                <div className="container mx-auto px-6">
                    <Breadcrumbs items={[{ label: "الدورات التعليمية" }]} />

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center max-w-3xl mx-auto mb-16"
                    >
                        <h1 className="text-4xl md:text-5xl font-amiri font-bold mb-6">
                            تصفح <span className="text-gold-gradient">دوراتنا التعليمية</span>
                        </h1>
                        <p className="text-muted-foreground font-cairo text-lg">
                            مجموعة مختارة من أفضل دورات الخط العربي لجميع المستويات، من المبتدئين إلى المحترفين.
                        </p>
                    </motion.div>

                    <div className="flex flex-col md:flex-row gap-4 mb-12">
                        <div className="relative flex-1">
                            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                            <Input
                                placeholder="ابحث عن دورة..."
                                className="pr-12 h-12 bg-card border-border/50 text-right font-cairo"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" className="h-12 gap-2 font-cairo border-border/50 bg-card">
                            <Filter className="w-4 h-4" /> تصفية
                        </Button>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="card-luxury p-4">
                                    <Skeleton className="aspect-video w-full rounded-lg mb-4 bg-muted/50" />
                                    <Skeleton className="h-6 w-3/4 mb-4 bg-muted/50" />
                                    <div className="flex justify-between items-center mt-auto">
                                        <Skeleton className="h-4 w-1/3 bg-muted/50" />
                                        <Skeleton className="h-8 w-24 rounded-full bg-muted/50" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredCourses.map((course) => (
                                <motion.div
                                    key={course.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    whileHover={{ y: -5 }}
                                    className="group"
                                >
                                    <Link to={`/course/${course.slug}`}>
                                        <div className="card-luxury p-4 h-full flex flex-col">
                                            <div className="aspect-video rounded-lg overflow-hidden bg-background mb-4 relative">
                                                <img
                                                    src={course.coverImage || "/placeholder.jpg"}
                                                    alt={course.title}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs text-gold border border-gold/30 font-cairo">
                                                    {course.level === 'beginner' ? 'مبتدئ' : course.level === 'intermediate' ? 'متوسط' : 'متقدم'}
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold font-cairo mb-3 group-hover:text-gold transition-colors line-clamp-2">
                                                {course.title}
                                            </h3>

                                            <div className="flex items-center gap-4 text-sm text-muted-foreground font-cairo mt-auto pt-4 border-t border-border/50">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4 text-gold/60" />
                                                    <span>{course.durationHours} ساعة</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Users className="w-4 h-4 text-gold/60" />
                                                    <span>{course.studentsCount} طالب</span>
                                                </div>
                                                <div className="flex items-center gap-1 mr-auto">
                                                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                                    <span className="font-bold text-foreground">{course.rating}</span>
                                                </div>
                                            </div>

                                            <div className="mt-4 flex items-center justify-between">
                                                <span className="text-xl font-bold font-mono text-gold-gradient">
                                                    {course.isFree ? "مجاني" : `$${course.price}`}
                                                </span>
                                                <Button size="sm" className="btn-gold rounded-full font-cairo px-6">
                                                    اشترك الآن
                                                </Button>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {!isLoading && filteredCourses.length === 0 && (
                        <div className="text-center py-20">
                            <BookOpen className="w-20 h-20 text-muted-foreground/20 mx-auto mb-6" />
                            <h3 className="text-2xl font-bold font-cairo mb-2">لا توجد نتائج</h3>
                            <p className="text-muted-foreground font-cairo">جرب البحث بكلمات أخرى أو تصفح الأقسام.</p>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default CoursesPage;
