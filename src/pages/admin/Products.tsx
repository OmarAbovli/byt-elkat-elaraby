import { useState, useCallback, useEffect } from "react";
import ImageUpload from "@/components/admin/ImageUpload";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Loader2, Search, ShoppingBag, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { db } from "@/lib/db";
import { products } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

interface Product {
    id: string;
    name: string;
    description: string | null;
    price: string;
    stock: number | null;
    isPublished: boolean | null;
    images: string[] | null;
}

const Products = () => {
    const [productsList, setProductsList] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: 0,
        stock: 0,
        isPublished: true,
        images: [] as string[],
    });

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await db.select().from(products).orderBy(desc(products.createdAt));
            setProductsList(data.map(p => ({
                ...p,
                price: p.price.toString(),
                images: p.images as string[],
            })) as Product[]);
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (editingProduct) {
                await db
                    .update(products)
                    .set({
                        ...formData,
                        price: formData.price.toString()
                    })
                    .where(eq(products.id, editingProduct.id));
                toast({ title: "تم تحديث المنتج بنجاح" });
            } else {
                await db.insert(products).values({
                    ...formData,
                    price: formData.price.toString()
                });
                toast({ title: "تم إضافة المنتج بنجاح" });
            }
            setIsDialogOpen(false);
            resetForm();
            fetchData();
        } catch (error: unknown) {
            toast({
                title: "خطأ",
                description: error instanceof Error ? error.message : "حدث خطأ ما",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;
        try {
            await db.delete(products).where(eq(products.id, id));
            toast({ title: "تم حذف المنتج" });
            fetchData();
        } catch (error: unknown) {
            toast({
                title: "خطأ",
                description: error instanceof Error ? error.message : "حدث خطأ ما",
                variant: "destructive",
            });
        }
    };

    const openEditDialog = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description || "",
            price: parseFloat(product.price),
            stock: product.stock || 0,
            isPublished: product.isPublished || false,
            images: (product.images as string[]) || [], // Cast properly
        });
        setIsDialogOpen(true);
    };

    const resetForm = () => {
        setEditingProduct(null);
        setFormData({
            name: "",
            description: "",
            price: 0,
            stock: 0,
            isPublished: true,
            images: [],
        });
    };

    return (
        <div className="p-8 space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-amiri font-bold text-gold-gradient mb-2">المتجر والمنتجات</h1>
                    <p className="text-muted-foreground font-cairo">إدارة المنتجات والأدوات</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={resetForm} className="btn-gold gap-2">
                            <Plus className="w-5 h-5" />
                            منتج جديد
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="font-amiri text-2xl text-center">
                                {editingProduct ? "تعديل المنتج" : "إضافة منتج جديد"}
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label>اسم المنتج</Label>
                                <Input
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>صور المنتج</Label>
                                <ImageUpload
                                    value={formData.images}
                                    onChange={(urls) => setFormData({ ...formData, images: urls })}
                                    onRemove={(url) => setFormData({ ...formData, images: formData.images.filter(i => i !== url) })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>الوصف</Label>
                                <Textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>السعر</Label>
                                    <Input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>المخزون</Label>
                                    <Input
                                        type="number"
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center space-x-2 space-x-reverse pt-2">
                                <Switch
                                    id="isPublished"
                                    checked={formData.isPublished}
                                    onCheckedChange={(checked) => setFormData({ ...formData, isPublished: checked })}
                                />
                                <Label htmlFor="isPublished">عرض المنتج في المتجر</Label>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button type="submit" className="btn-gold flex-1" disabled={isLoading}>
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "حفظ"}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {productsList.map((product) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="card-luxury p-4 space-y-4 flex flex-col justify-between"
                    >
                        <div>
                            <div className="aspect-square bg-secondary/10 rounded-lg flex items-center justify-center mb-4 overflow-hidden relative">
                                {product.images && Array.isArray(product.images) && product.images.length > 0 ? (
                                    <img
                                        src={product.images[0] as string}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <ImageIcon className="w-12 h-12 text-muted-foreground/30" />
                                )}
                            </div>
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-lg">{product.name}</h3>
                                <div className="flex gap-1">
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-gold" onClick={() => openEditDialog(product)}>
                                        <Pencil className="w-3 h-3" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => handleDelete(product.id)}>
                                        <Trash2 className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{product.description}</p>
                        </div>

                        <div className="flex justify-between items-center border-t border-border pt-3">
                            <div className="font-bold text-xl">{product.price} <span className="text-xs text-muted-foreground">USD</span></div>
                            <div className="text-xs">
                                {product.stock && product.stock > 0 ? (
                                    <span className="text-emerald-light">متوفر ({product.stock})</span>
                                ) : (
                                    <span className="text-destructive">نفذت الكمية</span>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Products;
