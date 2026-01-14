import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Loader2, Search, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { db } from "@/lib/db";
import { lessons, courses } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Lesson {
    id: string;
    title: string;
    courseId: string;
    content: string | null;
    videoUrl: string | null;
    duration: number | null;
    isPublished: boolean | null;
    isFree: boolean | null;
    order: number | null;
    courseName?: string;
}

const Lessons = () => {
    const [lessonsList, setLessonsList] = useState<Lesson[]>([]);
    const [coursesList, setCoursesList] = useState<{ id: string; title: string }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        title: "",
        courseId: "",
        content: "",
        videoUrl: "",
        duration: 0,
        isPublished: false,
        isFree: false,
        order: 0,
    });

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            // Fetch lessons
            const lessonsData = await db
                .select({
                    id: lessons.id,
                    title: lessons.title,
                    courseId: lessons.courseId,
                    content: lessons.content,
                    videoUrl: lessons.videoUrl,
                    duration: lessons.duration,
                    isPublished: lessons.isPublished,
                    isFree: lessons.isFree,
                    order: lessons.order,
                    courseName: courses.title,
                })
                .from(lessons)
                .leftJoin(courses, eq(lessons.courseId, courses.id))
                .orderBy(desc(lessons.createdAt));

            setLessonsList(lessonsData as Lesson[]);

            // Fetch courses for select dropdown
            const coursesData = await db.select({ id: courses.id, title: courses.title }).from(courses);
            setCoursesList(coursesData);
        } catch (error: unknown) {
            toast({
                title: "خطأ",
                description: error instanceof Error ? error.message : "حدث خطأ أثناء جلب البيانات",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (editingLesson) {
                await db
                    .update(lessons)
                    .set(formData)
                    .where(eq(lessons.id, editingLesson.id));
                toast({ title: "تم تحديث الدرس بنجاح" });
            } else {
                await db.insert(lessons).values(formData);
                toast({ title: "تم إضافة الدرس بنجاح" });
            }
            setIsDialogOpen(false);
            resetForm();
            fetchData();
        } catch (error: unknown) {
            toast({
                title: "خطأ",
                description: error instanceof Error ? error.message : "حدث خطأ ما",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("هل أنت متأكد من حذف هذا الدرس؟")) return;
        try {
            await db.delete(lessons).where(eq(lessons.id, id));
            toast({ title: "تم حذف الدرس" });
            fetchData();
        } catch (error: unknown) {
            toast({
                title: "خطأ",
                description: error instanceof Error ? error.message : "حدث خطأ ما",
                variant: "destructive",
            });
        }
    };

    const openEditDialog = (lesson: Lesson) => {
        setEditingLesson(lesson);
        setFormData({
            title: lesson.title,
            courseId: lesson.courseId,
            content: lesson.content || "",
            videoUrl: lesson.videoUrl || "",
            duration: lesson.duration || 0,
            isPublished: lesson.isPublished || false,
            isFree: lesson.isFree || false,
            order: lesson.order || 0,
        });
        setIsDialogOpen(true);
    };

    const resetForm = () => {
        setEditingLesson(null);
        setFormData({
            title: "",
            courseId: "",
            content: "",
            videoUrl: "",
            duration: 0,
            isPublished: false,
            isFree: false,
            order: 0,
        });
    };

    const filteredLessons = lessonsList.filter((lesson) =>
        lesson.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-8 space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-amiri font-bold text-gold-gradient mb-2">إدارة الدروس</h1>
                    <p className="text-muted-foreground font-cairo">إضافة وتعديل دروس الدورات</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={resetForm} className="btn-gold gap-2">
                            <Plus className="w-5 h-5" />
                            درس جديد
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="font-amiri text-2xl text-center">
                                {editingLesson ? "تعديل الدرس" : "إضافة درس جديد"}
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-2">
                                    <Label>عنوان الدرس</Label>
                                    <Input
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>الدورة التابعة لها</Label>
                                    <Select
                                        value={formData.courseId}
                                        onValueChange={(value) => setFormData({ ...formData, courseId: value })}
                                        required
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="اختر الدورة" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {coursesList.map((course) => (
                                                <SelectItem key={course.id} value={course.id}>
                                                    {course.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>رابط الفيديو</Label>
                                    <Input
                                        value={formData.videoUrl}
                                        onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                                        placeholder="https://..."
                                        dir="ltr"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>المدة (دقيقة)</Label>
                                        <Input
                                            type="number"
                                            value={formData.duration}
                                            onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>الترتيب</Label>
                                        <Input
                                            type="number"
                                            value={formData.order}
                                            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>المحتوى النصي</Label>
                                    <Input
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    />
                                </div>

                                <div className="flex items-center space-x-2 space-x-reverse pt-2">
                                    <Switch
                                        id="isPublished"
                                        checked={formData.isPublished}
                                        onCheckedChange={(checked) => setFormData({ ...formData, isPublished: checked })}
                                    />
                                    <Label htmlFor="isPublished">نشر الدرس</Label>
                                </div>

                                <div className="flex items-center space-x-2 space-x-reverse pt-2">
                                    <Switch
                                        id="isFree"
                                        checked={formData.isFree}
                                        onCheckedChange={(checked) => setFormData({ ...formData, isFree: checked })}
                                    />
                                    <Label htmlFor="isFree">درس مجاني (معاينة)</Label>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button type="submit" className="btn-gold flex-1" disabled={isLoading}>
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "حفظ"}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                    placeholder="بحث عن درس..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10 bg-card border-border"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredLessons.map((lesson) => (
                    <motion.div
                        key={lesson.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="card-luxury p-4 flex items-center justify-between group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-secondary/20 rounded-lg">
                                <Video className="w-6 h-6 text-gold" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-foreground">{lesson.title}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {lesson.courseName} | {lesson.duration} دقيقة
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button size="icon" variant="ghost" onClick={() => openEditDialog(lesson)}>
                                <Pencil className="w-4 h-4" />
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => handleDelete(lesson.id)} className="text-destructive">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Lessons;
