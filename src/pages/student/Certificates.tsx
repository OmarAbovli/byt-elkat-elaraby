
import { useState, useEffect } from "react";
import { Loader2, Award, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { certificates, courses } from "@/lib/schema";
import { desc, eq } from "drizzle-orm";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface MyCertificate {
    id: string;
    certificateNumber: string;
    issuedAt: Date | null;
    courseTitle: string | null;
    courseId: string | null;
}

const StudentCertificates = () => {
    const { user } = useAuth();
    const [myCertificates, setMyCertificates] = useState<MyCertificate[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchData = async () => {
            if (!user?.id) return;
            try {
                const data = await db
                    .select({
                        id: certificates.id,
                        certificateNumber: certificates.certificateNumber,
                        issuedAt: certificates.issuedAt,
                        courseTitle: courses.title,
                        courseId: courses.id,
                    })
                    .from(certificates)
                    .innerJoin(courses, eq(certificates.courseId, courses.id))
                    .where(eq(certificates.userId, user.id))
                    .orderBy(desc(certificates.issuedAt));

                setMyCertificates(data as MyCertificate[]);
            } catch (error) {
                console.error("Failed to fetch certificates:", error);
                toast({ title: "فشل تحميل الشهادات", variant: "destructive" });
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [user, toast]);

    const handleDownload = (certId: string) => {
        // Since we don't have a real PDF generation backend yet, 
        // we can redirect to the preview page with a query param or ID
        // For MVP: Redirect to the generic preview page but ideally it should load SPECIFIC certificate data.
        // We will repurpose the preview page to load by ID if present, or just show a success message.
        window.open(`/certificate-preview?id=${certId}`, '_blank');
    };

    return (
        <div className="p-8 space-y-8 animate-fade-in direction-rtl">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-amiri font-bold text-gold-gradient mb-2">شهاداتي</h1>
                    <p className="text-muted-foreground font-cairo">سجل جميع الشهادات التي حصلت عليها من الأكاديمية</p>
                </div>
                <Link to="/verify">
                    <Button variant="outline" className="gap-2 border-gold/30 text-gold hover:bg-gold/10 font-cairo">
                        <Award className="w-4 h-4" /> التحقق من شهادة
                    </Button>
                </Link>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-gold" />
                </div>
            ) : myCertificates.length === 0 ? (
                <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed border-border">
                    <Award className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
                    <h3 className="font-bold text-lg mb-2 font-cairo">لا توجد شهادات بعد</h3>
                    <p className="text-muted-foreground text-sm font-cairo mb-6">أكمل الدورات للحصول على شهادات معتمدة.</p>
                    <Link to="/courses">
                        <Button className="btn-gold font-cairo">تصفح الدورات</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myCertificates.map((cert) => (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            key={cert.id}
                            className="card-luxury p-0 overflow-hidden group hover:shadow-xl transition-all duration-300"
                        >
                            <div className="bg-gradient-to-l from-gold/10 to-primary/5 p-8 flex flex-col items-center justify-center border-b border-border/50 relative overflow-hidden">
                                <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5"></div>
                                <Award className="w-16 h-16 text-gold mb-4 drop-shadow-md group-hover:scale-110 transition-transform duration-500" />
                                <h3 className="font-bold text-lg font-amiri text-center text-foreground">{cert.courseTitle}</h3>
                            </div>

                            <div className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm items-center">
                                        <span className="text-muted-foreground font-cairo">رقم الشهادة:</span>
                                        <span className="font-mono text-xs bg-muted px-2 py-1 rounded">{cert.certificateNumber}</span>
                                    </div>
                                    <div className="flex justify-between text-sm items-center">
                                        <span className="text-muted-foreground font-cairo">تاريخ الإصدار:</span>
                                        <span className="font-mono text-xs">{new Date(cert.issuedAt || "").toLocaleDateString('ar-EG')}</span>
                                    </div>
                                </div>

                                <div className="pt-4 flex gap-2">
                                    <Button
                                        className="flex-1 gap-2 font-cairo bg-gradient-to-r from-gold to-amber-600 hover:from-amber-600 hover:to-gold text-white border-none shadow-lg shadow-gold/20"
                                        onClick={() => handleDownload(cert.id)}
                                    >
                                        <Download className="w-4 h-4" /> تحميل PDF
                                    </Button>
                                    <Button variant="outline" size="icon" className="border-gold/30 text-gold hover:bg-gold/10" title="تحقق">
                                        <ExternalLink className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StudentCertificates;
