
import { Button } from "@/components/ui/button";
import { Type, Image as ImageIcon, QrCode, Hash, PenTool } from "lucide-react";

interface ToolboxProps {
    onAddElement: (type: string) => void;
}

const Toolbox = ({ onAddElement }: ToolboxProps) => {
    return (
        <div className="space-y-4">
            <h3 className="font-bold font-cairo text-sm text-muted-foreground mb-4">أدوات العناضر</h3>
            <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-20 flex flex-col gap-2 border-dashed hover:border-gold hover:text-gold hover:bg-gold/5" onClick={() => onAddElement('text')}>
                    <Type className="w-6 h-6" />
                    <span className="text-xs font-cairo">نص ثابت</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2 border-dashed hover:border-gold hover:text-gold hover:bg-gold/5" onClick={() => onAddElement('studentName')}>
                    <Type className="w-6 h-6 text-emerald-500" />
                    <span className="text-xs font-cairo">اسم الطالب</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2 border-dashed hover:border-gold hover:text-gold hover:bg-gold/5" onClick={() => onAddElement('courseName')}>
                    <Type className="w-6 h-6 text-blue-500" />
                    <span className="text-xs font-cairo">اسم الدورة</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2 border-dashed hover:border-gold hover:text-gold hover:bg-gold/5" onClick={() => onAddElement('date')}>
                    <Type className="w-6 h-6 text-purple-500" />
                    <span className="text-xs font-cairo">تاريخ الإصدار</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2 border-dashed hover:border-gold hover:text-gold hover:bg-gold/5" onClick={() => onAddElement('qrCode')}>
                    <QrCode className="w-6 h-6" />
                    <span className="text-xs font-cairo">QR Code</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2 border-dashed hover:border-gold hover:text-gold hover:bg-gold/5" onClick={() => onAddElement('serialNumber')}>
                    <Hash className="w-6 h-6" />
                    <span className="text-xs font-cairo">رقم السيريال</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2 border-dashed hover:border-gold hover:text-gold hover:bg-gold/5" onClick={() => onAddElement('signature')}>
                    <PenTool className="w-6 h-6" />
                    <span className="text-xs font-cairo">توقيع</span>
                </Button>
            </div>
        </div>
    );
};

export default Toolbox;
