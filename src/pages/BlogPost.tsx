import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Calendar, User, ArrowRight, Share2, Facebook, Twitter, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { posts } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import SEO from "@/components/SEO";
import Breadcrumbs from "@/components/Breadcrumbs";

const BlogPost = () => {
    const { slug } = useParams();
    const [post, setPost] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                if (!slug) return;
                const data = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
                if (data.length > 0) {
                    setPost(data[0]);
                }
            } catch (error) {
                console.error("Error fetching post:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPost();
    }, [slug]);

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("تم نسخ الرابط");
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="container mx-auto px-6 py-32 animate-pulse">
                    <div className="max-w-4xl mx-auto">
                        <div className="h-12 bg-muted rounded w-3/4 mb-6" />
                        <div className="h-6 bg-muted rounded w-1/4 mb-12" />
                        <div className="aspect-video bg-muted rounded-xl mb-12" />
                        <div className="space-y-4">
                            <div className="h-4 bg-muted rounded w-full" />
                            <div className="h-4 bg-muted rounded w-full" />
                            <div className="h-4 bg-muted rounded w-2/3" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center p-6">
                    <h2 className="text-3xl font-amiri font-bold mb-4">المقال غير موجود</h2>
                    <Link to="/blog">
                        <Button variant="outline" className="gap-2 font-cairo">
                            <ArrowRight className="w-4 h-4 ml-2" /> العودة للمدونة
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <SEO
                title={post.title}
                description={post.excerpt}
                image={post.coverImage}
                type="article"
            />
            <Navbar />

            <article className="pt-32 pb-20 overflow-hidden">
                <div className="container mx-auto px-6">
                    <Breadcrumbs items={[{ label: "المدونة", href: "/blog" }, { label: post.title }]} />
                    <div className="max-w-4xl mx-auto">
                        {/* Post Header */}
                        <motion.header
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-12"
                        >
                            <Link to="/blog" className="inline-flex items-center gap-2 text-gold hover:gap-3 transition-all font-cairo text-sm mb-8">
                                <ArrowRight className="w-4 h-4 ml-2" /> العودة للمدونة
                            </Link>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground font-cairo mb-6">
                                <span className="bg-gold/10 text-gold-dark px-3 py-1 rounded-full">{post.category}</span>
                                <div className="flex items-center gap-1 border-r border-border pr-4">
                                    <Calendar className="w-4 h-4" />
                                    <span>{new Date(post.createdAt).toLocaleDateString('ar-EG')}</span>
                                </div>
                                <div className="flex items-center gap-1 border-r border-border pr-4">
                                    <User className="w-4 h-4" />
                                    <span>الإدارة</span>
                                </div>
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-amiri font-bold leading-tight mb-8">
                                {post.title}
                            </h1>

                            <p className="text-xl text-muted-foreground font-cairo leading-relaxed border-r-4 border-gold pr-6 mb-12 italic">
                                {post.excerpt}
                            </p>
                        </motion.header>

                        {/* Post Media */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="mb-16 relative group"
                        >
                            <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl border border-border/50 bg-card">
                                {post.videoUrl ? (
                                    <iframe
                                        className="w-full h-full"
                                        src={post.videoUrl.replace("watch?v=", "embed/")}
                                        title={post.title}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                ) : (
                                    <img
                                        src={post.coverImage || "/placeholder.jpg"}
                                        alt={post.title}
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </div>

                            <div className="absolute -bottom-6 right-1/2 translate-x-1/2 flex gap-4">
                                <Button title="نسخ الرابط" variant="secondary" size="icon" className="rounded-full shadow-lg" onClick={copyLink}>
                                    <LinkIcon className="w-4 h-4" />
                                </Button>
                                <Button
                                    title="مشاركة على فيسبوك"
                                    variant="secondary"
                                    size="icon"
                                    className="rounded-full shadow-lg text-[#1877F2]"
                                    onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                                >
                                    <Facebook className="w-4 h-4" />
                                </Button>
                                <Button
                                    title="مشاركة على تويتر"
                                    variant="secondary"
                                    size="icon"
                                    className="rounded-full shadow-lg text-[#1DA1F2]"
                                    onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`, '_blank')}
                                >
                                    <Twitter className="w-4 h-4" />
                                </Button>
                            </div>
                        </motion.div>

                        {/* Post Content */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="prose prose-luxury prose-gold max-w-none font-cairo text-lg leading-loose text-foreground/90 text-right dir-rtl"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />

                        <div className="mt-20 pt-12 border-t border-border flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-gold-gradient p-1">
                                    <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                                        <User className="w-8 h-8 text-gold" />
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-bold font-cairo">فريق بيت الخط العربي</h4>
                                    <p className="text-sm text-muted-foreground font-cairo">فريق متخصص في نشر ثقافة الخط العربي وتاريخه.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Button variant="outline" className="rounded-full gap-2 font-cairo" onClick={copyLink}>
                                    شارِك المقال <Share2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </article>

            <Footer />
        </div>
    );
};

export default BlogPost;
