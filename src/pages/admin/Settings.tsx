import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { db } from "@/lib/db";
import { settings } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface SettingsData {
    siteName: string;
    supportEmail: string;
    maintenanceMode: boolean;
    enableStripe: boolean;
    enablePaypal: boolean;
    enableManualPayment: boolean;
    manualPaymentInstructions: string;
    enableVodafoneCash: boolean;
    vodafoneCashNumber: string;
    stripePublicKey: string;
    stripeSecretKey: string;
    stripeWebhookSecret: string;
    paypalClientId: string;
    paypalSecret: string;
    paypalMode: string;
}

const Settings = () => {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState<SettingsData>({
        siteName: "بيت الخط العربي",
        supportEmail: "support@bytek.com",
        maintenanceMode: false,
        enableStripe: true,
        enablePaypal: false,
        enableManualPayment: false,
        manualPaymentInstructions: "",
        enableVodafoneCash: false,
        vodafoneCashNumber: "",
        stripePublicKey: "",
        stripeSecretKey: "",
        stripeWebhookSecret: "",
        paypalClientId: "",
        paypalSecret: "",
        paypalMode: "sandbox",
    });
    const [settingsId, setSettingsId] = useState<number | null>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const result = await db.select().from(settings).limit(1);
                if (result.length > 0) {
                    const data = result[0];
                    setFormData({
                        siteName: data.siteName || "",
                        supportEmail: data.supportEmail || "",
                        maintenanceMode: data.maintenanceMode || false,
                        enableStripe: data.enableStripe || false,
                        enablePaypal: data.enablePaypal || false,
                        enableManualPayment: data.enableManualPayment || false,
                        manualPaymentInstructions: data.manualPaymentInstructions || "",
                        enableVodafoneCash: data.enableVodafoneCash || false,
                        vodafoneCashNumber: data.vodafoneCashNumber || "",
                        stripePublicKey: data.stripePublicKey || "",
                        stripeSecretKey: data.stripeSecretKey || "",
                        stripeWebhookSecret: data.stripeWebhookSecret || "",
                        paypalClientId: data.paypalClientId || "",
                        paypalSecret: data.paypalSecret || "",
                        paypalMode: data.paypalMode || "sandbox",
                    });
                    setSettingsId(data.id);
                }
            } catch (error) {
                console.error("Failed to load settings:", error);
                toast({ title: "فشل تحميل الإعدادات", variant: "destructive" });
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, [toast]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            if (settingsId) {
                await db.update(settings).set(formData).where(eq(settings.id, settingsId));
            } else {
                await db.insert(settings).values(formData);
            }
            toast({ title: "تم حفظ الإعدادات بنجاح" });
        } catch (error) {
            console.error("Failed to save settings:", error);
            toast({ title: "حدث خطأ أثناء الحفظ", variant: "destructive" });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-gold" />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 space-y-8"
            dir="rtl"
        >
            <div>
                <h1 className="text-3xl font-amiri font-bold text-gold-gradient mb-2">الإعدادات</h1>
                <p className="text-muted-foreground font-cairo">تخصيص إعدادات المنصة وطرق الدفع</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="card-luxury p-6 space-y-6 h-fit">
                    <h2 className="text-xl font-bold border-b border-border pb-4 font-amiri">إعدادات عامة</h2>
                    <div className="space-y-4 font-cairo">
                        <div className="space-y-2">
                            <Label>اسم المنصة</Label>
                            <Input
                                value={formData.siteName}
                                onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>البريد الإلكتروني للدعم</Label>
                            <Input
                                value={formData.supportEmail}
                                onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="maintenance">وضع الصيانة</Label>
                            <Switch
                                id="maintenance"
                                checked={formData.maintenanceMode}
                                onCheckedChange={(checked) => setFormData({ ...formData, maintenanceMode: checked })}
                            />
                        </div>
                    </div>
                </div>

                <div className="card-luxury p-6 space-y-6 h-fit">
                    <h2 className="text-xl font-bold border-b border-border pb-4 font-amiri">إعدادات الدفع</h2>
                    <div className="space-y-6 font-cairo">
                        {/* Stripe */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="stripe">تفعيل Stripe</Label>
                                <Switch
                                    id="stripe"
                                    checked={formData.enableStripe}
                                    onCheckedChange={(checked) => setFormData({ ...formData, enableStripe: checked })}
                                />
                            </div>
                            {formData.enableStripe && (
                                <div className="space-y-3 p-4 bg-muted/30 rounded-lg border border-border/50 animate-in slide-in-from-top-1">
                                    <p className="text-[10px] text-muted-foreground mb-2">لاستخدام Stripe، ستحتاج إلى مفاتيح الـ API من لوحة تحكم Stripe (Developers -&gt; API keys).</p>
                                    <div className="space-y-1">
                                        <Label className="text-xs">Stripe Publishable Key</Label>
                                        <Input
                                            placeholder="pk_test_..."
                                            value={formData.stripePublicKey}
                                            onChange={(e) => setFormData({ ...formData, stripePublicKey: e.target.value })}
                                            className="h-8 text-xs"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs">Stripe Secret Key</Label>
                                        <Input
                                            type="password"
                                            placeholder="sk_test_..."
                                            value={formData.stripeSecretKey}
                                            onChange={(e) => setFormData({ ...formData, stripeSecretKey: e.target.value })}
                                            className="h-8 text-xs"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs">Stripe Webhook Secret</Label>
                                        <Input
                                            placeholder="whsec_..."
                                            value={formData.stripeWebhookSecret}
                                            onChange={(e) => setFormData({ ...formData, stripeWebhookSecret: e.target.value })}
                                            className="h-8 text-xs"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* PayPal */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="paypal">تفعيل PayPal</Label>
                                <Switch
                                    id="paypal"
                                    checked={formData.enablePaypal}
                                    onCheckedChange={(checked) => setFormData({ ...formData, enablePaypal: checked })}
                                />
                            </div>
                            {formData.enablePaypal && (
                                <div className="space-y-3 p-4 bg-muted/30 rounded-lg border border-border/50 animate-in slide-in-from-top-1">
                                    <p className="text-[10px] text-muted-foreground mb-2">لاستخدام PayPal، ستحتاج لإنشاء تطبيق في (PayPal Developer Dashboard).</p>
                                    <div className="flex items-center gap-4 mb-2">
                                        <Label className="text-xs">وضع العمل:</Label>
                                        <select
                                            className="bg-background border border-border rounded px-2 py-1 text-xs outline-none"
                                            value={formData.paypalMode}
                                            onChange={(e) => setFormData({ ...formData, paypalMode: e.target.value })}
                                        >
                                            <option value="sandbox">Sandbox (للتجربة)</option>
                                            <option value="live">Live (للعمل الحقيقي)</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs">PayPal Client ID</Label>
                                        <Input
                                            placeholder="Client ID"
                                            value={formData.paypalClientId}
                                            onChange={(e) => setFormData({ ...formData, paypalClientId: e.target.value })}
                                            className="h-8 text-xs"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs">PayPal Secret</Label>
                                        <Input
                                            type="password"
                                            placeholder="Secret"
                                            value={formData.paypalSecret}
                                            onChange={(e) => setFormData({ ...formData, paypalSecret: e.target.value })}
                                            className="h-8 text-xs"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <Separator />

                        {/* Vodafone Cash */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="vodafone">تفعيل فودافون كاش</Label>
                                <Switch
                                    id="vodafone"
                                    checked={formData.enableVodafoneCash}
                                    onCheckedChange={(checked) => setFormData({ ...formData, enableVodafoneCash: checked })}
                                />
                            </div>
                            {formData.enableVodafoneCash && (
                                <div className="space-y-2">
                                    <Label className="text-xs">رقم فودافون كاش</Label>
                                    <Input
                                        placeholder="010XXXXXXXX"
                                        value={formData.vodafoneCashNumber}
                                        onChange={(e) => setFormData({ ...formData, vodafoneCashNumber: e.target.value })}
                                        className="h-8 text-xs"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Manual Payment */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="manual">تفعيل الدفع اليدوي / تحويل بنكي</Label>
                                <Switch
                                    id="manual"
                                    checked={formData.enableManualPayment}
                                    onCheckedChange={(checked) => setFormData({ ...formData, enableManualPayment: checked })}
                                />
                            </div>
                            {formData.enableManualPayment && (
                                <div className="space-y-2">
                                    <Label className="text-xs">تعليمات الدفع اليدوي</Label>
                                    <textarea
                                        className="w-full min-h-[80px] p-2 rounded-md bg-background border border-border text-xs outline-none"
                                        placeholder="أدخل تعليمات التحويل البنكي هنا..."
                                        value={formData.manualPaymentInstructions}
                                        onChange={(e) => setFormData({ ...formData, manualPaymentInstructions: e.target.value })}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <Button onClick={handleSave} className="btn-gold w-32 font-cairo" disabled={isSaving}>
                    {isSaving ? "جاري الحفظ..." : "حفظ التغييرات"}
                </Button>
            </div>
        </motion.div>
    );
};

export default Settings;
