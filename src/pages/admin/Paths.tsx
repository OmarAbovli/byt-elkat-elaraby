import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Loader2, Search, Route } from "lucide-react";
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
import { paths, courses, pathCourses } from "@/lib/schema";
import { eq, desc, inArray } from "drizzle-orm";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import SingleImageUpload from "@/components/admin/SingleImageUpload";

interface Path {
    id: string;
    title: string;
    description: string | null;
    image: string | null;
    price: string | null;
    isPublished: boolean | null;
}

const Paths = () => {
    const [pathsList, setPathsList] = useState<Path[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingPath, setEditingPath] = useState<Path | null>(null);
    const [allCourses, setAllCourses] = useState<{ id: string; title: string }[]>([]);
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        image: "",
        price: 0,
        isPublished: false,
        selectedCourses: [] as string[],
    });

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await db.select().from(paths).orderBy(desc(paths.createdAt));
            setPathsList(data.map(p => ({ ...p, price: p.price?.toString() || "0" })) as Path[]);

            // Fetch all courses
            const coursesData = await db.select({ id: courses.id, title: courses.title }).from(courses);
            setAllCourses(coursesData);
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
            let pathId = editingPath?.id;

            if (editingPath) {
                await db
                    .update(paths)
                    .set({
                        title: formData.title,
                        description: formData.description,
                        image: formData.image,
                        price: formData.price.toString(),
                        isPublished: formData.isPublished,
                        updatedAt: new Date()
                    })
                    .where(eq(paths.id, editingPath.id));

                // Clear existing courses
                await db.delete(pathCourses).where(eq(pathCourses.pathId, editingPath.id));
                toast({ title: "تم تحديث المسار بنجاح" });
            } else {
                const [newPath] = await db.insert(paths).values({
                    title: formData.title,
                    description: formData.description,
                    image: formData.image,
                    price: formData.price.toString(),
                    isPublished: formData.isPublished
                }).returning({ id: paths.id });
                pathId = newPath.id;
                toast({ title: "تم إضافة المسار بنجاح" });
            }

            // Sync courses
            if (pathId && formData.selectedCourses.length > 0) {
                await db.insert(pathCourses).values(
                    formData.selectedCourses.map(courseId => ({
                        pathId,
                        courseId
                    }))
                );
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
        try {
            if (!confirm("هل أنت متأكد من حذف هذا المسار؟")) return;
            setIsLoading(true);
            await db.delete(paths).where(eq(paths.id, id));
            toast({ title: "تم حذف المسار ✓" });
            fetchData();
        } catch (error: unknown) {
            console.error("Delete error:", error);
            toast({
                title: "خطأ في الحذف",
                description: "تعذر حذف المسار. قد يكون مرتباً ببيانات أخرى.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const openEditDialog = async (path: Path) => {
        try {
            setEditingPath(path);
            setIsLoading(true);

            // Fetch selected courses
            const selected = await db
                .select({ courseId: pathCourses.courseId })
                .from(pathCourses)
                .where(eq(pathCourses.pathId, path.id));

            setFormData({
                title: path.title,
                description: path.description || "",
                image: path.image || "",
                price: parseFloat(path.price || "0"),
                isPublished: path.isPublished || false,
                selectedCourses: selected.map(s => s.courseId),
            });
            setIsDialogOpen(true);
        } catch (error) {
            console.error("Error opening edit dialog:", error);
            toast({
                title: "خطأ في فتح التعديل",
                description: "حدث خطأ أثناء تحميل بيانات المسار.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setEditingPath(null);
        setFormData({
            title: "",
            description: "",
            image: "",
            price: 0,
            isPublished: false,
            selectedCourses: [],
        });
    };

    return (
        <div className="p-8 space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-amiri font-bold text-gold-gradient mb-2">إدارة المسارات</h1>
                    <p className="text-muted-foreground font-cairo">إدارة المسارات التعليمية</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={resetForm} className="btn-gold gap-2">
                            <Plus className="w-5 h-5" />
                            مسار جديد
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="font-amiri text-2xl text-center">
                                {editingPath ? "تعديل المسار" : "إضافة مسار جديد"}
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                            <div className="space-y-4">
                                <SingleImageUpload
                                    value={formData.image}
                                    onChange={(url) => setFormData({ ...formData, image: url })}
                                    onRemove={() => setFormData({ ...formData, image: "" })}
                                    label="اضغط لرفع غلاف المسار"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>اسم المسار</Label>
                                <Input
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>الوصف</Label>
                                <Input
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>السعر</Label>
                                <Input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                                />
                            </div>

                            <div className="flex items-center space-x-2 space-x-reverse pt-2">
                                <Switch
                                    id="isPublished"
                                    checked={formData.isPublished}
                                    onCheckedChange={(checked) => setFormData({ ...formData, isPublished: checked })}
                                />
                                <Label htmlFor="isPublished">نشر المسار</Label>
                            </div>

                            <div className="space-y-3">
                                <Label className="font-cairo">الدورات المشمولة في هذا المسار</Label>
                                <ScrollArea className="h-[200px] rounded-md border border-border p-4">
                                    <div className="space-y-4">
                                        {allCourses.map((course) => (
                                            <div key={course.id} className="flex items-center space-x-2 space-x-reverse uppercase">
                                                <Checkbox
                                                    id={`course-${course.id}`}
                                                    checked={formData.selectedCourses.includes(course.id)}
                                                    onCheckedChange={(checked) => {
                                                        if (checked) {
                                                            setFormData({
                                                                ...formData,
                                                                selectedCourses: [...formData.selectedCourses, course.id]
                                                            });
                                                        } else {
                                                            setFormData({
                                                                ...formData,
                                                                selectedCourses: formData.selectedCourses.filter(id => id !== course.id)
                                                            });
                                                        }
                                                    }}
                                                />
                                                <Label
                                                    htmlFor={`course-${course.id}`}
                                                    className="font-cairo cursor-pointer text-sm"
                                                >
                                                    {course.title}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pathsList.map((path) => (
                    <motion.div
                        key={path.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="card-luxury p-6 space-y-4"
                    >
                        <div className="flex justify-between items-start">
                            <div className="p-3 bg-primary/10 rounded-full">
                                <Route className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex gap-2">
                                <Button size="icon" variant="ghost" onClick={() => openEditDialog(path)}>
                                    <Pencil className="w-4 h-4" />
                                </Button>
                                <Button size="icon" variant="ghost" onClick={() => handleDelete(path.id)} className="text-destructive">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold text-xl mb-2">{path.title}</h3>
                            <p className="text-muted-foreground text-sm line-clamp-2">{path.description}</p>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-border">
                            <span className="font-bold text-gold">{path.price} {path.price === "0" ? "مجانًا" : "USD"}</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${path.isPublished ? "bg-emerald/20 text-emerald-light" : "bg-muted text-muted-foreground"}`}>
                                {path.isPublished ? "منشور" : "مسودة"}
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Paths;
