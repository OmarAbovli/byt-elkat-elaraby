import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  Search,
  Palette,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { db } from "@/lib/db";
import { courses as coursesTable } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import { useToast } from "@/hooks/use-toast";
import SingleImageUpload from "@/components/admin/SingleImageUpload";
// ... other imports

interface Course {
  id: string;
  title: string;
  titleEn: string | null;
  slug: string;
  description: string | null;
  coverImage: string | null;
  level: string | null;
  durationHours: number | null;
  isPublished: boolean | null;
  isFree: boolean | null;
  price: string | null; // Drizzle returns decimal as string usually
  studentsCount: number | null;
  createdAt: Date | null;
}

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    titleEn: "",
    slug: "",
    description: "",
    coverImage: "",
    level: "beginner",
    durationHours: 0,
    isFree: false,
    price: 0,
    certificateMode: 'auto', // 'auto' or 'custom'
  });

  const fetchCourses = useCallback(async () => {
    try {
      const data = await db.select().from(coursesTable).orderBy(desc(coursesTable.createdAt));

      const mappedCourses: Course[] = data.map((course) => ({
        ...course,
        price: course.price?.toString() || null,
        studentsCount: course.studentsCount || 0,
      }));

      setCourses(mappedCourses);
    } catch (error: unknown) {
      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : "حدث خطأ ما",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[أإآا]/g, "a")
      .replace(/[ب]/g, "b")
      .replace(/[ت]/g, "t")
      .replace(/[ث]/g, "th")
      .replace(/[ج]/g, "j")
      .replace(/[ح]/g, "h")
      .replace(/[خ]/g, "kh")
      .replace(/[د]/g, "d")
      .replace(/[ذ]/g, "z")
      .replace(/[ر]/g, "r")
      .replace(/[ز]/g, "z")
      .replace(/[س]/g, "s")
      .replace(/[ش]/g, "sh")
      .replace(/[ص]/g, "s")
      .replace(/[ض]/g, "d")
      .replace(/[ط]/g, "t")
      .replace(/[ظ]/g, "z")
      .replace(/[ع]/g, "a")
      .replace(/[غ]/g, "gh")
      .replace(/[ف]/g, "f")
      .replace(/[ق]/g, "q")
      .replace(/[ك]/g, "k")
      .replace(/[ل]/g, "l")
      .replace(/[م]/g, "m")
      .replace(/[ن]/g, "n")
      .replace(/[ه]/g, "h")
      .replace(/[و]/g, "w")
      .replace(/[ي]/g, "y")
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-")
      .trim();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const slug = formData.slug || generateSlug(formData.title) + "-" + Date.now();
      const payload = {
        ...formData,
        slug,
        price: formData.price.toString(),
        durationHours: formData.durationHours,
        certificateSettings: {
          // Preserve existing settings if any, but update mode
          ...(editingCourse ? (editingCourse as any).certificateSettings : {}),
          mode: formData.certificateMode
        }
      };

      if (editingCourse) {
        await db.update(coursesTable)
          .set(payload)
          .where(eq(coursesTable.id, editingCourse.id));

        toast({ title: "تم تحديث الدورة بنجاح ✓" });
      } else {
        await db.insert(coursesTable).values(payload);
        toast({ title: "تم إضافة الدورة بنجاح ✓" });
      }

      setIsDialogOpen(false);
      setEditingCourse(null);
      resetForm();
      fetchCourses();
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
    if (!confirm("هل أنت متأكد من حذف هذه الدورة؟")) return;

    try {
      await db.delete(coursesTable).where(eq(coursesTable.id, id));
      toast({ title: "تم حذف الدورة ✓" });
      fetchCourses();
    } catch (error: unknown) {
      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : "حدث خطأ ما",
        variant: "destructive",
      });
    }
  };

  const togglePublish = async (course: Course) => {
    try {
      await db.update(coursesTable)
        .set({ isPublished: !course.isPublished })
        .where(eq(coursesTable.id, course.id));

      fetchCourses();
      toast({
        title: course.isPublished ? "تم إخفاء الدورة" : "تم نشر الدورة ✓",
      });
    } catch (error: unknown) {
      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : "حدث خطأ ما",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      titleEn: "",
      slug: "",
      description: "",
      coverImage: "",
      level: "beginner",
      durationHours: 0,
      isPublished: false,
      isFree: false,
      price: 0,
      certificateMode: 'auto',
    });
  };

  const openEditDialog = (course: Course) => {
    setEditingCourse(course);
    // Safe cast for jsonb settings
    const certSettings = (course as any).certificateSettings || {};

    setFormData({
      title: course.title,
      titleEn: course.titleEn || "",
      slug: course.slug,
      description: course.description || "",
      coverImage: course.coverImage || "",
      level: course.level || "beginner",
      durationHours: course.durationHours || 0,
      isPublished: course.isPublished || false,
      isFree: course.isFree || false,
      price: parseFloat(course.price || "0"),
      certificateMode: certSettings.mode || 'auto',
    });
    setIsDialogOpen(true);
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.title.includes(searchQuery) ||
      course.titleEn?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const levelLabels: Record<string, string> = {
    beginner: "مبتدئ",
    intermediate: "متوسط",
    advanced: "متقدم",
    all: "جميع المستويات",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl font-bold font-cairo text-foreground">
            إدارة الدورات
          </h1>
          <p className="text-muted-foreground font-cairo mt-1">
            أضف وحرر الدورات التعليمية
          </p>
        </motion.div>

        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingCourse(null);
            resetForm();
          }
        }}>
          <DialogTrigger asChild>
            <Button className="btn-gold">
              <Plus className="w-5 h-5 ml-2" />
              إضافة دورة
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-xl font-cairo text-foreground">
                {editingCourse ? "تعديل الدورة" : "إضافة دورة جديدة"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-cairo">عنوان الدورة (عربي)</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="مثال: خط النسخ للمبتدئين"
                    className="mt-1 bg-muted/50 border-border font-cairo"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="titleEn">العنوان (بالإنجليزية)</Label>
                    <Input
                      id="titleEn"
                      value={formData.titleEn}
                      onChange={(e) =>
                        setFormData({ ...formData, titleEn: e.target.value })
                      }
                      className="bg-background/50 border-border/50 text-right"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">الوصف</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="bg-background/50 border-border/50"
                  />
                </div>

                <div className="col-span-2">
                  <Label className="font-cairo mb-2 block">صورة غلاف الدورة</Label>
                  <SingleImageUpload
                    value={formData.coverImage}
                    onChange={(url) => setFormData({ ...formData, coverImage: url })}
                    onRemove={() => setFormData({ ...formData, coverImage: "" })}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="font-cairo">المستوى</Label>
                    <Select
                      value={formData.level}
                      onValueChange={(value) => setFormData({ ...formData, level: value })}
                    >
                      <SelectTrigger className="mt-1 bg-muted/50 border-border font-cairo">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="beginner" className="font-cairo">مبتدئ</SelectItem>
                        <SelectItem value="intermediate" className="font-cairo">متوسط</SelectItem>
                        <SelectItem value="advanced" className="font-cairo">متقدم</SelectItem>
                        <SelectItem value="all" className="font-cairo">جميع المستويات</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="durationHours">مدة الدورة (ساعات)</Label>
                    <Input
                      id="durationHours"
                      type="number"
                      value={formData.durationHours}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          durationHours: parseInt(e.target.value),
                        })
                      }
                      className="bg-background/50 border-border/50"
                    />
                  </div>

                  <div>
                    <Label className="font-cairo">السعر ($)</Label>
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                      className="mt-1 bg-muted/50 border-border"
                      min={0}
                      step="0.01"
                      disabled={formData.isFree}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Switch
                      id="isFree"
                      checked={formData.isFree}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, isFree: checked })
                      }
                    />
                    <Label htmlFor="isFree">دورة مجانية</Label>
                  </div>

                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Switch
                      id="isPublished"
                      checked={formData.isPublished}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, isPublished: checked })
                      }
                    />
                    <Label htmlFor="isPublished">نشر الدورة</Label>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <Label className="font-cairo mb-2 block text-gold">إعدادات الشهادة</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div
                      className={`p-4 border rounded-xl cursor-pointer transition-all ${formData.certificateMode !== 'custom' ? 'border-gold bg-gold/10' : 'border-border hover:border-gold/50'}`}
                      onClick={() => setFormData({ ...formData, certificateMode: 'auto' })}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${formData.certificateMode !== 'custom' ? 'border-gold' : 'border-muted-foreground'}`}>
                          {formData.certificateMode !== 'custom' && <div className="w-2 h-2 rounded-full bg-gold" />}
                        </div>
                        <span className="font-bold font-cairo text-sm">تلقائي (الفاخر)</span>
                      </div>
                      <p className="text-xs text-muted-foreground">استخدام تصميم الشهادة الافتراضي الفاخر للنظام.</p>
                    </div>

                    <div
                      className={`p-4 border rounded-xl cursor-pointer transition-all ${formData.certificateMode === 'custom' ? 'border-gold bg-gold/10' : 'border-border hover:border-gold/50'}`}
                      onClick={() => setFormData({ ...formData, certificateMode: 'custom' })}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${formData.certificateMode === 'custom' ? 'border-gold' : 'border-muted-foreground'}`}>
                          {formData.certificateMode === 'custom' && <div className="w-2 h-2 rounded-full bg-gold" />}
                        </div>
                        <span className="font-bold font-cairo text-sm">مخصص (Builder)</span>
                      </div>
                      <p className="text-xs text-muted-foreground">تصميم شهادة خاصة لهذه الدورة باستخدام المصمم.</p>
                    </div>
                  </div>

                  {formData.certificateMode === 'custom' && editingCourse && (
                    <div className="mt-4 flex justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        className="gap-2 border-gold text-gold hover:bg-gold/10"
                        onClick={() => window.location.href = `/admin/courses/${editingCourse.id}/builder`}
                      >
                        <Palette className="w-4 h-4" />
                        فتح مصمم الشهادات
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="btn-gold flex-1" disabled={isLoading}>
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : editingCourse ? "حفظ التغييرات" : "إضافة الدورة"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="border-border"
                >
                  إلغاء
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحث عن دورة..."
          className="pr-10 bg-muted/50 border-border font-cairo"
        />
      </div>

      {/* Courses Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-luxury overflow-hidden"
      >
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center p-12">
            <p className="text-muted-foreground font-cairo">لا توجد دورات</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-right p-4 font-cairo text-sm text-muted-foreground">الدورة</th>
                  <th className="text-right p-4 font-cairo text-sm text-muted-foreground">المستوى</th>
                  <th className="text-right p-4 font-cairo text-sm text-muted-foreground">السعر</th>
                  <th className="text-right p-4 font-cairo text-sm text-muted-foreground">الحالة</th>
                  <th className="text-right p-4 font-cairo text-sm text-muted-foreground">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.map((course) => (
                  <tr key={course.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {course.coverImage && (
                          <img
                            src={course.coverImage}
                            alt={course.title}
                            className="w-16 h-12 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <p className="font-bold font-cairo text-foreground">{course.title}</p>
                          <p className="text-sm text-muted-foreground">{course.titleEn}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full bg-gold/20 text-gold text-sm font-cairo">
                        {levelLabels[course.level || "beginner"]}
                      </span>
                    </td>
                    <td className="p-4 font-cairo">
                      {course.isFree ? (
                        <span className="text-emerald-light font-bold">مجاني</span>
                      ) : (
                        <span className="text-foreground">${course.price}</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-cairo ${course.isPublished
                          ? "bg-emerald/20 text-emerald-light"
                          : "bg-muted text-muted-foreground"
                          }`}
                      >
                        {course.isPublished ? "منشورة" : "مسودة"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => togglePublish(course)}
                          className="p-2 rounded-lg hover:bg-muted transition-colors"
                          title={course.isPublished ? "إخفاء" : "نشر"}
                        >
                          {course.isPublished ? (
                            <EyeOff className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <Eye className="w-4 h-4 text-gold" />
                          )}
                        </button>
                        <button
                          onClick={() => window.location.href = `/admin/courses/${course.id}/builder`}
                          className="p-2 rounded-lg hover:bg-muted transition-colors"
                          title="تصميم الشهادة"
                        >
                          <Palette className="w-4 h-4 text-gold" />
                        </button>
                        <button
                          onClick={() => openEditDialog(course)}
                          className="p-2 rounded-lg hover:bg-muted transition-colors"
                        >
                          <Pencil className="w-4 h-4 text-gold" />
                        </button>
                        <button
                          onClick={() => handleDelete(course.id)}
                          className="p-2 rounded-lg hover:bg-destructive/20 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Courses;
