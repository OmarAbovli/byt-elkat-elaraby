import { motion } from "framer-motion";
import { ArrowLeft, Calendar, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { db } from "@/lib/db";
import { posts } from "@/lib/schema";
import { desc, eq } from "drizzle-orm";
import { Link } from "react-router-dom";

const BlogPreview = () => {
    const [latestPosts, setLatestPosts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLatest = async () => {
            try {
                const data = await db.select()
                    .from(posts)
                    .where(eq(posts.isPublished, true))
                    .orderBy(desc(posts.createdAt))
                    .limit(3);
                setLatestPosts(data);
            } catch (error) {
                console.error("Failed to fetch latest posts", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLatest();
    }, []);

    if (isLoading || latestPosts.length === 0) return null;

    return (
        <section className="py-24 bg-background relative overflow-hidden">
            <div className="absolute top-1/2 left-0 w-64 h-64 bg-gold/5 blur-3xl rounded-full" />

            <div className="container mx-auto px-6 relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex justify-between items-end mb-12"
                >
                    <div>
                        <span className="text-gold text-sm font-cairo tracking-wider uppercase mb-2 block">
                            المقالات والدروس
                        </span>
                        <h2 className="text-3xl md:text-4xl font-amiri font-bold">
                            آخر ما <span className="text-gold-gradient">كُتب</span>
                        </h2>
                    </div>
                    <Link to="/blog">
                        <Button variant="ghost" className="text-gold gap-2 hover:text-gold/80 hidden md:flex font-cairo">
                            مشاهدة الكل <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {latestPosts.map((post, index) => (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group"
                        >
                            <Link to={`/blog/${post.slug}`}>
                                <div className="card-luxury p-3 h-full flex flex-col group-hover:bg-secondary/5 transition-all">
                                    <div className="aspect-video rounded-lg overflow-hidden relative mb-4">
                                        <img
                                            src={post.coverImage || "/placeholder.jpg"}
                                            alt={post.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        {post.videoUrl && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                                <PlayCircle className="w-12 h-12 text-white/80" />
                                            </div>
                                        )}
                                        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] text-gold border border-gold/30 font-cairo">
                                            {post.category}
                                        </div>
                                    </div>
                                    <div className="px-2 pb-2">
                                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-cairo mb-2">
                                            <Calendar className="w-3 h-3" />
                                            <span>{new Date(post.createdAt).toLocaleDateString('ar-EG')}</span>
                                        </div>
                                        <h3 className="font-bold font-amiri text-xl mb-2 line-clamp-2 group-hover:text-gold transition-colors leading-relaxed">
                                            {post.title}
                                        </h3>
                                        <p className="text-muted-foreground font-cairo text-xs line-clamp-2">
                                            {post.excerpt}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-8 text-center md:hidden">
                    <Link to="/blog">
                        <Button variant="ghost" className="text-gold gap-2 hover:text-gold/80 font-cairo">
                            مشاهدة الكل <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default BlogPreview;
