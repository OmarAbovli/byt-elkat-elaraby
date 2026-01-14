import { motion } from "framer-motion";
import { Check, Crown, Star, Sparkles, Loader2, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { db } from "@/lib/db";
import { packages } from "@/lib/schema";
import { eq, asc } from "drizzle-orm";
import { useCart } from "@/providers/CartProvider";
import { useNavigate } from "react-router-dom";

interface Plan {
  id: string;
  name: string;
  description: string;
  price: string;
  features: string[];
  isPopular: boolean;
  icon: any;
  cta: string;
}

const Pricing = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addItem } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const data = await db.select().from(packages)
          .where(eq(packages.isPublished, true))
        // .orderBy(asc(packages.price)); // Order by price

        const mappedPlans = data.map((pkg, index) => ({
          id: pkg.id,
          name: pkg.name,
          description: pkg.description || "",
          price: pkg.price.toString(),
          features: (pkg.features as string[]) || [], // Correctly cast jsonb
          isPopular: index === 1, // Highlight the middle one nicely
          icon: index === 0 ? Star : index === 1 ? Crown : Sparkles,
          cta: "اشترك الآن"
        }));

        // If no plans in DB, show nothing or mock? 
        // Let's rely on DB. If empty, the section will be empty effectively.
        setPlans(mappedPlans);
      } catch (error) {
        console.error("Error fetching packages:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPackages();
  }, []);

  if (isLoading) {
    return (
      <div className="py-24 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  if (plans.length === 0) return null;

  return (
    <section className="relative py-32 overflow-hidden" id="pricing">
      {/* Background */}
      <div className="absolute inset-0 geometric-pattern opacity-20" />

      <div className="container mx-auto px-6 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-gold text-sm font-cairo tracking-wider uppercase mb-4 block">
            خطط الاشتراك
          </span>
          <h2 className="text-4xl md:text-5xl font-amiri font-bold mb-6">
            <span className="text-foreground">اختر</span>{" "}
            <span className="text-gold-gradient">خطتك المناسبة</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-cairo">
            استثمر في نفسك وتعلم فن الخط العربي من أفضل المعلمين
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className={`relative ${plan.isPopular ? "md:-mt-4 md:mb-[-16px]" : ""}`}
            >
              {/* Popular Badge */}
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-gold text-background text-sm font-bold font-cairo z-10">
                  الأكثر طلباً
                </div>
              )}

              <div
                className={`card-luxury h-full p-8 ${plan.isPopular
                  ? "border-gold/50 bg-card/90"
                  : "border-border/50"
                  }`}
              >
                {/* Icon & Name */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${plan.isPopular
                      ? "bg-gradient-gold"
                      : "bg-gradient-to-br from-gold/20 to-emerald/20"
                      }`}
                  >
                    <plan.icon
                      className={`w-6 h-6 ${plan.isPopular ? "text-background" : "text-gold"
                        }`}
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-cairo text-foreground">
                      {plan.name}
                    </h3>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-foreground font-cairo">
                      ${plan.price}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground font-cairo mt-2">
                    {plan.description}
                  </p>
                </div>

                {/* Divider */}
                <div className="h-px bg-border my-6" />

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-gold" />
                      </div>
                      <span className="text-sm text-foreground/80 font-cairo">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  className={`w-full py-6 text-lg ${plan.isPopular ? "btn-gold" : "btn-emerald"}`}
                  onClick={() => addItem({
                    id: plan.id,
                    name: plan.name,
                    price: parseFloat(plan.price),
                    type: 'package'
                  })}
                >
                  {plan.cta}
                </Button>

                <div className="mt-4 text-center">
                  <Link
                    to={`/package/${plan.id}`}
                    className="text-gold hover:text-gold/80 text-sm font-cairo flex items-center justify-center gap-1 group"
                  >
                    عرض الدورات المشمولة
                    <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Money Back Guarantee */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center text-muted-foreground text-sm font-cairo mt-12"
        >
          ضمان استرداد الأموال خلال 14 يوماً • بدون أي التزامات
        </motion.p>
      </div>
    </section>
  );
};

export default Pricing;
