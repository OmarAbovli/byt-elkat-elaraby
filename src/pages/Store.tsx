import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { ShoppingBag, Star, Search, Filter, ArrowRight, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/db";
import { products } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import { useCart } from "@/providers/CartProvider";

const StorePage = () => {
    const [productsList, setProductsList] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const { addItem } = useCart();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await db.select().from(products).where(eq(products.isPublished, true)).orderBy(desc(products.createdAt));
                setProductsList(data);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const filteredProducts = productsList.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <section className="pt-32 pb-20 relative overflow-hidden">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center max-w-3xl mx-auto mb-16"
                    >
                        <h1 className="text-4xl md:text-5xl font-amiri font-bold mb-6">
                            أدوات <span className="text-gold-gradient">وفنون الخط</span>
                        </h1>
                        <p className="text-muted-foreground font-cairo text-lg">
                            نوفر لك أجود أنواع الورق، الأحبار، والأقلام المختارة بعناية لتناسب رحلتك الإبداعية.
                        </p>
                    </motion.div>

                    <div className="flex flex-col md:flex-row gap-4 mb-12">
                        <div className="relative flex-1">
                            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                            <Input
                                placeholder="ابحث عن منتج..."
                                className="pr-12 h-12 bg-card border-border/50 text-right font-cairo"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" className="h-12 gap-2 font-cairo border-border/50 bg-card">
                            <Filter className="w-4 h-4" /> تصفية
                        </Button>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="card-luxury p-3 animate-pulse">
                                    <div className="aspect-square bg-muted rounded-lg mb-4" />
                                    <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                                    <div className="h-4 bg-muted rounded w-1/4" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {filteredProducts.map((product) => {
                                const images = product.images as string[];
                                const mainImage = images && images.length > 0 ? images[0] : "/placeholder.jpg";

                                return (
                                    <motion.div
                                        key={product.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="group"
                                    >
                                        <div className="card-luxury p-3 h-full flex flex-col">
                                            <div className="aspect-square rounded-lg overflow-hidden bg-background mb-4 relative">
                                                <img
                                                    src={mainImage}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform bg-gradient-to-t from-black/80 to-transparent">
                                                    <Button
                                                        className="w-full btn-gold rounded-full font-cairo gap-2"
                                                        onClick={() => addItem({
                                                            id: product.id,
                                                            name: product.name,
                                                            price: parseFloat(product.price),
                                                            image: mainImage,
                                                            type: 'product'
                                                        })}
                                                    >
                                                        <ShoppingCart className="w-4 h-4" /> إضافة للسلة
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="flex-1">
                                                <h3 className="font-bold font-cairo text-lg mb-2 line-clamp-1 group-hover:text-gold transition-colors">
                                                    {product.name}
                                                </h3>
                                                <div className="flex justify-between items-center mt-auto">
                                                    <span className="text-xl font-bold font-mono text-gold-gradient">${product.price}</span>
                                                    <div className="flex text-amber-500 text-[10px]">
                                                        {[1, 2, 3, 4, 5].map(star => (
                                                            <Star key={star} className="w-3 h-3 fill-current" />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}

                    {!isLoading && filteredProducts.length === 0 && (
                        <div className="text-center py-20">
                            <ShoppingBag className="w-20 h-20 text-muted-foreground/20 mx-auto mb-6" />
                            <h3 className="text-2xl font-bold font-cairo mb-2">المنتج غير موجود</h3>
                            <p className="text-muted-foreground font-cairo">جرب البحث عن أدوات أخرى.</p>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default StorePage;
