import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/providers/CartProvider";
import { X, ShoppingBag, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const CartDrawer = () => {
    const { items, removeItem, total, isOpen, setIsOpen } = useCart();
    const location = useLocation();
    const isAdmin = location.pathname.startsWith('/admin');

    useEffect(() => {
        if (isAdmin && isOpen) {
            setIsOpen(false);
        }
    }, [isAdmin, isOpen, setIsOpen]);

    return (
        <Sheet open={isOpen && !isAdmin} onOpenChange={setIsOpen}>
            <SheetContent side="left" className="w-full sm:w-[400px] flex flex-col p-0">
                <SheetHeader className="p-6 border-b border-border/50">
                    <SheetTitle className="text-2xl font-amiri font-bold flex items-center gap-2">
                        <ShoppingBag className="w-6 h-6 text-gold" />
                        سلة المشتريات
                        <span className="text-sm font-sans font-normal text-muted-foreground bg-secondary/20 px-2 py-1 rounded-full">
                            {items.length}
                        </span>
                    </SheetTitle>
                </SheetHeader>

                <ScrollArea className="flex-1 p-6">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-48 text-muted-foreground gap-4">
                            <ShoppingBag className="w-16 h-16 opacity-20" />
                            <p className="font-cairo">السلة فارغة</p>
                            <Button
                                variant="outline"
                                onClick={() => setIsOpen(false)}
                                className="mt-2"
                            >
                                تصفح المنتجات
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            <AnimatePresence mode="popLayout">
                                {items.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="flex gap-4 p-4 bg-secondary/5 rounded-xl border border-border/50 group"
                                    >
                                        {item.image ? (
                                            <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 border border-border/50">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-20 h-20 rounded-lg bg-secondary/20 flex items-center justify-center shrink-0">
                                                <ShoppingBag className="w-8 h-8 text-muted-foreground/30" />
                                            </div>
                                        )}

                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <h4 className="font-bold font-cairo line-clamp-1">{item.name}</h4>
                                                <p className="text-sm text-muted-foreground capitalize">
                                                    {item.type === 'course' ? 'دورة تدريبية' :
                                                        item.type === 'package' ? 'باقة تعليمية' : 'منتج'}
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-between mt-2">
                                                <p className="text-gold font-bold font-mono">
                                                    ${item.price}
                                                </p>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                    onClick={() => removeItem(item.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </ScrollArea>

                {items.length > 0 && (
                    <div className="p-6 bg-secondary/5 border-t border-border/50 space-y-4">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">المجموع الفرعي</span>
                                <span className="font-mono">${total}</span>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between font-bold text-lg">
                                <span>الإجمالي</span>
                                <span className="text-gold font-mono">${total}</span>
                            </div>
                        </div>
                        <Button className="w-full btn-luxury h-12 text-lg">
                            إتمام الشراء
                        </Button>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
};

export default CartDrawer;
