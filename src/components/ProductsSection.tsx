import { motion } from "framer-motion";
import { ShoppingBag, Star, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { db } from "@/lib/db";
import { products } from "@/lib/schema";
import { desc, eq } from "drizzle-orm";
import { Link } from "react-router-dom";
import { useCart } from "@/providers/CartProvider";

interface Product {
    id: string;
    name: string;
    price: string;
    image: string;
}

const ProductsSection = () => {
    const [productsList, setProductsList] = useState<Product[]>([]);
    const { addItem } = useCart();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await db.select().from(products)
                    .where(eq(products.isPublished, true))
                    .orderBy(desc(products.createdAt))
                    .limit(4);

                setProductsList(data.map(p => {
                    const images = p.images as string[];
                    return {
                        id: p.id,
                        name: p.name,
                        price: p.price.toString(),
                        image: images && images.length > 0 ? images[0] : "",
                    };
                }));
            } catch (error) {
                console.error("Failed to fetch products", error);
            }
        };
        fetchProducts();
    }, []);

    if (productsList.length === 0) return null;

    return (
        <section className="relative py-24 bg-obsidian-light/30">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex justify-between items-end mb-12"
                >
                    <div>
                        <span className="text-gold text-sm font-cairo tracking-wider uppercase mb-2 block">
                            المتجر
                        </span>
                        <h2 className="text-3xl md:text-4xl font-amiri font-bold">
                            أدوات <span className="text-gold-gradient">الخطاط</span>
                        </h2>
                    </div>
                    <Link to="/store">
                        <Button variant="ghost" className="text-gold gap-2 hover:text-gold/80 hidden md:flex">
                            تصفح المتجر <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {productsList.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group"
                        >
                            <div className="card-luxury p-3 h-full flex flex-col">
                                <div className="aspect-square rounded-lg overflow-hidden bg-background/50 mb-4 relative">
                                    {product.image ? (
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                            <ShoppingBag className="w-8 h-8 opacity-20" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Button
                                            size="sm"
                                            className="btn-gold rounded-full"
                                            onClick={() => addItem({
                                                id: product.id,
                                                name: product.name,
                                                price: parseFloat(product.price),
                                                image: product.image,
                                                type: 'product'
                                            })}
                                        >
                                            إضافة للسلة
                                        </Button>
                                    </div>
                                </div>
                                <div className="mt-auto">
                                    <h3 className="font-bold font-cairo text-lg mb-1 line-clamp-1">{product.name}</h3>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gold font-bold font-mono">${product.price}</span>
                                        <div className="flex text-amber-500 text-xs">
                                            <Star className="w-3 h-3 fill-current" />
                                            <Star className="w-3 h-3 fill-current" />
                                            <Star className="w-3 h-3 fill-current" />
                                            <Star className="w-3 h-3 fill-current" />
                                            <Star className="w-3 h-3 fill-current" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
                <div className="mt-8 text-center md:hidden">
                    <Link to="/store">
                        <Button variant="ghost" className="text-gold gap-2 hover:text-gold/80">
                            تصفح المتجر <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default ProductsSection;
