
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, Search, CheckCircle2, XCircle, Award, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { db } from "@/lib/db";
import { certificates, courses, profiles } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { motion } from "framer-motion";

const CertificateVerify = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [serialNumber, setSerialNumber] = useState(id || "");
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [hasSearched, setHasSearched] = useState(false);

    useEffect(() => {
        if (id) {
            handleVerify(id);
        }
    }, [id]);

    const handleVerify = async (serial: string) => {
        if (!serial) return;
        setIsLoading(true);
        setError(null);
        setResult(null);
        setHasSearched(true);

        try {
            // Find certificate by serial number (certificateNumber)
            // Join with course and profile to get details
            const certs = await db
                .select({
                    certificate: certificates,
                    course: courses,
                    student: profiles
                })
                .from(certificates)
                .innerJoin(courses, eq(certificates.courseId, courses.id))
                // Note: user_id in certificates table might refer to auth user ID or profile ID. 
                // Based on schema 'userId: uuid('user_id'),' and profiles 'userId: uuid('user_id'), id: uuid('id')...'
                // We should typically join certificates.userId = profiles.userId OR profiles.id depending on how it was saved.
                // In LessonView we saved it using user.id. 
                // Let's assume certificates.userId matches profiles.id (if profiles.id is the master ID) OR profiles.userId.
                // Since we use useAuth().user.id which often maps to profiles.id in this app setup:
                .innerJoin(profiles, eq(certificates.userId, profiles.id)) // Trying direct match first
                .where(eq(certificates.certificateNumber, serial));

            if (certs && certs.length > 0) {
                setResult(certs[0]);
            } else {
                setError("لم يتم العثور على شهادة بهذا الرقم التسلسلي. يرجى التحقق وإعادة المحاولة.");
            }
        } catch (err) {
            console.error("Verification error:", err);
            setError("حدث خطأ أثناء عملية التحقق. يرجى المحاولة مرة أخرى.");
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (serialNumber.trim()) {
            navigate(`/verify/${serialNumber.trim()}`);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <main className="flex-1 container mx-auto px-4 py-24 flex flex-col items-center">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-2xl text-center mb-12"
                >
                    <Award className="w-20 h-20 text-gold mx-auto mb-6" />
                    <h1 className="text-4xl font-bold font-amiri text-gold-gradient mb-4">
                        التحقق من صحة الشهادات
                    </h1>
                    <p className="text-muted-foreground font-cairo text-lg">
                        أدخل الرقم التسلسلي للشهادة للتأكد من صحتها وعرض بيانات الطالب المسجلة
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="w-full max-w-xl mb-12"
                >
                    <form onSubmit={onSubmit} className="flex gap-2">
                        <Input
                            type="text"
                            placeholder="أدخل رقم الشهادة (مثل: CERT-12345)"
                            value={serialNumber}
                            onChange={(e) => setSerialNumber(e.target.value)}
                            className="h-12 text-lg font-mono text-center uppercase"
                        />
                        <Button type="submit" size="lg" className="h-12 px-8 btn-gold font-cairo" disabled={isLoading}>
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                            <span className="mr-2 hidden sm:inline">تحقق</span>
                        </Button>
                    </form>
                </motion.div>

                {hasSearched && !isLoading && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-2xl"
                    >
                        {result ? (
                            <div className="bg-card border-2 border-emerald-500/30 rounded-2xl overflow-hidden shadow-2xl">
                                <div className="bg-emerald-500/10 p-6 flex items-center justify-center gap-3 border-b border-emerald-500/20">
                                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                                    <h2 className="text-2xl font-bold text-emerald-600 font-amiri">شهادة معتمدة وصحيحة</h2>
                                </div>
                                <div className="p-8 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-sm text-muted-foreground font-cairo">اسم الطالب</label>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                                                    <User className="w-5 h-5" />
                                                </div>
                                                <p className="text-xl font-bold text-foreground">{result.student.fullName}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm text-muted-foreground font-cairo">تاريخ الإصدار</label>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                    <Calendar className="w-5 h-5" />
                                                </div>
                                                <p className="text-xl font-bold text-foreground font-mono">
                                                    {new Date(result.certificate.issuedAt).toLocaleDateString("ar-EG")}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-border">
                                        <label className="text-sm text-muted-foreground font-cairo mb-2 block">الدورة التدريبية</label>
                                        <div className="bg-muted/30 p-4 rounded-xl border border-border">
                                            <p className="text-2xl font-bold text-gold-gradient font-amiri text-center">
                                                {result.course.title}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-center pt-4">
                                        <p className="text-xs text-muted-foreground font-mono">ID: {result.certificate.certificateNumber}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-destructive/5 border-2 border-destructive/20 rounded-2xl p-12 text-center">
                                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <XCircle className="w-8 h-8 text-destructive" />
                                </div>
                                <h2 className="text-2xl font-bold text-destructive mb-2 font-cairo">الشهادة غير صحيحة</h2>
                                <p className="text-muted-foreground font-cairo text-lg">
                                    {error || "لم يتم العثور على أي سجلات لهذه الشهادة في قاعدة البيانات."}
                                </p>
                            </div>
                        )}
                    </motion.div>
                )}

            </main>
            <Footer />
        </div>
    );
};

export default CertificateVerify;
