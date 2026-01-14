import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const PrivacyPolicy = () => {
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
                        <h1 className="text-4xl font-amiri font-bold text-gold-gradient mb-8">سياسة الخصوصية</h1>

                        <section className="mb-8 font-cairo">
                            <h2 className="text-2xl text-gold mb-4">1. مقدمة</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                نحن في "بيت الخط العربي" نلتزم بحماية خصوصيتك وبياناتك الشخصية. توضح هذه السياسة كيفية جمع واستخدام وحماية معلوماتك عند استخدام منصتنا.
                            </p>
                        </section>

                        <section className="mb-8 font-cairo">
                            <h2 className="text-2xl text-gold mb-4">2. البيانات التي نجمعها</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                نجمع المعلومات التي تقدمها لنا مباشرة، مثل الاسم، البريد الإلكتروني، ورقم الهاتف عند التسجيل أو شراء دورة تدريبية.
                            </p>
                        </section>

                        <section className="mb-8 font-cairo">
                            <h2 className="text-2xl text-gold mb-4">3. كيف نستخدم بياناتك</h2>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2">
                                <li>تقديم وتحسين خدماتنا التعليمية.</li>
                                <li>معالجة عمليات الدفع والاشتراكات.</li>
                                <li>التواصل معك بخصوص الدورات والتحديثات.</li>
                                <li>تخصيص تجربتك على المنصة.</li>
                            </ul>
                        </section>

                        <section className="mb-8 font-cairo">
                            <h2 className="text-2xl text-gold mb-4">4. حماية البيانات</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                نستخدم تقنيات تشفير ومعايير أمنية عالية لحماية بياناتك من الوصول غير المصرح به. نحن لا نبيع بياناتك الشخصية لأي طرف ثالث.
                            </p>
                        </section>

                        <section className="mb-8 font-cairo">
                            <h2 className="text-2xl text-gold mb-4">5. ملفات تعريف الارتباط (Cookies)</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                نستخدم ملفات تعريف الارتباط لتحسين تجربة التصفح وتحليل حركة المرور على الموقع. يمكنك التحكم في إعدادات ملفات تعريف الارتباط من خلال متصفحك.
                            </p>
                        </section>

                        <section className="mb-8 font-cairo">
                            <h2 className="text-2xl text-gold mb-4">6. التحديثات</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. سيتم نشر أي تغييرات هنا مع تحديث تاريخ التعديل.
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

export default PrivacyPolicy;
