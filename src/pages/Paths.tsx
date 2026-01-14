import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Compass, BookOpen, Layers, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { paths, pathCourses, courses } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/providers/CartProvider";
import { useAuth } from "@/providers/AuthProvider";

const PathsPage = () => {
    const [pathsList, setPathsList] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { addItem } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPaths = async () => {
            try {
                // Fetch paths with their courses
                const data = await db.select().from(paths).where(eq(paths.isPublished, true)).orderBy(desc(paths.createdAt));

                const pathsWithCourses = await Promise.all(
                    data.map(async (path) => {
                        const pathCoursesList = await db
                            .select({
                                course: courses
                            })
                            .from(pathCourses)
                            .innerJoin(courses, eq(pathCourses.courseId, courses.id))
                            .where(eq(pathCourses.pathId, path.id));

                        return {
                            ...path,
                            courses: pathCoursesList.map(item => item.course)
                        };
                    })
                );

                setPathsList(pathsWithCourses);
            } catch (error) {
                console.error("Error fetching paths:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPaths();
    }, []);

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <section className="pt-32 pb-20 relative overflow-hidden">
                <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-gold-dark/5 blur-[150px] rounded-full" />

                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center max-w-3xl mx-auto mb-20"
                    >
                        <h1 className="text-4xl md:text-5xl font-amiri font-bold mb-6">
                            مسارات <span className="text-gold-gradient">التعلم الموجهة</span>
                        </h1>
                        <p className="text-muted-foreground font-cairo text-lg">
                            خطوات مدروسة تأخذك من البداية وحتى الإتقان الكامل في فنون الخط العربي المختلفة.
                        </p>
                    </motion.div>

                    {isLoading ? (
                        <div className="space-y-12">
                            {[1, 2].map(i => (
                                <div key={i} className="card-luxury p-8 animate-pulse flex flex-col md:flex-row gap-8">
                                    <div className="w-full md:w-1/3 aspect-video bg-muted rounded-xl" />
                                    <div className="flex-1 space-y-4">
                                        <div className="h-8 bg-muted rounded w-1/2" />
                                        <div className="h-20 bg-muted rounded w-full" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-12">
                            {pathsList.map((path, index) => (
                                <motion.div
                                    key={path.id}
                                    initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className="group"
                                >
                                    <div className="card-luxury overflow-hidden flex flex-col md:flex-row items-stretch min-h-[400px]">
                                        <div className="w-full md:w-2/5 relative overflow-hidden">
                                            <img
                                                src={path.image || "/placeholder.jpg"}
                                                alt={path.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-l from-black/80 to-transparent flex items-center justify-end p-12 md:hidden">
                                                <Compass className="w-16 h-16 text-gold/30" />
                                            </div>
                                        </div>

                                        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
                                            <div className="flex items-center gap-3 text-gold mb-4 font-cairo text-sm">
                                                <Compass className="w-5 h-5" />
                                                <span>مسار تعلم متكامل</span>
                                            </div>

                                            <h2 className="text-3xl font-amiri font-bold mb-6 group-hover:text-gold transition-colors">
                                                {path.title}
                                            </h2>

                                            <p className="text-muted-foreground font-cairo leading-relaxed mb-8 text-lg">
                                                {path.description}
                                            </p>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                                <div className="flex items-center gap-2 text-sm font-cairo">
                                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                                    <span>محتوى تعليمي متسلسل</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm font-cairo">
                                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                                    <span>تطبيقات عملية ومشاريع</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm font-cairo">
                                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                                    <span>شهادة إتقان عند الانتهاء</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm font-cairo">
                                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                                    <span>دعم وتواصل مع المدرب</span>
                                                </div>
                                            </div>

                                            {path.courses && path.courses.length > 0 && (
                                                <div className="mb-8 p-4 bg-muted/30 rounded-xl border border-border/50">
                                                    <div className="text-sm font-bold font-cairo mb-3 flex items-center gap-2 text-gold">
                                                        <Layers className="w-4 h-4" />
                                                        الدورات في هذا المسار ({path.courses.length}):
                                                    </div>
                                                    <div className="space-y-2">
                                                        {path.courses.map((course: any) => (
                                                            <div key={course.id} className="text-sm font-cairo flex items-center gap-2 text-muted-foreground group/item">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-gold/40 group-hover/item:bg-gold" />
                                                                {course.title}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex flex-wrap items-center gap-6">
                                                <Button
                                                    size="lg"
                                                    className="btn-gold px-12 h-14 rounded-full font-cairo text-lg"
                                                    onClick={() => {
                                                        addItem({
                                                            id: path.id,
                                                            name: path.title,
                                                            price: Number(path.price),
                                                            image: path.image,
                                                            type: 'path'
                                                        });
                                                    }}
                                                >
                                                    ابدأ المسار الآن
                                                </Button>
                                                <div className="text-2xl font-mono font-bold text-gold-gradient">
                                                    ${path.price}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {!isLoading && pathsList.length === 0 && (
                        <div className="text-center py-20">
                            <Layers className="w-20 h-20 text-muted-foreground/20 mx-auto mb-6" />
                            <h3 className="text-2xl font-bold font-cairo mb-2">لا توجد مسارات حالياً</h3>
                            <p className="text-muted-foreground font-cairo">يرجى العودة لاحقاً لمشاهدة المسارات الجديدة.</p>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default PathsPage;
