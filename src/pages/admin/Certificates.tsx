import { useState, useCallback, useEffect } from "react";
import { Loader2, Search, Award, FileText, QrCode } from "lucide-react";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/db";
import { certificates, profiles, courses } from "@/lib/schema";
import { desc, eq } from "drizzle-orm";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface CertificateData {
    id: string;
    certificateNumber: string;
    issuedAt: Date | null;
    userFullName: string | null;
    username: string | null;
    courseTitle: string | null;
}

const Certificates = () => {
    const [certList, setCertList] = useState<CertificateData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

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
                })
                .from(certificates)
                .leftJoin(profiles, eq(certificates.userId, profiles.id))
                .leftJoin(courses, eq(certificates.courseId, courses.id))
                .orderBy(desc(certificates.issuedAt));

            setCertList(data as CertificateData[]);
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

    return (
        <div className="p-8 space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-amiri font-bold text-gold-gradient mb-2">الشهادات</h1>
                    <p className="text-muted-foreground font-cairo">الشهادات الصادرة للطلاب</p>
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
                                    <Button variant="outline" size="sm" className="gap-2">
                                        <FileText className="w-3 h-3" />
                                        عرض الشهادة
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Certificates;
