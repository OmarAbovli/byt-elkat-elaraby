import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Certificate from "@/components/Certificate";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { db } from "@/lib/db";
import { certificates, profiles, courses, certificateTemplates } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { Loader2 } from "lucide-react";

interface CertificateInfo {
    studentName: string;
    courseName: string;
    certificateNumber: string;
    issuedAt: Date;
    attachmentUrl: string | null;
    settings: any;
}

const CertificatePreview = () => {
    const [searchParams] = useSearchParams();
    const certId = searchParams.get("id");

    const [certificate, setCertificate] = useState<CertificateInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCertificate = async () => {
            if (!certId) {
                setError("لم يتم تحديد الشهادة");
                setIsLoading(false);
                return;
            }

            try {
                const data = await db
                    .select({
                        certificateNumber: certificates.certificateNumber,
                        issuedAt: certificates.issuedAt,
                        attachmentUrl: certificates.attachmentUrl,
                        studentFullName: profiles.fullName,
                        studentUsername: profiles.username,
                        courseTitle: courses.title,
                        courseSettings: courses.certificateSettings,
                        templateSettings: certificateTemplates.settings,
                    })
                    .from(certificates)
                    .leftJoin(profiles, eq(certificates.userId, profiles.id))
                    .leftJoin(courses, eq(certificates.courseId, courses.id))
                    .leftJoin(certificateTemplates, eq(certificates.templateId, certificateTemplates.id))
                    .where(eq(certificates.id, certId));

                if (data.length === 0) {
                    setError("الشهادة غير موجودة");
                    setIsLoading(false);
                    return;
                }

                const cert = data[0];
                setCertificate({
                    studentName: cert.studentFullName || cert.studentUsername || "طالب",
                    courseName: cert.courseTitle || "شهادة تقدير",
                    certificateNumber: cert.certificateNumber,
                    issuedAt: cert.issuedAt || new Date(),
                    attachmentUrl: cert.attachmentUrl,
                    settings: cert.courseSettings || cert.templateSettings || null,
                });
            } catch (err) {
                console.error("Error fetching certificate:", err);
                setError("حدث خطأ أثناء تحميل الشهادة");
            } finally {
                setIsLoading(false);
            }
        };

        fetchCertificate();
    }, [certId]);

    const handlePrint = () => {
        window.print();
    };

    // If certificate is an attached file, redirect to it
    if (certificate?.attachmentUrl) {
        return (
            <div className="min-h-screen bg-background flex flex-col relative">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center p-8 pt-24 gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <h1 className="text-2xl font-bold font-amiri text-gold-gradient">شهادة مرفقة</h1>
                        <p className="text-muted-foreground font-cairo">هذه الشهادة عبارة عن ملف مرفق</p>
                        <Button onClick={() => window.open(certificate.attachmentUrl!, '_blank')} className="btn-gold gap-2 font-cairo">
                            فتح الملف المرفق
                        </Button>
                    </div>
                    {certificate.attachmentUrl.startsWith('data:image') && (
                        <div className="border border-border shadow-2xl overflow-auto max-w-full">
                            <img src={certificate.attachmentUrl} alt="شهادة" className="max-w-4xl" />
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col relative">
            <style>
                {`
                    @media print {
                        @page {
                            size: landscape;
                            margin: 0;
                        }
                        body {
                            margin: 0;
                            padding: 0;
                            background: white;
                        }
                        .no-print {
                            display: none !important;
                        }
                        .print-content {
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            margin: 0;
                            padding: 0;
                            display: flex;
                            justify-content: center;
                            items-align: center;
                            background: white;
                        }
                        /* Scale down if needed to fit standard A4 margins if printer acts up */
                        .certificate-container {
                            transform: scale(0.95);
                            transform-origin: center;
                        }
                    }
                `}
            </style>

            <div className="no-print">
                <Navbar />
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-8 pt-24 gap-8 no-print">
                {isLoading ? (
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-12 h-12 animate-spin text-gold" />
                        <p className="text-muted-foreground font-cairo">جاري تحميل الشهادة...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center gap-4">
                        <p className="text-red-500 font-cairo">{error}</p>
                    </div>
                ) : certificate ? (
                    <>
                        <div className="flex flex-col items-center gap-4">
                            <h1 className="text-2xl font-bold font-amiri text-gold-gradient">معاينة الشهادة</h1>
                            <p className="text-muted-foreground font-cairo">هذا نموذج لكيفية ظهور الشهادة عند الطباعة</p>
                            <Button onClick={handlePrint} className="btn-gold gap-2 font-cairo">
                                طباعة / تحميل PDF
                            </Button>
                        </div>

                        <div className="border border-border shadow-2xl overflow-auto max-w-full">
                            <Certificate
                                studentName={certificate.studentName}
                                courseName={certificate.courseName}
                                date={new Date(certificate.issuedAt)}
                                certificateId={certificate.certificateNumber}
                                settings={certificate.settings}
                            />
                        </div>
                    </>
                ) : null}
            </div>

            {/* Hidden Print Content */}
            {certificate && (
                <div className="hidden print:flex print-content justify-center items-center h-screen w-screen bg-white">
                    <div className="certificate-container">
                        <Certificate
                            studentName={certificate.studentName}
                            courseName={certificate.courseName}
                            date={new Date(certificate.issuedAt)}
                            certificateId={certificate.certificateNumber}
                            settings={certificate.settings}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default CertificatePreview;
