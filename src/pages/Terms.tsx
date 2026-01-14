import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const Terms = () => {
    return (
        <div className="min-h-screen bg-background" dir="rtl">
            <Navbar />
            <main className="pt-32 pb-20">
                <div className="container mx-auto px-6 max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="prose prose-invert max-w-none"
                    >
                        <h1 className="text-4xl font-amiri font-bold text-gold-gradient mb-8">شروط الاستخدام</h1>

                        <section className="mb-8 font-cairo">
                            <h2 className="text-2xl text-gold mb-4">1. الموافقة على الشروط</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                بدخولك واستخدامك لمنصة "بيت الخط العربي"، فإنك توافق على الالتزام بشروط الاستخدام الموضحة هنا. إذا كنت لا توافق على هذه الشروط، يرجى عدم استهلاك الخدمات المقدمة.
                            </p>
                        </section>

                        <section className="mb-8 font-cairo">
                            <h2 className="text-2xl text-gold mb-4">2. حقوق الملكية الفكرية</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                جميع المحتويات المتوفرة على المنصة من فيديوهات، نصوص، صور، وخطوط هي ملكية خاصة وحصرية لـ "بيت الخط العربي" ومحمية بموجب قوانين حقوق الطبع والنشر. لا يجوز نسخ أو إعادة توزيع أي جزء من المحتوى دون إذن كتابي مسبق.
                            </p>
                        </section>

                        <section className="mb-8 font-cairo">
                            <h2 className="text-2xl text-gold mb-4">3. حساب المستخدم</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                أنت مسؤول عن الحفاظ على سرية معلومات حسابك وكلمة المرور. يحظر مشاركة الحساب مع أشخاص آخرين. يحق للمنصة إيقاف أي حساب يتبين إساءة استخدامه.
                            </p>
                        </section>

                        <section className="mb-8 font-cairo">
                            <h2 className="text-2xl text-gold mb-4">4. المدفوعات والاسترجاع</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                جميع الرسوم المدفوعة مقابل الدورات أو المنتجات غير قابلة للاسترداد بعد الوصول إلى المحتوى التعليمي، إلا في حالات خاصة تحددها الإدارة.
                            </p>
                        </section>

                        <section className="mb-8 font-cairo">
                            <h2 className="text-2xl text-gold mb-4">5. السلوك العام</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                يلتزم المستخدم بحسن السلوك في التفاعل مع المدربين والطلاب الآخرين في مساحات التواصل المتاحة. يحظر نشر أي محتوى مسيء أو غير قانوني.
                            </p>
                        </section>

                        <p className="text-sm text-muted-foreground mt-12 text-center">
                            آخر تحديث: يناير 2026
                        </p>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Terms;
