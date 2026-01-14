import { useState, useEffect } from "react";
import {
    Plus,
    Search,
    MoreHorizontal,
    Edit,
    Trash2,
    Eye,
    Image as ImageIcon,
    Video,
    CheckCircle,
    XCircle,
    Copy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { db } from "@/lib/db";
import { posts } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import { toast } from "sonner";
import { useAuth } from "@/providers/AuthProvider";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import ImageUpload from "@/components/admin/ImageUpload";

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) {
        return null;
    }

    const addYoutubeVideo = () => {
        const url = prompt('أدخل رابط YouTube:');
        if (url) {
            editor.chain().focus().setYoutubeVideo({ src: url }).run();
        }
    };

    const addImage = () => {
        const url = prompt('أدخل رابط الصورة:');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    const setLink = () => {
        const url = prompt('أدخل الرابط:');
        if (url) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    };

    return (
        <div className="border-b border-border bg-muted/30 p-2 flex flex-wrap gap-1 rounded-t-md" dir="ltr">
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`px-3 py-1 rounded text-sm font-semibold ${editor.isActive('heading', { level: 1 }) ? 'bg-gold text-black' : 'bg-secondary hover:bg-secondary/80'}`}
            >
                H1
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`px-3 py-1 rounded text-sm font-semibold ${editor.isActive('heading', { level: 2 }) ? 'bg-gold text-black' : 'bg-secondary hover:bg-secondary/80'}`}
            >
                H2
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={`px-3 py-1 rounded text-sm font-semibold ${editor.isActive('heading', { level: 3 }) ? 'bg-gold text-black' : 'bg-secondary hover:bg-secondary/80'}`}
            >
                H3
            </button>
            <div className="w-px bg-border mx-1" />
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`px-3 py-1 rounded text-sm font-bold ${editor.isActive('bold') ? 'bg-gold text-black' : 'bg-secondary hover:bg-secondary/80'}`}
            >
                B
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`px-3 py-1 rounded text-sm italic ${editor.isActive('italic') ? 'bg-gold text-black' : 'bg-secondary hover:bg-secondary/80'}`}
            >
                I
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={`px-3 py-1 rounded text-sm line-through ${editor.isActive('strike') ? 'bg-gold text-black' : 'bg-secondary hover:bg-secondary/80'}`}
            >
                S
            </button>
            <div className="w-px bg-border mx-1" />
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`px-3 py-1 rounded text-sm ${editor.isActive('bulletList') ? 'bg-gold text-black' : 'bg-secondary hover:bg-secondary/80'}`}
            >
                • قائمة
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`px-3 py-1 rounded text-sm ${editor.isActive('orderedList') ? 'bg-gold text-black' : 'bg-secondary hover:bg-secondary/80'}`}
            >
                1. قائمة
            </button>
            <div className="w-px bg-border mx-1" />
            <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                className={`px-3 py-1 rounded text-sm ${editor.isActive({ textAlign: 'right' }) ? 'bg-gold text-black' : 'bg-secondary hover:bg-secondary/80'}`}
            >
                ⇤
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                className={`px-3 py-1 rounded text-sm ${editor.isActive({ textAlign: 'center' }) ? 'bg-gold text-black' : 'bg-secondary hover:bg-secondary/80'}`}
            >
                ↔
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                className={`px-3 py-1 rounded text-sm ${editor.isActive({ textAlign: 'left' }) ? 'bg-gold text-black' : 'bg-secondary hover:bg-secondary/80'}`}
            >
                ⇥
            </button>
            <div className="w-px bg-border mx-1" />
            <button
                type="button"
                onClick={setLink}
                className={`px-3 py-1 rounded text-sm ${editor.isActive('link') ? 'bg-gold text-black' : 'bg-secondary hover:bg-secondary/80'}`}
            >
                🔗 رابط
            </button>
            <button
                type="button"
                onClick={addImage}
                className="px-3 py-1 rounded text-sm bg-secondary hover:bg-secondary/80"
            >
                🖼️ صورة
            </button>
            <button
                type="button"
                onClick={addYoutubeVideo}
                className="px-3 py-1 rounded text-sm bg-secondary hover:bg-secondary/80"
            >
                ▶️ فيديو
            </button>
        </div>
    );
};

