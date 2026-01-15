import { motion } from "framer-motion";
import {
    TreeDeciduous,
    CheckCircle2,
    ArrowLeft,
    Printer,
    Maximize2,
    FileText,
    Palette,
    MessageCircle,
    Phone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const familyTreeWorks = [
    {
        title: "نموذج لشجرة عائلة 3100 اسم تقريبًا",
        description: "تم تنفيذ العمل بشكل احترافي حيث أن الرجال يرمز لهم باللون الأخضر الغامق ولون النساء باللون الأخضر الفاتح.",
        stats: "85 سم * 115 سم - جودة عالية",
        image: "/family-trees/tree-3100.jpg"
    },
    {
        title: "نموذج لشجرة عائلة 1400 اسم تقريبًا",
        description: "الآباء يرمز لها بدائرة باللون البيج ولون الأبناء من الرجال يرمز له باللون الأخضر الغامق ولون النساء باللون الأخضر الفاتح والمتوفين باللون الأصفر.",
        stats: "100 سم * 70 سم - جودة عالية",
        image: "/family-trees/tree-1400.jpg"
    },
    {
        title: "نموذج لشجرة عائلة 1600 اسم تقريبًا",
        description: "تم تنفيذ العمل بشكل احترافي حيث أن الآباء يرمز لها بدائرة باللون البيج ولون الأبناء يرمز له بورقة خضراء.",
        stats: "100 سم * 70 سم - جودة عالية",
        image: "/family-trees/tree-1600.jpg"
    },
    {
        title: "نموذج لشجرة عائلة 400 اسم تقريبًا",
        description: "الأحفاد يرمز لهم باللون الأخضر والآباء دائرة لونها بيج والمتوفين ورقة أخضر داكن يميل للأسود.",
        stats: "70 سم * 100 سم - جودة عالية",
        image: "/family-trees/tree-400.jpg"
    },
    {
        title: "نموذج لشجرة عائلة 200 اسم تقريبًا",
        description: "تم تنفيذ العمل بشكل احترافي حيث أن الرجال يرمز لهم باللون الأخضر الغامق والآباء دائرة لونها بيج والأجداد شكل زخرفي.",
        stats: "70 سم * 100 سم - جودة عالية",
        image: "/family-trees/tree-200.jpg"
    },
    {
        title: "نموذج لشجرة عائلة 160 اسم تقريبًا",
        description: "الرجال يرمز لهم باللون الأخضر الغامق والآباء دائرة لونها بيج والأجداد والآباء الأصول أشكال زخرفية مختلفة.",
        stats: "70 سم * 100 سم - جودة عالية",
        image: "/family-trees/tree-160.jpg"
    },
    {
        title: "نموذج لشجرة عائلة 1200 اسم",
        description: "تصميم مشجرة عائلة كبيرة مع توزيع متناسق للأوراق والأغصان المعبرة عن الأجيال المتعاقبة.",
        stats: "85 سم * 115 سم - جودة عالية",
        image: "/family-trees/tree-1200.jpg"
    },
    {
        title: "نموذج لشجرة عائلة 600 اسم",
        description: "تصميم فني يبرز التداخل الجميل للأجيال مع الحفاظ على وضوح الأسماء وسهولة القراءة.",
        stats: "70 سم * 100 سم - جودة عالية",
        image: "/family-trees/tree-600.jpg"
    }
];

const FamilyTreePage = () => {
    const keywords = "بيت الخط العربي, تصميم شجرة العائلة, تعلم فن الخطاطة, تعلم الخط العربي, تصميم شجرة العائلة بشكل احترافي, خدمة تصميم شجرة العائلة, محمد بيومي, استاذ محمد بيومي, mohamed bayomy, mohammed bayomy, مشجرات, أنساب, توثيق العائلة";

    const serviceSchema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "تصميم وشجرة العائلة",
        "provider": {
            "@type": "Organization",
            "name": "بيت الخط العربي",
            "url": "https://baytalkhattal-arabi.com"
        },
        "description": "خدمة احترافية لتصميم وتوثيق شجرة العائلة بأي حجم، مع ترميز لوني دقيق وجودة طباعة عالية.",
        "areaServed": "Global",
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "خدمات التصميم",
            "itemListElement": [
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "تصميم شجرة عائلة صغيرة (200-400 اسم)"
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "تصميم شجرة عائلة متوسطة (600-1400 اسم)"
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "تصميم شجرة عائلة كبيرة (1600-3100+ اسم)"
                    }
                }
            ]
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <SEO
                title="خدمة تصميم شجرة العائلة الاحترافية"
                description="نوثق تاريخ عائلتكم في لوحة فنية تجمع بين أصالة الخط العربي ودقة التصميم. صمم شجرة عائلتك الآن مع الأستاذ محمد بيومي في بيت الخط العربي."
                keywords={keywords}
                image="/family-trees/tree-3100.jpg"
                url="https://baytalkhattal-arabi.com/family-tree"
                type="product"
                schema={serviceSchema}
            />
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-gold/5 blur-3xl rounded-full translate-y-[-50%] translate-x-[-50%]" />
                <div className="container mx-auto px-6 relative">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold/30 bg-gold/5 mb-8"
                        >
                            <TreeDeciduous className="w-5 h-5 text-gold" />
                            <span className="text-gold text-sm font-cairo">خدمة تصميم وتأصيل الأنساب</span>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-6xl font-amiri font-bold mb-6"
                        >
                            تصميم <span className="text-gold-gradient">شجرة العائلة</span> باحترافية
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-lg text-muted-foreground font-cairo mb-10 leading-relaxed max-w-2xl mx-auto"
                        >
                            نوثق تاريخ عائلتكم في لوحة فنية تجمع بين أصالة الخط العربي ودقة التصميم الحديث،
                            بجودة عالية جاهزة للطباعة والنشر بأي حجم.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-wrap items-center justify-center gap-4"
                        >
                            <Button className="btn-gold px-8 py-6 text-lg font-cairo" onClick={() => window.open('https://wa.me/201097047780', '_blank')}>
                                اطلب تصميمك الآن
                            </Button>
                            <a href="#samples">
                                <Button variant="outline" className="px-8 py-6 text-lg font-cairo border-gold/30 hover:bg-gold/5">
                                    مشاهدة النماذج
                                </Button>
                            </a>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-secondary/5">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: Maximize2, title: "قياسات مرنة", desc: "تصاميم تبدأ من 70*100 سم وتصلح للتكبير لأي حجم دون فقدان الجودة." },
                            { icon: Palette, title: "ترميز لوني دقيق", desc: "نستخدم الألوان لتمييز الآباء، الأحفاد، والمتوفين بوضوح تام." },
                            { icon: Printer, title: "جاهز للطباعة", desc: "ملفات عالية الجودة بدقة 300 DPI لضمان أفضل نتيجة عند الورق والقماش." }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="card-luxury p-8 text-center group"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-gold/20 transition-colors">
                                    <feature.icon className="w-8 h-8 text-gold" />
                                </div>
                                <h3 className="text-xl font-bold font-cairo mb-4">{feature.title}</h3>
                                <p className="text-muted-foreground font-cairo text-sm leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Samples Section */}
            <section className="py-24" id="samples">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-amiri font-bold mb-4">نماذج من <span className="text-gold-gradient">أعمالنا</span></h2>
                        <p className="text-muted-foreground font-cairo">فحص لبعض المشروعات التي تم تنفيذها لمختلف أحجام العائلات</p>
                    </div>

                    <div className="space-y-20">
                        {familyTreeWorks.map((work, i) => (work.image && (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className={`flex flex-col ${i % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 items-center`}
                            >
                                <div className="flex-1 w-full">
                                    <div className="relative group overflow-hidden rounded-3xl shadow-2xl border border-border/50">
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                                            <span className="text-white font-cairo border border-white/40 px-6 py-2 rounded-full backdrop-blur-md">تم إخفاء الأسماء للخصوصية</span>
                                        </div>
                                        <img
                                            src={work.image}
                                            alt={work.title}
                                            loading="lazy"
                                            decoding="async"
                                            onError={(e) => {
                                                console.error(`Failed to load image: ${work.image}`);
                                                e.currentTarget.src = '/logo.webp';
                                            }}
                                            className="w-full aspect-[3/4] object-cover object-top transition-transform duration-700 group-hover:scale-110"
                                        />
                                    </div>
                                </div>
                                <div className="flex-1 space-y-6">
                                    <h3 className="text-2xl font-bold font-amiri text-gold-gradient">{work.title}</h3>
                                    <p className="text-lg text-muted-foreground font-cairo leading-relaxed">{work.description}</p>
                                    <div className="flex items-center gap-3 text-gold">
                                        <CheckCircle2 className="w-5 h-5" />
                                        <span className="font-cairo font-medium">{work.stats}</span>
                                    </div>
                                    <Button className="btn-gold gap-2 font-cairo px-8" onClick={() => window.open('https://wa.me/201097047780', '_blank')}>
                                        استفسر عن هذا النموذج <MessageCircle className="w-4 h-4" />
                                    </Button>
                                </div>
                            </motion.div>
                        )))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-obsidian-light relative overflow-hidden">
                <div className="absolute inset-0 geometric-pattern opacity-10" />
                <div className="container mx-auto px-6 relative text-center">
                    <div className="max-w-2xl mx-auto card-luxury p-12 bg-background/40 backdrop-blur-xl border-gold/20">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl font-amiri font-bold mb-6">جاهز لتوثيق تاريخ عائلتك؟</h2>
                            <p className="text-muted-foreground font-cairo mb-10 leading-relaxed">
                                تواصل معنا الآن عبر الواتساب للحصول على استشارة مجانية حول حجم الشجرة المناسب وتقدير التكلفة.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button className="btn-emerald gap-2 py-6 text-lg font-cairo" onClick={() => window.open('https://wa.me/201097047780', '_blank')}>
                                    <MessageCircle className="w-5 h-5" /> تواصل عبر الواتساب
                                </Button>
                                <Button variant="outline" className="gap-2 py-6 text-lg font-cairo border-gold/30 h-auto" onClick={() => window.location.href = 'tel:00201097047780'}>
                                    <Phone className="w-5 h-5" /> 00201097047780
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default FamilyTreePage;
