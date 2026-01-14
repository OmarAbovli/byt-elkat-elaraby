import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Users,
  CreditCard,
  TrendingUp,
  Package,
  Award,
} from "lucide-react";
import { sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  courses,
  profiles,
  payments,
  enrollments,
  packages,
  certificates
} from "@/lib/schema";

interface Stats {
  totalCourses: number;
  totalUsers: number;
  totalPayments: number;
  totalEnrollments: number;
  totalPackages: number;
  totalCertificates: number;
}

import { Link } from "react-router-dom";

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalCourses: 0,
    totalUsers: 0,
    totalPayments: 0,
    totalEnrollments: 0,
    totalPackages: 0,
    totalCertificates: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [
        coursesCount,
        profilesCount,
        paymentsCount,
        enrollmentsCount,
        packagesCount,
        certificatesCount,
      ] = await Promise.all([
        db.select({ count: sql<number>`count(*)` }).from(courses),
        db.select({ count: sql<number>`count(*)` }).from(profiles),
        db.select({ count: sql<number>`count(*)` }).from(payments),
        db.select({ count: sql<number>`count(*)` }).from(enrollments),
        db.select({ count: sql<number>`count(*)` }).from(packages),
        db.select({ count: sql<number>`count(*)` }).from(certificates),
      ]);

      setStats({
        totalCourses: Number(coursesCount[0]?.count) || 0,
        totalUsers: Number(profilesCount[0]?.count) || 0,
        totalPayments: Number(paymentsCount[0]?.count) || 0,
        totalEnrollments: Number(enrollmentsCount[0]?.count) || 0,
        totalPackages: Number(packagesCount[0]?.count) || 0,
        totalCertificates: Number(certificatesCount[0]?.count) || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      icon: BookOpen,
      label: "الدورات",
      value: stats.totalCourses,
      color: "text-emerald-light",
      bgColor: "bg-emerald/20",
    },
    {
      icon: Users,
      label: "المستخدمين",
      value: stats.totalUsers,
      color: "text-gold",
      bgColor: "bg-gold/20",
    },
    {
      icon: TrendingUp,
      label: "التسجيلات",
      value: stats.totalEnrollments,
      color: "text-blue-400",
      bgColor: "bg-blue-400/20",
    },
    {
      icon: CreditCard,
      label: "المدفوعات",
      value: stats.totalPayments,
      color: "text-green-400",
      bgColor: "bg-green-400/20",
    },
    {
      icon: Package,
      label: "الباقات",
      value: stats.totalPackages,
      color: "text-purple-400",
      bgColor: "bg-purple-400/20",
    },
    {
      icon: Award,
      label: "الشهادات",
      value: stats.totalCertificates,
      color: "text-amber-400",
      bgColor: "bg-amber-400/20",
    },
  ];

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold font-cairo text-foreground">
          لوحة التحكم
        </h1>
        <p className="text-muted-foreground font-cairo mt-1">
          مرحباً بك في لوحة تحكم بيت الخط
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card-luxury p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground font-cairo text-sm">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold font-cairo text-foreground mt-1">
                  {isLoading ? "..." : stat.value}
                </p>
              </div>
              <div className={`w-14 h-14 rounded-2xl ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`w-7 h-7 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card-luxury p-6"
      >
        <h2 className="text-xl font-bold font-cairo text-foreground mb-4">
          إجراءات سريعة
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/admin/courses"
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-muted/50 hover:bg-gold/20 transition-colors group"
          >
            <BookOpen className="w-8 h-8 text-muted-foreground group-hover:text-gold transition-colors" />
            <span className="text-sm font-cairo text-foreground">
              إضافة دورة
            </span>
          </Link>
          <Link
            to="/admin/packages"
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-muted/50 hover:bg-gold/20 transition-colors group"
          >
            <Package className="w-8 h-8 text-muted-foreground group-hover:text-gold transition-colors" />
            <span className="text-sm font-cairo text-foreground">
              إضافة باقة
            </span>
          </Link>
          <Link
            to="/admin/products"
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-muted/50 hover:bg-gold/20 transition-colors group"
          >
            <Package className="w-8 h-8 text-muted-foreground group-hover:text-gold transition-colors" />
            <span className="text-sm font-cairo text-foreground">
              إضافة منتج
            </span>
          </Link>
          <Link
            to="/admin/users"
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-muted/50 hover:bg-gold/20 transition-colors group"
          >
            <Users className="w-8 h-8 text-muted-foreground group-hover:text-gold transition-colors" />
            <span className="text-sm font-cairo text-foreground">
              إدارة المستخدمين
            </span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};


export default Dashboard;
