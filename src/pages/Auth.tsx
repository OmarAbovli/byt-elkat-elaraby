import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { Navigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-calligraphy.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Auth = () => {
  const { login, register, isAuthenticated, user } = useAuth();
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get("mode") === "register" ? "register" : "login";

  const [isLoading, setIsLoading] = useState(false);

  // Login State
  const [loginData, setLoginData] = useState({ username: "", password: "" });

  // Register State
  const [registerData, setRegisterData] = useState({
    username: "",
    password: "",
    fullName: "",
    email: "",
    phone: ""
  });

  if (isAuthenticated) {
    if (user?.role === 'admin') {
      return <Navigate to="/admin" />;
    }
    return <Navigate to="/dashboard" />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const success = await login(loginData.username, loginData.password);

    if (success) {
      toast.success("تم تسجيل الدخول بنجاح");
    } else {
      toast.error("اسم المستخدم أو كلمة المرور غير صحيحة");
    }
    setIsLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await register(registerData);

    if (result.success) {
      toast.success("تم إنشاء الحساب بنجاح");
    } else {
      toast.error(result.error || "فشل إنشاء الحساب");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex" dir="rtl">
      {/* Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <a href="/" className="inline-block">
              <h1 className="text-4xl font-amiri font-bold text-gold-gradient">
                بيت الخط
              </h1>
              <p className="text-muted-foreground text-sm font-cairo mt-1">
                أكاديمية الخط العربي
              </p>
            </a>
          </motion.div>

          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 h-12">
              <TabsTrigger value="login" className="font-cairo text-base">تسجيل دخول</TabsTrigger>
              <TabsTrigger value="register" className="font-cairo text-base">حساب جديد</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold font-cairo mb-2">مرحباً بعودتك</h2>
                  <p className="text-muted-foreground font-cairo">
                    أدخل بيانات حسابك للمتابعة
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-username">اسم المستخدم</Label>
                  <Input
                    id="login-username"
                    value={loginData.username}
                    onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">كلمة المرور</Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                    className="h-11"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full btn-luxury mt-4"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? "جاري الدخول..." : "تسجيل الدخول"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold font-cairo mb-2">انضم إلينا</h2>
                  <p className="text-muted-foreground font-cairo">
                    أنشئ حسابك وابدأ رحلة التعلم
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-fullname">الاسم الثلاثي</Label>
                  <Input
                    id="reg-fullname"
                    value={registerData.fullName}
                    onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
                    required
                    placeholder="الاسم كما يظهر في الشهادة"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="reg-email">البريد الإلكتروني</Label>
                    <Input
                      id="reg-email"
                      type="email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      required
                      dir="ltr"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reg-phone">رقم الهاتف</Label>
                    <Input
                      id="reg-phone"
                      type="tel"
                      value={registerData.phone}
                      onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                      required
                      dir="ltr"
                      placeholder="05xxxxxxxx"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-username">اسم المستخدم</Label>
                  <Input
                    id="reg-username"
                    value={registerData.username}
                    onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                    required
                    placeholder="username"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-password">كلمة المرور</Label>
                  <Input
                    id="reg-password"
                    type="password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    required
                    placeholder="••••••"
                    dir="ltr"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full btn-luxury mt-4"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? "جاري الإنشاء..." : "إنشاء حساب جديد"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Image Side */}
      <div className="hidden lg:block lg:w-1/2 relative fixed right-0 h-screen">
        <img
          src={heroImage}
          alt="Arabic Calligraphy"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-background/80 via-background/40 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl font-amiri font-bold text-foreground mb-4"
            >
              حيث يلتقي الفن بالتعليم
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-xl text-foreground/80 font-cairo"
            >
              تعلم الخط العربي من نخبة المعلمين
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
