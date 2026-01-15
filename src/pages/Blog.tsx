import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Calendar, User, ArrowLeft, Search, PlayCircle, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/db";
import { posts } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import Breadcrumbs from "@/components/Breadcrumbs";

const BlogPage = () => {
    const [postsList, setPostsList] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = await db.select().from(posts).where(eq(posts.isPublished, true)).orderBy(desc(posts.createdAt));
                setPostsList(data);
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const filteredPosts = postsList.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-background">
            <SEO
                title="المدونة"
                description="مقالات ودروس حصرية في فن الخط العربي. تعلم النقد الفني، وتاريخ الخط، وأحدث الأدوات والتقنيات."
            />
            <Navbar />

            <section className="pt-32 pb-20 relative">
                <div className="container mx-auto px-6">
                    <Breadcrumbs items={[{ label: "المدونة" }]} />
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center max-w-3xl mx-auto mb-16"
                    >
                        <h1 className="text-4xl md:text-5xl font-amiri font-bold mb-6">
                            مدونة <span className="text-gold-gradient">بيت الخط</span>
                        </h1>
                        <p className="text-muted-foreground font-cairo text-lg">
                            اكتشف أحدث المقالات، الدروس، والنصائح حول فن الخط العربي وتاريخه العريق.
                        </p>
                    </motion.div>

                    <div className="max-w-2xl mx-auto mb-12">
                        <div className="relative">
                            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                            <Input
                                placeholder="ابحث في المقالات..."
                                className="pr-12 h-14 bg-card border-border/50 text-right font-cairo text-lg rounded-full"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="card-luxury p-4 animate-pulse">
                                    <div className="aspect-[16/10] bg-muted rounded-xl mb-4" />
                                    <div className="h-6 bg-muted rounded w-3/4 mb-4" />
                                    <div className="h-20 bg-muted rounded w-full" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredPosts.map((post) => (
                                <motion.div
                                    key={post.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    whileHover={{ y: -5 }}
                                    className="group"
                                >
                                    <Link to={`/blog/${post.slug}`}>
                                        <div className="card-luxury h-full flex flex-col overflow-hidden border-none bg-card hover:bg-secondary/5 transition-colors">
                                            <div className="aspect-[16/10] relative overflow-hidden">
                                                <img
                                                    src={post.coverImage || "/placeholder.jpg"}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                                                {post.videoUrl && (
                                                    <div className="absolute top-4 right-4 bg-gold/90 text-black p-2 rounded-full shadow-lg">
                                                        <PlayCircle className="w-5 h-5" />
                                                    </div>
                                                )}

                                                <div className="absolute bottom-4 right-4 flex items-center gap-2 text-gold font-cairo text-xs bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-gold/20">
                                                    <span className="w-2 h-2 bg-gold rounded-full animate-pulse" />
                                                    {post.category}
                                                </div>
                                            </div>

                                            <div className="p-6 flex-1 flex flex-col">
                                                <div className="flex items-center gap-4 text-xs text-muted-foreground font-cairo mb-4">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        <span>{new Date(post.createdAt).toLocaleDateString('ar-EG')}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <User className="w-3 h-3" />
                                                        <span>الإدارة</span>
                                                    </div>
                                                </div>

                                                <h3 className="text-xl font-bold font-amiri mb-3 group-hover:text-gold transition-colors line-clamp-2 leading-relaxed">
                                                    {post.title}
                                                </h3>

                                                <p className="text-muted-foreground font-cairo text-sm line-clamp-3 mb-6 flex-1">
                                                    {post.excerpt}
                                                </p>

                                                <div className="flex items-center gap-2 text-gold font-bold font-cairo text-sm mt-auto group-hover:gap-4 transition-all">
                                                    اقرأ المزيد <ArrowLeft className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {!isLoading && filteredPosts.length === 0 && (
                        <div className="text-center py-20">
                            <ImageIcon className="w-20 h-20 text-muted-foreground/20 mx-auto mb-6" />
                            <h3 className="text-2xl font-bold font-cairo mb-2">لا توجد مقالات</h3>
                            <p className="text-muted-foreground font-cairo">لم يتم نشر أي مقالات تطابق بحثك حالياً.</p>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default BlogPage;
