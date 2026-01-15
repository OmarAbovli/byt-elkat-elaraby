import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Search, Award, FileText, QrCode, Plus, Palette } from "lucide-react";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/db";
import { certificates, profiles, courses, certificateTemplates } from "@/lib/schema";
import { desc, eq } from "drizzle-orm";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SingleImageUpload from "@/components/admin/SingleImageUpload";

interface CertificateData {
    id: string;
    certificateNumber: string;
    issuedAt: Date | null;
    userFullName: string | null;
    username: string | null;
    courseTitle: string | null;
    templateName: string | null; // Added
    attachmentUrl: string | null; // Added
}

const Certificates = () => {
    const navigate = useNavigate();
    const [certList, setCertList] = useState<CertificateData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    // Manual issue state
    const [users, setUsers] = useState<{ id: string; fullName: string | null; username: string | null }[]>([]);
    const [allCourses, setAllCourses] = useState<{ id: string; title: string }[]>([]);
    const [allTemplates, setAllTemplates] = useState<{ id: string; name: string }[]>([]); // Added
    const [isIssueDialogOpen, setIsIssueDialogOpen] = useState(false);
    const [isDesignDialogOpen, setIsDesignDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState("");
    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedTemplate, setSelectedTemplate] = useState(""); // Added
    const [attachmentUrl, setAttachmentUrl] = useState(""); // Added
    const [issueSource, setIssueSource] = useState("course"); // Added
    const [courseToDesign, setCourseToDesign] = useState("");
    const [isIssuing, setIsIssuing] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await db
                .select({
                    id: certificates.id,
                    certificateNumber: certificates.certificateNumber,
                    issuedAt: certificates.issuedAt,
                    userFullName: profiles.fullName,
                    username: profiles.username,
                    courseTitle: courses.title,
                    templateName: certificateTemplates.name, // Added
                    attachmentUrl: certificates.attachmentUrl, // Added
                })
                .from(certificates)
                .leftJoin(profiles, eq(certificates.userId, profiles.id))
                .leftJoin(courses, eq(certificates.courseId, courses.id))
                .leftJoin(certificateTemplates, eq(certificates.templateId, certificateTemplates.id)) // Added
                .orderBy(desc(certificates.issuedAt));

            setCertList(data as CertificateData[]);
        } catch (error: unknown) {
            console.error(error);
            toast({
                title: "خطأ",
                description: "حدث خطأ أثناء جلب البيانات",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    const fetchOptions = async () => {
        try {
            const usersData = await db.select({ id: profiles.id, fullName: profiles.fullName, username: profiles.username }).from(profiles);
            const coursesData = await db.select({ id: courses.id, title: courses.title }).from(courses);
            const templatesData = await db.select({ id: certificateTemplates.id, name: certificateTemplates.name }).from(certificateTemplates); // Added

            setUsers(usersData);
            setAllCourses(coursesData);
            setAllTemplates(templatesData);
        } catch (error) {
            console.error(error);
            toast({ title: "خطأ", description: "فشل تحميل قائمة المستخدمين أو الدورات", variant: "destructive" });
        }
    };

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        if (isIssueDialogOpen) {
            fetchOptions();
        }
    }, [isIssueDialogOpen]);

    const handleIssueCertificate = async () => {
        if (!selectedUser) {
            toast({ title: "خطأ", description: "الرجاء اختيار الطالب", variant: "destructive" });
            return;
        }

        if (issueSource === 'course' && !selectedCourse) {
            toast({ title: "خطأ", description: "الرجاء اختيار الدورة", variant: "destructive" });
            return;
        }
        if (issueSource === 'template' && !selectedTemplate) {
            toast({ title: "خطأ", description: "الرجاء اختيار القالب", variant: "destructive" });
            return;
        }
        if (issueSource === 'file' && !attachmentUrl) {
            toast({ title: "خطأ", description: "الرجاء رفع ملف الشهادة", variant: "destructive" });
            return;
        }

        setIsIssuing(true);
        try {
            // Check if already exists (optional, skpping for now or need better logic for templates)

            // Generate Number
            const certNum = `CERT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

            const values: any = {
                userId: selectedUser,
                certificateNumber: certNum,
            };

            if (issueSource === 'course') {
                values.courseId = selectedCourse;
            } else if (issueSource === 'template') {
                values.templateId = selectedTemplate;
            } else if (issueSource === 'file') {
                values.attachmentUrl = attachmentUrl;
            }

            await db.insert(certificates).values(values);

            toast({ title: "تم إصدار الشهادة بنجاح", className: "bg-emerald-500 text-white" });
            setIsIssueDialogOpen(false);

            // Reset fields
            setSelectedCourse("");
            setSelectedTemplate("");
            setAttachmentUrl("");
            setSelectedUser("");

            fetchData();
        } catch (error) {
            console.error(error);
            toast({ title: "خطأ", description: "فشل إصدار الشهادة", variant: "destructive" });
        } finally {
            setIsIssuing(false);
        }
    };

    return (
        <div className="p-8 space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-amiri font-bold text-gold-gradient mb-2">الشهادات</h1>
                    <p className="text-muted-foreground font-cairo">الشهادات الصادرة للطلاب</p>
                </div>

                <div className="flex gap-3">
                    <Dialog open={isDesignDialogOpen} onOpenChange={setIsDesignDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="gap-2 border-gold text-gold hover:bg-gold/10 font-cairo">
                                <Palette className="w-4 h-4" />
                                تصميم نموذج شهادة
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className="font-amiri text-xl">تصميم نموذج شهادة</DialogTitle>
                            </DialogHeader>
                            <Tabs defaultValue="course" className="w-full">
                                <TabsList className="grid w-full grid-cols-2 font-cairo">
                                    <TabsTrigger value="course">شهادة دورة</TabsTrigger>
                                    <TabsTrigger value="template">قالب عام</TabsTrigger>
                                </TabsList>

                                <TabsContent value="course" className="space-y-4 pt-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium font-cairo">الدورة</label>
                                        <Select value={courseToDesign} onValueChange={setCourseToDesign}>
                                            <SelectTrigger className="font-cairo text-right">
                                                <SelectValue placeholder="اختر الدورة" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {allCourses.map(c => (
                                                    <SelectItem key={c.id} value={c.id} className="font-cairo">
                                                        {c.title}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Button
                                        onClick={() => window.location.href = `/admin/courses/${courseToDesign}/builder`}
                                        disabled={!courseToDesign}
                                        className="w-full btn-gold mt-4"
                                    >
                                        فتح مصمم الدورة
                                    </Button>
                                </TabsContent>

                                <TabsContent value="template" className="space-y-4 pt-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium font-cairo">القوالب الموجودة</label>
                                        <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                                            <SelectTrigger className="font-cairo text-right">
                                                <SelectValue placeholder="اختر القالب للتعديل" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {allTemplates.map(t => (
                                                    <SelectItem key={t.id} value={t.id} className="font-cairo">
                                                        {t.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Button
                                            onClick={() => navigate(`/admin/templates/${selectedTemplate}/builder`)}
                                            disabled={!selectedTemplate}
                                            variant="outline"
                                            className="w-full"
                                        >
                                            تعديل المحدد
                                        </Button>
                                        <Button
                                            onClick={() => navigate(`/admin/templates/new/builder`)}
                                            className="w-full btn-gold"
                                        >
                                            <Plus className="w-4 h-4 ml-2" />
                                            قالب جديد
                                        </Button>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={isIssueDialogOpen} onOpenChange={setIsIssueDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="btn-gold gap-2 font-cairo">
                                <Plus className="w-4 h-4" />
                                منح شهادة يدوية
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className="font-amiri text-xl">منح شهادة جديدة</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium font-cairo">الطالب</label>
                                    <Select value={selectedUser} onValueChange={setSelectedUser}>
                                        <SelectTrigger className="font-cairo text-right">
                                            <SelectValue placeholder="اختر الطالب" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <div className="p-2">
                                                <Input
                                                    placeholder="بحث..."
                                                    className="mb-2 h-8 text-xs font-cairo"
                                                    onKeyDown={(e) => e.stopPropagation()}
                                                />
                                            </div>
                                            {users.map(u => (
                                                <SelectItem key={u.id} value={u.id} className="font-cairo">
                                                    {u.fullName || u.username || "مستخدم بدون اسم"}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <Tabs defaultValue="course" className="w-full" onValueChange={setIssueSource}>
                                    <TabsList className="grid w-full grid-cols-3 font-cairo">
                                        <TabsTrigger value="course">دورة تدريبية</TabsTrigger>
                                        <TabsTrigger value="template">قالب جاهز</TabsTrigger>
                                        <TabsTrigger value="file">ملف خارجي</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="course" className="space-y-4 pt-2">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium font-cairo">الدورة</label>
                                            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                                                <SelectTrigger className="font-cairo text-right">
                                                    <SelectValue placeholder="اختر الدورة" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {allCourses.map(c => (
                                                        <SelectItem key={c.id} value={c.id} className="font-cairo">
                                                            {c.title}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="template" className="space-y-4 pt-2">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium font-cairo">القالب</label>
                                            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                                                <SelectTrigger className="font-cairo text-right">
                                                    <SelectValue placeholder="اختر القالب" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {allTemplates.length === 0 && (
                                                        <div className="p-2 text-xs text-muted-foreground text-center font-cairo">لا توجد قوالب</div>
                                                    )}
                                                    {allTemplates.map(t => (
                                                        <SelectItem key={t.id} value={t.id} className="font-cairo">
                                                            {t.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="file" className="space-y-4 pt-2">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium font-cairo">ملف الشهادة (صورة أو PDF)</label>
                                            <SingleImageUpload
                                                value={attachmentUrl}
                                                onChange={setAttachmentUrl}
                                                onRemove={() => setAttachmentUrl("")}
                                            />
                                            <p className="text-xs text-muted-foreground font-cairo">
                                                يمكنك رفع صورة الشهادة مباشرة أو ملف PDF
                                            </p>
                                        </div>
                                    </TabsContent>
                                </Tabs>

                                <Button onClick={handleIssueCertificate} disabled={isIssuing} className="w-full btn-gold mt-4">
                                    {isIssuing ? <Loader2 className="w-4 h-4 animate-spin" /> : "إصدار الشهادة"}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    <div className="col-span-full flex justify-center p-12">
                        <Loader2 className="w-8 h-8 animate-spin text-gold" />
                    </div>
                ) : certList.length === 0 ? (
                    <div className="col-span-full text-center p-12 text-muted-foreground border border-dashed border-border rounded-lg">
                        لا توجد شهادات صادرة حتى الآن
                    </div>
                ) : (
                    certList.map((cert) => (
                        <div key={cert.id} className="card-luxury p-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                <Award className="w-32 h-32" />
                            </div>

                            <div className="relative z-10 space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className="p-3 bg-gold/10 rounded-full">
                                        <Award className="w-6 h-6 text-gold" />
                                    </div>
                                    <span className="text-xs font-mono text-muted-foreground bg-secondary/10 px-2 py-1 rounded">
                                        #{cert.certificateNumber}
                                    </span>
                                </div>

                                <div>
                                    <h3 className="font-bold text-lg mb-1">{cert.userFullName}</h3>
                                    <p className="text-sm text-gold-dark">{cert.courseTitle}</p>
                                </div>

                                <div className="pt-4 border-t border-border flex justify-between items-end">
                                    <div className="text-xs text-muted-foreground">
                                        {new Date(cert.issuedAt || "").toLocaleDateString('ar-EG')}
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-2"
                                        onClick={() => {
                                            if (cert.attachmentUrl) {
                                                window.open(cert.attachmentUrl, '_blank');
                                            } else {
                                                window.open(`/certificate-preview?id=${cert.id}`, '_blank');
                                            }
                                        }}
                                    >
                                        <FileText className="w-3 h-3" />
                                        عرض الشهادة
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div >
    );
};

export default Certificates;
