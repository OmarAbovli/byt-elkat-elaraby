import { useState, useCallback, useEffect } from "react";
import { Loader2, Mail, MailOpen, Trash2, Reply, Clock } from "lucide-react";
import { db } from "@/lib/db";
import { contactMessages } from "@/lib/schema";
import { desc, eq } from "drizzle-orm";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Message {
    id: string;
    name: string;
    email: string;
    subject: string | null;
    message: string;
    status: string | null;
    createdAt: Date | null;
}

const Messages = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
    const { toast } = useToast();

    const fetchMessages = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await db
                .select()
                .from(contactMessages)
                .orderBy(desc(contactMessages.createdAt));
            setMessages(data as Message[]);
        } catch (error) {
            console.error(error);
            toast({
                title: "خطأ",
                description: "حدث خطأ أثناء جلب الرسائل",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    const handleMarkAsRead = async (message: Message) => {
        try {
            await db.update(contactMessages)
                .set({ status: 'read' })
                .where(eq(contactMessages.id, message.id));

            toast({ title: "تم التحديث", className: "bg-emerald-500 text-white" });
            fetchMessages();
        } catch (error) {
            console.error(error);
            toast({ title: "خطأ", description: "فشل تحديث الحالة", variant: "destructive" });
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await db.delete(contactMessages).where(eq(contactMessages.id, id));
            toast({ title: "تم حذف الرسالة", className: "bg-emerald-500 text-white" });
            fetchMessages();
            setSelectedMessage(null);
        } catch (error) {
            console.error(error);
            toast({ title: "خطأ", description: "فشل حذف الرسالة", variant: "destructive" });
        }
    };

    const openMessage = (message: Message) => {
        setSelectedMessage(message);
        if (message.status === 'unread') {
            handleMarkAsRead(message);
        }
    };

    const getStatusBadge = (status: string | null) => {
        switch (status) {
            case 'unread':
                return <span className="bg-gold/20 text-gold text-xs px-2 py-1 rounded-full font-cairo">جديدة</span>;
            case 'read':
                return <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full font-cairo">مقروءة</span>;
            case 'replied':
                return <span className="bg-emerald-500/20 text-emerald-500 text-xs px-2 py-1 rounded-full font-cairo">تم الرد</span>;
            default:
                return null;
        }
    };

    const unreadCount = messages.filter(m => m.status === 'unread').length;

    return (
        <div className="p-8 space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-amiri font-bold text-gold-gradient mb-2">الرسائل</h1>
                    <p className="text-muted-foreground font-cairo">
                        رسائل التواصل الواردة من الزوار
                        {unreadCount > 0 && (
                            <span className="mr-2 bg-gold text-background text-xs px-2 py-1 rounded-full">
                                {unreadCount} جديدة
                            </span>
                        )}
                    </p>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-gold" />
                </div>
            ) : messages.length === 0 ? (
                <div className="text-center p-12 text-muted-foreground border border-dashed border-border rounded-lg">
                    <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="font-cairo">لا توجد رسائل حتى الآن</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            onClick={() => openMessage(msg)}
                            className={`card-luxury p-6 cursor-pointer hover:border-gold/50 transition-all ${msg.status === 'unread' ? 'border-gold/30 bg-gold/5' : ''
                                }`}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-full ${msg.status === 'unread' ? 'bg-gold/20' : 'bg-muted'}`}>
                                        {msg.status === 'unread' ? (
                                            <Mail className="w-5 h-5 text-gold" />
                                        ) : (
                                            <MailOpen className="w-5 h-5 text-muted-foreground" />
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-lg">{msg.name}</h3>
                                            {getStatusBadge(msg.status)}
                                        </div>
                                        <p className="text-sm text-muted-foreground">{msg.email}</p>
                                        {msg.subject && (
                                            <p className="text-sm text-gold font-cairo">{msg.subject}</p>
                                        )}
                                        <p className="text-sm text-muted-foreground line-clamp-2 font-cairo">
                                            {msg.message}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Clock className="w-3 h-3" />
                                    {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString('ar-EG') : '-'}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Message Detail Dialog */}
            <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="font-amiri text-xl">تفاصيل الرسالة</DialogTitle>
                    </DialogHeader>
                    {selectedMessage && (
                        <div className="space-y-6 pt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-muted-foreground font-cairo">الاسم</label>
                                    <p className="font-bold">{selectedMessage.name}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-muted-foreground font-cairo">البريد الإلكتروني</label>
                                    <p className="font-mono text-sm">{selectedMessage.email}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-muted-foreground font-cairo">الموضوع</label>
                                    <p className="font-cairo">{selectedMessage.subject || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-muted-foreground font-cairo">التاريخ</label>
                                    <p className="font-mono text-sm">
                                        {selectedMessage.createdAt
                                            ? new Date(selectedMessage.createdAt).toLocaleString('ar-EG')
                                            : '-'
                                        }
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs text-muted-foreground font-cairo">الرسالة</label>
                                <div className="mt-2 p-4 bg-muted/30 rounded-lg border border-border">
                                    <p className="whitespace-pre-wrap font-cairo leading-relaxed">
                                        {selectedMessage.message}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-2 pt-4 border-t border-border">
                                <Button
                                    variant="outline"
                                    className="gap-2 font-cairo"
                                    onClick={() => window.open(`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || 'رسالتك إلى بيت الخط العربي'}`)}
                                >
                                    <Reply className="w-4 h-4" />
                                    رد عبر البريد
                                </Button>

                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" className="gap-2 font-cairo">
                                            <Trash2 className="w-4 h-4" />
                                            حذف
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle className="font-amiri">هل أنت متأكد؟</AlertDialogTitle>
                                            <AlertDialogDescription className="font-cairo">
                                                سيتم حذف هذه الرسالة نهائياً ولا يمكن استرجاعها.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel className="font-cairo">إلغاء</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() => handleDelete(selectedMessage.id)}
                                                className="bg-destructive hover:bg-destructive/90 font-cairo"
                                            >
                                                حذف
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Messages;
