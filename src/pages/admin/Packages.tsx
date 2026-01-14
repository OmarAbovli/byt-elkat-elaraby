import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Search,
  Package,
  Check,
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
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { db } from "@/lib/db";
import { packages as packagesTable, courses as coursesTable, packageCourses, lessons as lessonsTable, packageLessons } from "@/lib/schema";
import { eq, desc, inArray } from "drizzle-orm";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
// ... other imports

interface PackageData {
  id: string;
  name: string;
  nameEn: string | null;
  description: string | null;
  price: string;
  currency: string | null;
  durationDays: number | null;
  isFree: boolean | null;
  isPublished: boolean | null;
  features: string[] | null;
  createdAt: Date | null;
}

interface Course {
  id: string;
  title: string;
}

const Packages = () => {
  const [packages, setPackages] = useState<PackageData[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<PackageData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [selectedLessons, setSelectedLessons] = useState<string[]>([]);
  const [allLessons, setAllLessons] = useState<{ id: string; title: string, courseTitle: string }[]>([]);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    name_en: "",
    description: "",
    price: 0,
    duration_days: null as number | null,
    is_free: false,
    is_published: true,
    features: [] as string[],
  });
  const [newFeature, setNewFeature] = useState("");

  const fetchPackages = useCallback(async () => {
    try {
      const data = await db.select().from(packagesTable).orderBy(desc(packagesTable.createdAt));

      const mappedPackages: PackageData[] = data.map(pkg => ({
        ...pkg,
        features: (pkg.features as string[]) || [], // Cast JSONB to string[]
        price: pkg.price.toString(),
      })) as PackageData[];

      setPackages(mappedPackages);
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
    fetchPackages();
    fetchCourses();
  }, [fetchPackages]);

  const fetchCourses = async () => {
    try {
      const data = await db.select({ id: coursesTable.id, title: coursesTable.title })
        .from(coursesTable)
        .where(eq(coursesTable.isPublished, true));
      setCourses(data);

      // Fetch all lessons grouped by course for better UI
      const lessonsData = await db
        .select({
          id: lessonsTable.id,
          title: lessonsTable.title,
          courseTitle: coursesTable.title
        })
        .from(lessonsTable)
        .innerJoin(coursesTable, eq(lessonsTable.courseId, coursesTable.id))
        .where(eq(lessonsTable.isPublished, true));

      setAllLessons(lessonsData);
    } catch (error) {
      console.error("Error fetching courses/lessons:", error);
    }
  };

  const fetchPackageCourses = async (packageId: string) => {
    const data = await db.select({ courseId: packageCourses.courseId })
      .from(packageCourses)
      .where(eq(packageCourses.packageId, packageId));
    return data.map((pc) => pc.courseId || "") || [];
  };

  const fetchPackageLessons = async (packageId: string) => {
    const data = await db.select({ lessonId: packageLessons.lessonId })
      .from(packageLessons)
      .where(eq(packageLessons.packageId, packageId));
    return data.map((pl) => pl.lessonId || "") || [];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        name: formData.name,
        nameEn: formData.name_en,
        description: formData.description,
        price: formData.price.toString(),
        durationDays: formData.duration_days,
        isFree: formData.is_free,
        isPublished: formData.is_published,
        features: formData.features,
      };

      if (editingPackage) {
        await db.update(packagesTable)
          .set(payload)
          .where(eq(packagesTable.id, editingPackage.id));

        // Update package courses
        await db.delete(packageCourses).where(eq(packageCourses.packageId, editingPackage.id));

        if (selectedCourses.length > 0) {
          await db.insert(packageCourses).values(
            selectedCourses.map((courseId) => ({
              packageId: editingPackage.id,
              courseId: courseId,
            }))
          );
        }

        // Update package lessons
        await db.delete(packageLessons).where(eq(packageLessons.packageId, editingPackage.id));
        if (selectedLessons.length > 0) {
          await db.insert(packageLessons).values(
            selectedLessons.map((lessonId) => ({
              packageId: editingPackage.id,
              lessonId: lessonId,
            }))
          );
        }

        toast({ title: "تم تحديث الباقة بنجاح ✓" });
      } else {
        const [newPackage] = await db.insert(packagesTable).values(payload).returning();

        if (selectedCourses.length > 0 && newPackage) {
          await db.insert(packageCourses).values(
            selectedCourses.map((courseId) => ({
              packageId: newPackage.id,
              courseId: courseId,
            }))
          );
        }

        if (selectedLessons.length > 0 && newPackage) {
          await db.insert(packageLessons).values(
            selectedLessons.map((lessonId) => ({
              packageId: newPackage.id,
              lessonId: lessonId,
            }))
          );
        }

        toast({ title: "تم إضافة الباقة بنجاح ✓" });
      }

      setIsDialogOpen(false);
      setEditingPackage(null);
      resetForm();
      fetchPackages();
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
    if (!confirm("هل أنت متأكد من حذف هذه الباقة؟")) return;

    try {
      await db.delete(packagesTable).where(eq(packagesTable.id, id));
      toast({ title: "تم حذف الباقة ✓" });
      fetchPackages();
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
      name: "",
      name_en: "",
      description: "",
      price: 0,
      duration_days: null,
      is_free: false,
      is_published: true,
      features: [],
    });
    setSelectedCourses([]);
    setSelectedLessons([]);
    setNewFeature("");
  };

  const openEditDialog = async (pkg: PackageData) => {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name,
      name_en: pkg.nameEn || "",
      description: pkg.description || "",
      price: parseFloat(pkg.price),
      duration_days: pkg.durationDays,
      is_free: pkg.isFree || false,
      is_published: pkg.isPublished || true,
      features: pkg.features || [],
    });
    const packageCourses = await fetchPackageCourses(pkg.id);
    setSelectedCourses(packageCourses);
    const packageLessons = await fetchPackageLessons(pkg.id);
    setSelectedLessons(packageLessons);
    setIsDialogOpen(true);
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature.trim()],
      });
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  const filteredPackages = packages.filter(
    (pkg) =>
      pkg.name.includes(searchQuery) ||
      pkg.nameEn?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl font-bold font-cairo text-foreground">
            إدارة الباقات
          </h1>
          <p className="text-muted-foreground font-cairo mt-1">
            أضف وحرر باقات الاشتراك (مجانية أو مدفوعة)
          </p>
        </motion.div>

        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setEditingPackage(null);
              resetForm();
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="btn-gold">
              <Plus className="w-5 h-5 ml-2" />
              إضافة باقة
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-xl font-cairo text-foreground">
                {editingPackage ? "تعديل الباقة" : "إضافة باقة جديدة"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-cairo">اسم الباقة (عربي)</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="مثال: الباقة الأساسية"
                    className="mt-1 bg-muted/50 border-border font-cairo"
                    required
                  />
                </div>
                <div>
                  <Label className="font-cairo">اسم الباقة (إنجليزي)</Label>
                  <Input
                    value={formData.name_en}
                    onChange={(e) =>
                      setFormData({ ...formData, name_en: e.target.value })
                    }
                    placeholder="Basic Package"
                    className="mt-1 bg-muted/50 border-border"
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <Label className="font-cairo">الوصف</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="وصف الباقة..."
                  className="mt-1 bg-muted/50 border-border font-cairo min-h-20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-cairo">السعر ($)</Label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="mt-1 bg-muted/50 border-border"
                    min={0}
                    step="0.01"
                    disabled={formData.is_free}
                  />
                </div>
                <div>
                  <Label className="font-cairo">مدة الصلاحية (أيام)</Label>
                  <Input
                    type="number"
                    value={formData.duration_days || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        duration_days: e.target.value
                          ? parseInt(e.target.value)
                          : null,
                      })
                    }
                    placeholder="اتركه فارغاً للاشتراك الدائم"
                    className="mt-1 bg-muted/50 border-border"
                    min={1}
                  />
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={formData.is_free}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        is_free: checked,
                        price: checked ? 0 : formData.price,
                      })
                    }
                  />
                  <Label className="font-cairo">باقة مجانية</Label>
                </div>
                <div className="flex items-center gap-3">
                  <Switch
                    checked={formData.is_published}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, is_published: checked })
                    }
                  />
                  <Label className="font-cairo">منشورة</Label>
                </div>
              </div>

              {/* Features */}
              <div>
                <Label className="font-cairo">مميزات الباقة</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="أضف ميزة..."
                    className="bg-muted/50 border-border font-cairo"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                  />
                  <Button type="button" onClick={addFeature} className="btn-emerald px-4">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="mt-2 space-y-2">
                  {formData.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-gold" />
                        <span className="font-cairo text-sm">{feature}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selection Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Courses Selection */}
                <div>
                  <Label className="font-cairo mb-2 block">الدورات المشمولة</Label>
                  <ScrollArea className="h-40 border border-border rounded-lg p-3">
                    <div className="space-y-2">
                      {courses.map((course) => (
                        <div key={course.id} className="flex items-center gap-3">
                          <Checkbox
                            id={`course-${course.id}`}
                            checked={selectedCourses.includes(course.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedCourses([...selectedCourses, course.id]);
                              } else {
                                setSelectedCourses(
                                  selectedCourses.filter((id) => id !== course.id)
                                );
                              }
                            }}
                          />
                          <Label htmlFor={`course-${course.id}`} className="font-cairo text-sm cursor-pointer">{course.title}</Label>
                        </div>
                      ))}
                      {courses.length === 0 && (
                        <p className="text-muted-foreground text-sm font-cairo">
                          لا توجد دورات منشورة
                        </p>
                      )}
                    </div>
                  </ScrollArea>
                </div>

                {/* Lessons Selection */}
                <div>
                  <Label className="font-cairo mb-2 block">دروس فردية مشمولة</Label>
                  <ScrollArea className="h-40 border border-border rounded-lg p-3">
                    <div className="space-y-3">
                      {allLessons.map((lesson) => (
                        <div key={lesson.id} className="flex items-start gap-3">
                          <Checkbox
                            id={`lesson-${lesson.id}`}
                            checked={selectedLessons.includes(lesson.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedLessons([...selectedLessons, lesson.id]);
                              } else {
                                setSelectedLessons(
                                  selectedLessons.filter((id) => id !== lesson.id)
                                );
                              }
                            }}
                            className="mt-1"
                          />
                          <div>
                            <Label htmlFor={`lesson-${lesson.id}`} className="font-cairo text-sm cursor-pointer block">{lesson.title}</Label>
                            <span className="text-[10px] text-muted-foreground font-cairo block">دورة: {lesson.courseTitle}</span>
                          </div>
                        </div>
                      ))}
                      {allLessons.length === 0 && (
                        <p className="text-muted-foreground text-sm font-cairo">
                          لا توجد دروس حالياً
                        </p>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="btn-gold flex-1"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : editingPackage ? (
                    "حفظ التغييرات"
                  ) : (
                    "إضافة الباقة"
                  )}
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
          placeholder="ابحث عن باقة..."
          className="pr-10 bg-muted/50 border-border font-cairo"
        />
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
          </div>
        ) : filteredPackages.length === 0 ? (
          <div className="col-span-full text-center p-12">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground font-cairo">لا توجد باقات</p>
          </div>
        ) : (
          filteredPackages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card-luxury p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold font-cairo text-foreground">
                    {pkg.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{pkg.nameEn}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-cairo ${pkg.isPublished
                    ? "bg-emerald/20 text-emerald-light"
                    : "bg-muted text-muted-foreground"
                    }`}
                >
                  {pkg.isPublished ? "منشورة" : "مسودة"}
                </span>
              </div>

              <div className="mb-4">
                {pkg.isFree ? (
                  <span className="text-2xl font-bold text-emerald-light font-cairo">
                    مجاني
                  </span>
                ) : (
                  <span className="text-2xl font-bold text-foreground font-cairo">
                    ${pkg.price}
                    <span className="text-sm text-muted-foreground mr-1">
                      {pkg.durationDays ? `/ ${pkg.durationDays} يوم` : "/ دائم"}
                    </span>
                  </span>
                )}
              </div>

              {pkg.features && pkg.features.length > 0 && (
                <ul className="space-y-2 mb-4">
                  {pkg.features.slice(0, 3).map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-foreground/80 font-cairo">
                      <Check className="w-4 h-4 text-gold" />
                      {feature}
                    </li>
                  ))}
                  {pkg.features.length > 3 && (
                    <li className="text-sm text-muted-foreground font-cairo">
                      +{pkg.features.length - 3} مميزات أخرى
                    </li>
                  )}
                </ul>
              )}

              <div className="flex gap-2 pt-4 border-t border-border">
                <Button
                  onClick={() => openEditDialog(pkg)}
                  variant="outline"
                  size="sm"
                  className="flex-1 border-border"
                >
                  <Pencil className="w-4 h-4 ml-1" />
                  تعديل
                </Button>
                <Button
                  onClick={() => handleDelete(pkg.id)}
                  variant="outline"
                  size="sm"
                  className="border-destructive/50 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default Packages;