const AdminBlog = () => {
    const { user } = useAuth();
    const [blogPosts, setBlogPosts] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [currentPost, setCurrentPost] = useState<any>({
        title: "",
        slug: "",
        content: "",
        excerpt: "",
        coverImage: "",
        videoUrl: "",
        category: "general",
        isPublished: false
    });

    const editor = useEditor({
        extensions: [
            StarterKit,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Link.configure({
                openOnClick: false,
            }),
            Image,
            Youtube.configure({
                controls: false,
            }),
        ],
        content: currentPost.content,
        onUpdate: ({ editor }) => {
            setCurrentPost({ ...currentPost, content: editor.getHTML() });
        },
    });

    // Update editor content when currentPost changes
    useEffect(() => {
        if (editor && currentPost.content !== editor.getHTML()) {
            editor.commands.setContent(currentPost.content);
        }
    }, [currentPost.id]);

    const fetchPosts = async () => {
        try {
            const data = await db.select().from(posts).orderBy(desc(posts.createdAt));
            setBlogPosts(data);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/--+/g, '-')
            .trim();
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        setCurrentPost({
            ...currentPost,
            title,
            slug: currentPost.id ? currentPost.slug : generateSlug(title)
        });
    };

    const handleSavePost = async () => {
        if (!currentPost.title || !currentPost.slug) {
            toast.error("يرجى ملء جميع الحقول المطلوبة");
            return;
        }

        setIsLoading(true);
        try {
            if (currentPost.id) {
                // Update
                await db.update(posts)
                    .set({
                        ...currentPost,
                        updatedAt: new Date()
                    })
                    .where(eq(posts.id, currentPost.id));
                toast.success("تم تحديث المقال بنجاح");
            } else {
                // Create
                await db.insert(posts).values({
                    ...currentPost,
                    authorId: user?.id
                });
                toast.success("تم إضافة المقال بنجاح");
            }
            setIsDialogOpen(false);
            fetchPosts();
            setCurrentPost({
                title: "",
                slug: "",
                content: "",
                excerpt: "",
                coverImage: "",
                videoUrl: "",
                category: "general",
                isPublished: false
            });
        } catch (error) {
            console.error("Error saving post:", error);
            toast.error("حدث خطأ أثناء الحفظ");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeletePost = async (id: string) => {
        if (!confirm("هل أنت متأكد من حذف هذا المقال؟")) return;

        try {
            await db.delete(posts).where(eq(posts.id, id));
            toast.success("تم حذف المقال");
            fetchPosts();
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("فشل حذف المقال");
        }
    };

    const openEditDialog = (post: any) => {
        setCurrentPost(post);
        setIsDialogOpen(true);
    };

    const filteredPosts = blogPosts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-amiri font-bold">إدارة المدونة</h1>
                    <p className="text-muted-foreground font-cairo">أضف، عدل، أو احذف مقالات الموقع</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="btn-gold gap-2 font-cairo" onClick={() => setCurrentPost({
                            title: "",
                            slug: "",
                            content: "",
                            excerpt: "",
                            coverImage: "",
                            videoUrl: "",
                            category: "general",
                            isPublished: false
                        })}>
                            <Plus className="w-4 h-4" /> مقال جديد
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="font-amiri text-2xl">
                                {currentPost.id ? "تعديل مقال" : "إضافة مقال جديد"}
                            </DialogTitle>
                            <DialogDescription className="font-cairo">
                                أدخل تفاصيل المقال والمحتوى هنا.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-6 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="font-cairo">عنوان المقال</Label>
                                    <Input
                                        className="font-cairo"
                                        placeholder="مثلاً: تاريخ الخط العربي"
                                        value={currentPost.title}
                                        onChange={handleTitleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-cairo">الرابط الفريد (Slug)</Label>
                                    <Input
                                        className="font-mono text-sm"
                                        placeholder="history-of-calligraphy"
                                        value={currentPost.slug}
                                        onChange={(e) => setCurrentPost({ ...currentPost, slug: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="font-cairo">التصنيف</Label>
                                    <Input
                                        className="font-cairo"
                                        placeholder="مثلاً: تعليم، تاريخ، أخبار"
                                        value={currentPost.category}
                                        onChange={(e) => setCurrentPost({ ...currentPost, category: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2 flex items-end">
                                    <div className="flex items-center gap-2 h-10 px-3 bg-secondary/30 rounded-md border border-border w-full">
                                        <input
                                            type="checkbox"
                                            id="isPublished"
                                            checked={currentPost.isPublished}
                                            onChange={(e) => setCurrentPost({ ...currentPost, isPublished: e.target.checked })}
                                            className="w-4 h-4 text-gold"
                                        />
                                        <Label htmlFor="isPublished" className="font-cairo cursor-pointer">نشر المقال (متاح للجميع)</Label>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="font-cairo">وصف مختصر (Excerpt)</Label>
                                <Textarea
                                    className="font-cairo h-20"
                                    placeholder="نبذة بسيطة تظهر في قائمة المقالات..."
                                    value={currentPost.excerpt}
                                    onChange={(e) => setCurrentPost({ ...currentPost, excerpt: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="font-cairo flex items-center gap-2 mb-2">
                                        <ImageIcon className="w-4 h-4" /> صورة الغلاف
                                    </Label>
                                    <ImageUpload
                                        value={currentPost.coverImage ? [currentPost.coverImage] : []}
                                        onChange={(urls) => setCurrentPost({ ...currentPost, coverImage: urls[0] || "" })}
                                        onRemove={() => setCurrentPost({ ...currentPost, coverImage: "" })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-cairo flex items-center gap-2">
                                        <Video className="w-4 h-4" /> رابط فيديو (اختياري)
                                    </Label>
                                    <Input
                                        placeholder="رابط يوتيوب أو فيميو..."
                                        value={currentPost.videoUrl}
                                        onChange={(e) => setCurrentPost({ ...currentPost, videoUrl: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="font-cairo uppercase text-xs tracking-widest text-gold mb-2 block">المحتوى الكامل</Label>
                                <div className="border border-border rounded-md overflow-hidden bg-background">
                                    <MenuBar editor={editor} />
                                    <EditorContent 
                                        editor={editor} 
                                        className="prose prose-sm max-w-none p-4 min-h-[350px] focus:outline-none font-cairo"
                                    />
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="font-cairo">إلغاء</Button>
                            <Button className="btn-gold font-cairo" onClick={handleSavePost} disabled={isLoading}>
                                {isLoading ? "جاري الحفظ..." : "حفظ المقال"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex items-center gap-4 bg-card p-4 rounded-xl border border-border">
                <Search className="w-5 h-5 text-muted-foreground" />
                <Input
                    placeholder="البحث في المقالات..."
                    className="border-none bg-transparent focus-visible:ring-0 font-cairo"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="bg-card rounded-xl border border-border overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead className="w-[100px] text-right">المثال</TableHead>
                            <TableHead className="text-right">العنوان</TableHead>
                            <TableHead className="text-right">التصنيف</TableHead>
                            <TableHead className="text-right">الحالة</TableHead>
                            <TableHead className="text-right">تاريخ الإضافة</TableHead>
                            <TableHead className="text-left w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredPosts.map((post) => (
                            <TableRow key={post.id} className="font-cairo">
                                <TableCell>
                                    <div className="w-16 aspect-video rounded-md bg-muted overflow-hidden">
                                        {post.coverImage ? (
                                            <img src={post.coverImage} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <ImageIcon className="w-4 h-4 opacity-20" />
                                            </div>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="font-bold">{post.title}</TableCell>
                                <TableCell>
                                    <span className="bg-accent/50 px-2 py-1 rounded text-xs">{post.category}</span>
                                </TableCell>
                                <TableCell>
                                    {post.isPublished ? (
                                        <div className="flex items-center gap-1 text-green-500">
                                            <CheckCircle className="w-4 h-4" /> منشـور
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1 text-muted-foreground">
                                            <XCircle className="w-4 h-4" /> مسودة
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {new Date(post.createdAt).toLocaleDateString('ar-EG')}
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="text-right">
                                            <DropdownMenuItem className="gap-2 justify-end cursor-pointer" onClick={() => openEditDialog(post)}>
                                                تعديل <Edit className="w-4 h-4" />
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="gap-2 justify-end cursor-pointer" onClick={() => window.open(`/blog/${post.slug}`, '_blank')}>
                                                عرض <Eye className="w-4 h-4" />
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="gap-2 justify-end cursor-pointer text-destructive" onClick={() => handleDeletePost(post.id)}>
                                                حذف <Trash2 className="w-4 h-4" />
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredPosts.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                                    لا توجد مقالات تطابق بحثك
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default AdminBlog;
