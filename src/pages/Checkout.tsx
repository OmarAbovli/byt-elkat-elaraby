import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/providers/CartProvider";
import { useAuth } from "@/providers/AuthProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ShoppingBag, CreditCard, Loader2, CheckCircle2, ChevronRight, Wallet, Banknote } from "lucide-react";
import { db } from "@/lib/db";
import { payments, enrollments, settings } from "@/lib/schema";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
    const { items, total, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("stripe");
    const [paymentSettings, setPaymentSettings] = useState<any>(null);
    const [referenceInput, setReferenceInput] = useState("");

    useEffect(() => {
        const fetchSettings = async () => {
            const result = await db.select().from(settings).limit(1);
            if (result.length > 0) {
                setPaymentSettings(result[0]);
                // Default to first enabled method
                if (!result[0].enableStripe) {
                    if (result[0].enablePaypal) setPaymentMethod("paypal");
                    else if (result[0].enableVodafoneCash) setPaymentMethod("vodafone");
                    else if (result[0].enableManualPayment) setPaymentMethod("manual");
                }
            }
        };
        fetchSettings();
    }, []);

    const handlePlaceOrder = async () => {
        if (!user) {
            toast.error("يرجى تسجيل الدخول لإتمام الشراء");
            navigate("/auth");
            return;
        }

        if (items.length === 0) {
            toast.error("السلة فارغة");
            return;
        }

        setIsProcessing(true);
        try {
            const isManual = paymentMethod === "manual" || paymentMethod === "vodafone";

            // 1. Create a payment record
            const paymentResult = await db.insert(payments).values({
                userId: user.id,
                amount: total.toString(),
                currency: "USD",
                status: isManual ? "pending" : "completed",
                paymentType: paymentMethod,
                stripePaymentId: isManual ? referenceInput : null, // Reuse for reference
            }).returning({ id: payments.id });

            const paymentId = paymentResult[0].id;

            // 2. Create enrollments for courses/packages/paths
            for (const item of items) {
                if (item.type === 'course' || item.type === 'package' || item.type === 'path') {
                    await db.insert(enrollments).values({
                        userId: user.id,
                        courseId: item.type === 'course' ? item.id : null,
                        packageId: item.type === 'package' ? item.id : null,
                        pathId: item.type === 'path' ? item.id : null,
                        progressPercent: 0,
                        enrolledAt: new Date(),
                    });
                }
            }

            setIsSuccess(true);
            clearCart();
            toast.success(isManual ? "تم تسجيل طلبك، في انتظار تأكيد الدفع" : "تمت عملية الشراء بنجاح!");
        } catch (error) {
            console.error("Checkout error:", error);
            toast.error("حدث خطأ أثناء إتمام الشراء. يرجى المحاولة مرة أخرى.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Navbar />
                <main className="flex-1 flex items-center justify-center p-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-md w-full text-center space-y-6 card-luxury p-12"
                    >
                        <div className="w-20 h-20 bg-emerald/10 text-emerald-light rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle2 className="w-12 h-12" />
                        </div>
                        <h2 className="text-3xl font-amiri font-bold">
                            {paymentMethod === 'manual' || paymentMethod === 'vodafone' ? 'تم استلام طلبك!' : 'شكراً لثقتكم!'}
                        </h2>
                        <p className="text-muted-foreground font-cairo">
                            {paymentMethod === 'manual' || paymentMethod === 'vodafone'
                                ? "سيتم مراجعة الدفع وتفعيل حسابك خلال 24 ساعة كحد أقصى."
                                : "تمت عملية الشراء بنجاح. يمكنك الآن البدء في تصفح دوراتك من لوحة التحكم."}
                        </p>
                        <Button className="btn-gold w-full" onClick={() => navigate("/dashboard")}>
                            انتقل إلى لوحة التحكم
                        </Button>
                    </motion.div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <main className="flex-1 container mx-auto px-6 py-32">
                <div className="max-w-4xl mx-auto">
                    <header className="mb-12">
                        <h1 className="text-4xl font-amiri font-bold text-gold-gradient mb-2">إتمام الشراء</h1>
                        <p className="text-muted-foreground font-cairo flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4" /> مراجعة الطلب والدفع
                        </p>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Order Summary */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="card-luxury p-6">
                                <h3 className="text-xl font-bold font-cairo mb-6 border-b border-border/50 pb-4">ملخص الطلب</h3>
                                <div className="space-y-4">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex gap-4 items-center">
                                            <div className="w-16 h-16 rounded-lg bg-secondary/20 flex items-center justify-center overflow-hidden shrink-0">
                                                {item.image ? (
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <ShoppingBag className="w-6 h-6 text-muted-foreground/30" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold font-cairo text-foreground line-clamp-1">{item.name}</h4>
                                                <p className="text-xs text-muted-foreground capitalize">
                                                    {item.type === 'course' ? 'دورة تدريبية' :
                                                        item.type === 'package' ? 'باقة تعليمية' : 'منتج'}
                                                </p>
                                            </div>
                                            <span className="font-mono font-bold text-gold">${item.price}</span>
                                        </div>
                                    ))}
                                    {items.length === 0 && (
                                        <p className="text-center py-8 text-muted-foreground font-cairo">السلة فارغة</p>
                                    )}
                                </div>
                            </div>

                            {/* Payment Method Selection */}
                            <div className="card-luxury p-6">
                                <h3 className="text-xl font-bold font-cairo mb-6 border-b border-border/50 pb-4">وسيلة الدفع</h3>
                                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                                    {paymentSettings?.enableStripe && (
                                        <div className="flex items-center space-x-3 space-x-reverse border border-border p-4 rounded-xl cursor-pointer hover:bg-gold/5 transition-colors">
                                            <RadioGroupItem value="stripe" id="stripe" />
                                            <Label htmlFor="stripe" className="flex flex-1 items-center gap-3 cursor-pointer">
                                                <CreditCard className="text-gold" />
                                                <div className="flex flex-col">
                                                    <span className="font-bold font-cairo">بطاقة ائتمان (Stripe)</span>
                                                    <span className="text-xs text-muted-foreground">تفعيل فوري للدورة</span>
                                                </div>
                                            </Label>
                                        </div>
                                    )}

                                    {paymentSettings?.enablePaypal && (
                                        <div className="flex items-center space-x-3 space-x-reverse border border-border p-4 rounded-xl cursor-pointer hover:bg-gold/5 transition-colors">
                                            <RadioGroupItem value="paypal" id="paypal" />
                                            <Label htmlFor="paypal" className="flex flex-1 items-center gap-3 cursor-pointer">
                                                <Wallet className="text-blue-400" />
                                                <div className="flex flex-col">
                                                    <span className="font-bold font-cairo">PayPal</span>
                                                    <span className="text-xs text-muted-foreground">دفع آمن عبر بايبال</span>
                                                </div>
                                            </Label>
                                        </div>
                                    )}

                                    {paymentSettings?.enableVodafoneCash && (
                                        <div className="flex items-center space-x-3 space-x-reverse border border-border p-4 rounded-xl cursor-pointer hover:bg-gold/5 transition-colors">
                                            <RadioGroupItem value="vodafone" id="vodafone" />
                                            <Label htmlFor="vodafone" className="flex flex-1 items-center gap-3 cursor-pointer">
                                                <Wallet className="text-red-500" />
                                                <div className="flex flex-col">
                                                    <span className="font-bold font-cairo">فودافون كاش</span>
                                                    <span className="text-xs text-muted-foreground">تحويل لمحفظة فودافون كاش</span>
                                                </div>
                                            </Label>
                                        </div>
                                    )}

                                    {paymentSettings?.enableManualPayment && (
                                        <div className="flex items-center space-x-3 space-x-reverse border border-border p-4 rounded-xl cursor-pointer hover:bg-gold/5 transition-colors">
                                            <RadioGroupItem value="manual" id="manual" />
                                            <Label htmlFor="manual" className="flex flex-1 items-center gap-3 cursor-pointer">
                                                <Banknote className="text-emerald-light" />
                                                <div className="flex flex-col">
                                                    <span className="font-bold font-cairo">تحويل بنكي / يدوي</span>
                                                    <span className="text-xs text-muted-foreground">تحويل بنكي مباشر</span>
                                                </div>
                                            </Label>
                                        </div>
                                    )}
                                </RadioGroup>

                                <AnimatePresence mode="wait">
                                    {paymentMethod === 'vodafone' && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20"
                                        >
                                            <p className="text-sm font-cairo text-red-500 leading-relaxed mb-4">
                                                يرجى تحويل القيمة الكلية إلى الرقم التالي: <strong>{paymentSettings.vodafoneCashNumber}</strong> ثم أدخل رقم التحويل أو اسم صاحب المحفظة للتأكيد.
                                            </p>
                                            <Input
                                                placeholder="رقم العملية / اسم المحول"
                                                className="bg-background"
                                                value={referenceInput}
                                                onChange={(e) => setReferenceInput(e.target.value)}
                                            />
                                        </motion.div>
                                    )}

                                    {paymentMethod === 'manual' && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="mt-6 p-4 rounded-xl bg-gold/10 border border-gold/20"
                                        >
                                            <p className="text-sm font-cairo text-gold leading-relaxed whitespace-pre-wrap mb-4">
                                                {paymentSettings.manualPaymentInstructions}
                                            </p>
                                            <Input
                                                placeholder="رقم الحوالة أو المرجع"
                                                className="bg-background"
                                                value={referenceInput}
                                                onChange={(e) => setReferenceInput(e.target.value)}
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Payment Sidebar */}
                        <div className="space-y-6">
                            <div className="card-luxury p-6 sticky top-32">
                                <h3 className="text-xl font-bold font-cairo mb-6 border-b border-border/50 pb-4">الإجمالي</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">المجموع الفرعي</span>
                                        <span className="font-mono">${total}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">الضرائب</span>
                                        <span className="font-mono">$0.00</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between items-center text-xl font-bold">
                                        <span>المجموع الكلي</span>
                                        <span className="text-gold font-mono">${total}</span>
                                    </div>

                                    <div className="pt-4">
                                        <Button
                                            className="w-full btn-gold h-12 text-lg font-cairo gap-2"
                                            disabled={isProcessing || items.length === 0 || ((paymentMethod === 'vodafone' || paymentMethod === 'manual') && !referenceInput)}
                                            onClick={handlePlaceOrder}
                                        >
                                            {isProcessing ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <>
                                                    إتمام الطلب <ChevronRight className="w-5 h-5 translate-x-[4px] group-hover:translate-x-0 transition-transform" />
                                                </>
                                            )}
                                        </Button>
                                    </div>

                                    <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest pt-4">
                                        <CreditCard className="w-3 h-3" /> مؤمن بواسطة بيت الخط العربي
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Checkout;
