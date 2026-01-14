import { useState, useCallback, useEffect } from "react";
import { Loader2, Search, User, Shield, Unlock, BookOpen, Package, Route } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/db";
import { profiles, packages, enrollments, courses, paths } from "@/lib/schema";
import { desc, eq, and } from "drizzle-orm";
import { useToast } from "@/hooks/use-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface UserProfile {
    id: string;
    fullName: string | null;
    username: string | null;
    role: string | null;
    skillLevel: string | null;
    phone: string | null;
    createdAt: Date | null;
}

interface SelectableItem {
    id: string;
    name: string;
}

type GrantType = 'course' | 'package' | 'path';

const Users = () => {
    const [usersList, setUsersList] = useState<UserProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const { toast } = useToast();

    // Grant Access State
    const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
    const [isGrantDialogOpen, setIsGrantDialogOpen] = useState(false);
    const [grantType, setGrantType] = useState<GrantType>('course');
    const [availableCourses, setAvailableCourses] = useState<SelectableItem[]>([]);
    const [availablePackages, setAvailablePackages] = useState<SelectableItem[]>([]);
    const [availablePaths, setAvailablePaths] = useState<SelectableItem[]>([]);
    const [selectedItemId, setSelectedItemId] = useState<string>("");
    const [isGranting, setIsGranting] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await db.select().from(profiles).orderBy(desc(profiles.createdAt));
            setUsersList(data as UserProfile[]);

            // Fetch all grantable items
            const [coursesData, packagesData, pathsData] = await Promise.all([
                db.select({ id: courses.id, name: courses.title }).from(courses),
                db.select({ id: packages.id, name: packages.name }).from(packages),
                db.select({ id: paths.id, name: paths.title }).from(paths),
            ]);

            setAvailableCourses(coursesData);
            setAvailablePackages(packagesData);
            setAvailablePaths(pathsData);

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

    const handleGrantAccess = (user: UserProfile) => {
        setSelectedUser(user);
        setSelectedItemId("");
        setGrantType('course');
        setIsGrantDialogOpen(true);
    };

    const getCurrentItems = (): SelectableItem[] => {
        switch (grantType) {
            case 'course': return availableCourses;
            case 'package': return availablePackages;
            case 'path': return availablePaths;
            default: return [];
        }
    };

    const getTypeLabel = (): string => {
        switch (grantType) {
            case 'course': return 'الدورة';
            case 'package': return 'الباقة';
            case 'path': return 'المسار';
            default: return '';
        }
    };

    const submitGrantAccess = async () => {
        if (!selectedUser || !selectedItemId) return;

        try {
            setIsGranting(true);

            // Check if already enrolled
            let existingEnrollment = null;
            if (grantType === 'course') {
                existingEnrollment = await db.select().from(enrollments).where(
                    and(eq(enrollments.userId, selectedUser.id), eq(enrollments.courseId, selectedItemId))
                ).limit(1);
            } else if (grantType === 'package') {
                existingEnrollment = await db.select().from(enrollments).where(
                    and(eq(enrollments.userId, selectedUser.id), eq(enrollments.packageId, selectedItemId))
                ).limit(1);
            } else if (grantType === 'path') {
                existingEnrollment = await db.select().from(enrollments).where(
                    and(eq(enrollments.userId, selectedUser.id), eq(enrollments.pathId, selectedItemId))
                ).limit(1);
            }

            if (existingEnrollment && existingEnrollment.length > 0) {
                toast({
                    title: "تنبيه",
                    description: `المستخدم مشترك بالفعل في هذا ${getTypeLabel()}`,
                    variant: "destructive",
                });
                setIsGranting(false);
                return;
            }

            // Create enrollment based on type
            await db.insert(enrollments).values({
                userId: selectedUser.id,
                courseId: grantType === 'course' ? selectedItemId : null,
                packageId: grantType === 'package' ? selectedItemId : null,
                pathId: grantType === 'path' ? selectedItemId : null,
                enrolledAt: new Date(),
                progressPercent: 0,
            });

            toast({
                title: "تم بنجاح",
                description: `تم فتح ${getTypeLabel()} للمستخدم ${selectedUser.fullName || selectedUser.username}`,
            });
            setIsGrantDialogOpen(false);
        } catch (error) {
            console.error("Grant access error:", error);
            toast({
                title: "خطأ",
                description: "حدث خطأ أثناء منح الصلاحية",
                variant: "destructive",
            });
        } finally {
            setIsGranting(false);
        }
    };

    const filteredUsers = usersList.filter(user =>
        (user.fullName && user.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (user.username && user.username.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="p-8 space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-amiri font-bold text-gold-gradient mb-2">المستخدمين</h1>
                    <p className="text-muted-foreground font-cairo">إدارة الطلاب والمستخدمين في المنصة</p>
                </div>
            </div>

            <div className="relative max-w-md">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                    placeholder="بحث بالاسم أو اسم المستخدم..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10 bg-card border-border"
                />
            </div>

            <div className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/50 border-b border-border">
                            <tr>
                                <th className="text-right p-4 font-cairo text-sm font-semibold">المستخدم</th>
                                <th className="text-right p-4 font-cairo text-sm font-semibold">الدور</th>
                                <th className="text-right p-4 font-cairo text-sm font-semibold">المستوى</th>
                                <th className="text-right p-4 font-cairo text-sm font-semibold">الهاتف</th>
                                <th className="text-right p-4 font-cairo text-sm font-semibold">تاريخ التسجيل</th>
                                <th className="text-right p-4 font-cairo text-sm font-semibold">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center">
                                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-gold" />
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                                        لا يوجد مستخدمين
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-muted/20 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <User className="w-5 h-5 text-primary" />
                                                </div>
                                                <div>
                                                    <div className="font-bold">{user.fullName || "بدون اسم"}</div>
                                                    <div className="text-xs text-muted-foreground">@{user.username}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs flex w-fit items-center gap-1 ${user.role === 'admin' ? 'bg-destructive/10 text-destructive' :
                                                user.role === 'instructor' ? 'bg-gold/10 text-gold-dark' :
                                                    'bg-blue-500/10 text-blue-500'
                                                }`}>
                                                {user.role === 'admin' && <Shield className="w-3 h-3" />}
                                                {user.role === 'admin' ? 'مشرف' : user.role === 'instructor' ? 'مدرب' : 'طالب'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm">{user.skillLevel || "-"}</td>
                                        <td className="p-4 text-dir-ltr text-right text-sm font-mono">{user.phone || "-"}</td>
                                        <td className="p-4 text-sm text-muted-foreground">
                                            {new Date(user.createdAt || "").toLocaleDateString('ar-EG')}
                                        </td>
                                        <td className="p-4">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleGrantAccess(user)}
                                                className="gap-2"
                                            >
                                                <Unlock className="w-4 h-4" />
                                                فتح محتوى
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Dialog open={isGrantDialogOpen} onOpenChange={setIsGrantDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>فتح محتوى للمستخدم</DialogTitle>
                        <DialogDescription>
                            امنح المستخدم <strong>{selectedUser?.fullName || selectedUser?.username}</strong> صلاحية الوصول إلى دورة أو باقة أو مسار دون الحاجة للدفع.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {/* Type Selector */}
                        <div className="space-y-2">
                            <Label>نوع المحتوى</Label>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant={grantType === 'course' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => { setGrantType('course'); setSelectedItemId(''); }}
                                    className={`gap-2 flex-1 ${grantType === 'course' ? 'btn-gold' : ''}`}
                                >
                                    <BookOpen className="w-4 h-4" />
                                    دورة
                                </Button>
                                <Button
                                    type="button"
                                    variant={grantType === 'package' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => { setGrantType('package'); setSelectedItemId(''); }}
                                    className={`gap-2 flex-1 ${grantType === 'package' ? 'btn-gold' : ''}`}
                                >
                                    <Package className="w-4 h-4" />
                                    باقة
                                </Button>
                                <Button
                                    type="button"
                                    variant={grantType === 'path' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => { setGrantType('path'); setSelectedItemId(''); }}
                                    className={`gap-2 flex-1 ${grantType === 'path' ? 'btn-gold' : ''}`}
                                >
                                    <Route className="w-4 h-4" />
                                    مسار
                                </Button>
                            </div>
                        </div>

                        {/* Item Selector */}
                        <div className="space-y-2">
                            <Label>اختر {getTypeLabel()}</Label>
                            <Select value={selectedItemId} onValueChange={setSelectedItemId}>
                                <SelectTrigger>
                                    <SelectValue placeholder={`اختر ${getTypeLabel()}`} />
                                </SelectTrigger>
                                <SelectContent>
                                    {getCurrentItems().length === 0 ? (
                                        <SelectItem value="none" disabled>لا يوجد {getTypeLabel()} متاحة</SelectItem>
                                    ) : (
                                        getCurrentItems().map((item) => (
                                            <SelectItem key={item.id} value={item.id}>
                                                {item.name}
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsGrantDialogOpen(false)}>إلغاء</Button>
                        <Button onClick={submitGrantAccess} disabled={!selectedItemId || isGranting} className="btn-gold">
                            {isGranting ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : <Unlock className="w-4 h-4 ml-2" />}
                            منح الصلاحية
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Users;
