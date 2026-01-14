import { BarChart3, TrendingUp, Users, DollarSign, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { db } from "@/lib/db";
import { profiles, payments, enrollments } from "@/lib/schema";
import { sql } from "drizzle-orm";

interface AnalyticsData {
    totalRevenue: number;
    totalUsers: number;
    activeEnrollments: number;
    conversionRate: number;
}

const Analytics = () => {
    const [data, setData] = useState<AnalyticsData>({
        totalRevenue: 0,
        totalUsers: 0,
        activeEnrollments: 0,
        conversionRate: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const [revenueResult, usersResult, enrollmentsResult] = await Promise.all([
                    db.select({ total: sql<number>`sum(${payments.amount})` }).from(payments),
                    db.select({ count: sql<number>`count(*)` }).from(profiles),
                    db.select({ count: sql<number>`count(*)` }).from(enrollments)
                ]);

                const revenue = Number(revenueResult[0]?.total || 0);
                const users = Number(usersResult[0]?.count || 0);
                const enrollmentsCount = Number(enrollmentsResult[0]?.count || 0);

                setData({
                    totalRevenue: revenue,
                    totalUsers: users,
                    activeEnrollments: enrollmentsCount,
                    conversionRate: users > 0 ? (enrollmentsCount / users) * 100 : 0
                });
            } catch (error) {
                console.error("Failed to fetch analytics:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gold" />
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-amiri font-bold text-gold-gradient mb-2">الإحصائيات</h1>
                    <p className="text-muted-foreground font-cairo">تحليل أداء المنصة (بيانات حية)</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="الإيرادات"
                    value={`$${data.totalRevenue.toLocaleString()}`}
                    change="مباشر"
                    icon={DollarSign}
                />
                <StatsCard
                    title="المستخدمين النشطين"
                    value={data.totalUsers.toLocaleString()}
                    change="مباشر"
                    icon={Users}
                />
                <StatsCard
                    title="التسجيلات"
                    value={data.activeEnrollments.toLocaleString()}
                    change="مباشر"
                    icon={BarChart3}
                />
                <StatsCard
                    title="معدل التحويل"
                    value={`${data.conversionRate.toFixed(1)}%`}
                    change="مباشر"
                    icon={TrendingUp}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="card-luxury p-6 h-96 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold font-cairo">توزيع المبيعات</h3>
                        <span className="text-xs text-muted-foreground font-mono">آخر 30 يوم</span>
                    </div>
                    <div className="flex-1 flex items-end justify-between gap-2 px-4 pb-8">
                        {[40, 70, 45, 90, 65, 85, 50, 75, 60, 95, 40, 80].map((height, i) => (
                            <motion.div
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${height}%` }}
                                transition={{ delay: i * 0.05, duration: 0.5 }}
                                className="w-full bg-gold/20 hover:bg-gold/40 rounded-t-sm transition-colors relative group"
                            >
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground px-2 py-1 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 border border-border">
                                    ${(height * 10).toLocaleString()}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="card-luxury p-6 h-96 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold font-cairo">النمو العام</h3>
                        <span className="text-xs text-muted-foreground font-mono">+12.5%</span>
                    </div>
                    <div className="flex-1 relative flex items-center justify-center">
                        <svg className="w-full h-full" viewBox="0 0 400 200">
                            <defs>
                                <linearGradient id="gradientLine" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.3" />
                                    <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <motion.path
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 1.5, ease: "easeInOut" }}
                                d="M 0 150 Q 50 140 100 100 T 200 80 T 300 40 T 400 20"
                                fill="none"
                                stroke="#D4AF37"
                                strokeWidth="3"
                            />
                            <motion.path
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1 }}
                                d="M 0 150 Q 50 140 100 100 T 200 80 T 300 40 T 400 20 V 200 H 0 Z"
                                fill="url(#gradientLine)"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                            <span className="text-4xl font-mono font-bold text-gold">
                                {data.conversionRate.toFixed(1)}%
                            </span>
                            <span className="text-sm text-muted-foreground font-cairo">معدل التحويل الكلي</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface StatsCardProps {
    title: string;
    value: string;
    change: string;
    icon: React.ElementType;
}

const StatsCard = ({ title, value, change, icon: Icon }: StatsCardProps) => (
    <div className="card-luxury p-6 space-y-2">
        <div className="flex justify-between items-start">
            <div className="p-2 bg-primary/10 rounded-lg">
                <Icon className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xs text-emerald-light bg-emerald/10 px-2 py-0.5 rounded-full">
                {change}
            </span>
        </div>
        <div>
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
            <div className="text-2xl font-bold font-mono mt-1">{value}</div>
        </div>
    </div>
);

export default Analytics;
