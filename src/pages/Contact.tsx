import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/db";
import { contactMessages } from "@/lib/schema";

const Contact = () => {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await db.insert(contactMessages).values({
                name: formData.name,
                email: formData.email,
                subject: formData.subject,
                message: formData.message
            });

            toast({
                title: "تم إرسال رسالتك بنجاح",
                description: "سنقوم بالرد عليك في أقرب وقت ممكن.",
            });

            setFormData({ name: "", email: "", subject: "", message: "" });
        } catch (error) {
            console.error("Contact error:", error);
            toast({
                title: "عذراً، حدث خطأ",
                description: "فشل إرسال الرسالة، يرجى المحاولة مرة أخرى لاحقاً.",
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background" dir="rtl">
            <Navbar />

            <main className="pt-32 pb-20">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center max-w-2xl mx-auto mb-16"
                    >
                        <h1 className="text-4xl md:text-5xl font-amiri font-bold mb-6 text-gold-gradient">تواصل معنا</h1>
                        <p className="text-muted-foreground font-cairo">
                            نحن هنا لمساعدتكم والإجابة على استفساراتكم. يمكنكم مراسلتنا في أي وقت وسيقوم فريقنا بالرد عليكم.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                        {/* Contact Info */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-8"
                        >
                            <div className="card-luxury p-8 space-y-6">
                                <h2 className="text-2xl font-bold font-amiri text-gold">معلومات الاتصال</h2>

                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                                            <Mail className="w-6 h-6 text-gold" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold font-cairo text-sm">البريد الإلكتروني</h3>
                                            <p className="text-muted-foreground text-sm">abuhafs1979@gmail.com</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                                            <Phone className="w-6 h-6 text-gold" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold font-cairo text-sm">الهاتف</h3>
                                            <p className="text-muted-foreground text-sm font-mono">+20 109 704 7780</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                                            <MapPin className="w-6 h-6 text-gold" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold font-cairo text-sm">المقر</h3>
                                            <p className="text-muted-foreground text-sm">بيت الخط العربي - القاهرة، مصر</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-border">
                                    <h3 className="font-bold font-cairo text-sm mb-4">تابعنا على وسائل التواصل</h3>
                                    <div className="flex gap-4">
                                        <a href="https://api.whatsapp.com/message/GVXG3RDYCH6ZP1" target="_blank" className="p-3 rounded-xl bg-muted/50 hover:bg-gold/20 text-muted-foreground hover:text-gold transition-all">
                                            <MessageCircle className="w-5 h-5" />
                                        </a>
                                        <a href="https://t.me/baitulkhtalarabi" target="_blank" className="p-3 rounded-xl bg-muted/50 hover:bg-gold/20 text-muted-foreground hover:text-gold transition-all">
                                            <Send className="w-5 h-5" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <form onSubmit={handleSubmit} className="card-luxury p-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="font-cairo">الاسم بالكامل</Label>
                                        <Input
                                            required
                                            placeholder="أدخل اسمك"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="bg-background/50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="font-cairo">البريد الإلكتروني</Label>
                                        <Input
                                            required
                                            type="email"
                                            placeholder="example@mail.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="bg-background/50 text-left"
                                            dir="ltr"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="font-cairo">الموضوع</Label>
                                    <Input
                                        placeholder="ما هو موضوع رسالتك؟"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        className="bg-background/50"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="font-cairo">الرسالة</Label>
                                    <Textarea
                                        required
                                        placeholder="اكتب رسالتك هنا..."
                                        rows={5}
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="bg-background/50"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="btn-gold w-full h-12 font-cairo"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                                    ) : (
                                        "إرسال الرسالة"
                                    )}
                                </Button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Contact;
