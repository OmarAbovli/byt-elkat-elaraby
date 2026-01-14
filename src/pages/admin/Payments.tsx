import { useState, useCallback, useEffect } from "react";
import { Loader2, Search, DollarSign, Calendar, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/db";
import { payments, profiles } from "@/lib/schema";
import { desc, eq } from "drizzle-orm";
import { useToast } from "@/hooks/use-toast";

interface PaymentWithUser {
    id: string;
    amount: string;
    currency: string | null;
    status: string | null;
    paymentType: string | null;
    createdAt: Date | null;
    userFullName: string | null;
    username: string | null;
}

const Payments = () => {
    const [paymentsList, setPaymentsList] = useState<PaymentWithUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const { toast } = useToast();

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await db
                .select({
                    id: payments.id,
                    amount: payments.amount,
                    currency: payments.currency,
                    status: payments.status,
                    paymentType: payments.paymentType,
                    createdAt: payments.createdAt,
                    userFullName: profiles.fullName,
                    username: profiles.username,
                })
                .from(payments)
                .leftJoin(profiles, eq(payments.userId, profiles.id))
                .orderBy(desc(payments.createdAt));

            setPaymentsList(data as PaymentWithUser[]);
        } catch (error: unknown) {
            toast({
                title: "خطأ",
                description: error instanceof Error ? error.message : "حدث خطأ أثناء جلب البيانات",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div className="p-8 space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-amiri font-bold text-gold-gradient mb-2">المدفوعات</h1>
                    <p className="text-muted-foreground font-cairo">سجل العمليات المالية</p>
                </div>
            </div>

            <div className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/50 border-b border-border">
                            <tr>
                                <th className="text-right p-4 font-cairo text-sm font-semibold">المستخدم</th>
                                <th className="text-right p-4 font-cairo text-sm font-semibold">المبلغ</th>
                                <th className="text-right p-4 font-cairo text-sm font-semibold">الحالة</th>
                                <th className="text-right p-4 font-cairo text-sm font-semibold">الطريقة</th>
                                <th className="text-right p-4 font-cairo text-sm font-semibold">التاريخ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center">
                                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-gold" />
                                    </td>
                                </tr>
                            ) : paymentsList.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                        لا توجد عمليات دفع مسجلة
                                    </td>
                                </tr>
                            ) : (
                                paymentsList.map((payment) => (
                                    <tr key={payment.id} className="hover:bg-muted/20 transition-colors">
                                        <td className="p-4">
                                            <div className="font-bold">{payment.userFullName || "مستخدم محذوف"}</div>
                                            <div className="text-xs text-muted-foreground">@{payment.username}</div>
                                        </td>
                                        <td className="p-4 font-mono font-bold text-gold">
                                            {payment.amount} <span className="text-muted-foreground text-xs">{payment.currency}</span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-cairo ${payment.status === 'succeeded' || payment.status === 'completed' ? 'bg-emerald/10 text-emerald-light' :
                                                payment.status === 'pending' ? 'bg-amber-500/10 text-amber-500' :
                                                    'bg-destructive/10 text-destructive'
                                                }`}>
                                                {payment.status === 'completed' ? 'مكتمل' :
                                                    payment.status === 'pending' ? 'قيد الانتظار' : payment.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm flex items-center gap-2 font-cairo">
                                            <CreditCard className="w-4 h-4 text-muted-foreground" />
                                            {payment.paymentType === 'credit_card' ? 'بطاقة ائتمان' : payment.paymentType}
                                        </td>
                                        <td className="p-4 text-sm text-muted-foreground font-mono">
                                            {new Date(payment.createdAt || "").toLocaleDateString('ar-EG')}
                                        </td>
                                        <td className="p-4">
                                            {payment.status === 'pending' && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="btn-gold h-8 py-0 px-3 text-xs"
                                                    onClick={async () => {
                                                        if (confirm("هل تريد تأكيد استلام هذا المبلغ؟")) {
                                                            try {
                                                                await db.update(payments)
                                                                    .set({ status: 'completed' })
                                                                    .where(eq(payments.id, payment.id));
                                                                toast({ title: "تم تأكيد الدفع بنجاح" });
                                                                fetchData();
                                                            } catch (error) {
                                                                toast({ title: "حدث خطأ أثناء التحديث", variant: "destructive" });
                                                            }
                                                        }
                                                    }}
                                                >
                                                    تأكيد
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Payments;
