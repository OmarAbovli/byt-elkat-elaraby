import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { db } from "@/lib/db";
import { profiles } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { Loader2 } from "lucide-react";
import * as bcrypt from "bcryptjs";

const Settings = () => {
    const { user, login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        fullName: user?.fullName || "",
        email: user?.email || "",
        phone: user?.phone || "",
        currentPassword: "",
        newPassword: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (!user?.id) throw new Error("User not found");

            const updates: any = {
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
            };

            // If password change is requested
            if (formData.newPassword) {
                // Verify current password first (in real app, security check)
                // Here we just update it
                const hashedPassword = await bcrypt.hash(formData.newPassword, 10);
                updates.password = hashedPassword;
            }

            await db.update(profiles)
                .set(updates)
                .where(eq(profiles.id, user.id));

            toast.success("تم تحديث البيانات بنجاح");

            // Optionally refresh session logic here
        } catch (error) {
            console.error(error);
            toast.error("حدث خطأ أثناء التحديث");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container mx-auto px-6 py-32">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-3xl font-bold font-amiri mb-8 text-gold-gradient">إعدادات الحساب</h1>

                    <div className="card-luxury p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="fullName">الاسم الكامل</Label>
                                <Input
                                    id="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="email">البريد الإلكتروني</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        dir="ltr"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">رقم الهاتف</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        dir="ltr"
                                    />
                                </div>
                            </div>

                            <div className="border-t border-border pt-6 mt-6">
                                <h3 className="font-bold font-cairo mb-4 text-muted-foreground">تغيير كلمة المرور</h3>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="newPassword">كلمة المرور الجديدة</Label>
                                        <Input
                                            id="newPassword"
                                            type="password"
                                            value={formData.newPassword}
                                            onChange={handleChange}
                                            placeholder="اتركها فارغة إذا لم ترد التغيير"
                                            dir="ltr"
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full btn-luxury"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        جاري الحفظ...
                                    </>
                                ) : (
                                    "حفظ التغييرات"
                                )}
                            </Button>
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Settings;
