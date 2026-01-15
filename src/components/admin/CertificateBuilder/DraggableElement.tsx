
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { PenTool } from "lucide-react";

interface DraggableElementProps {
    id: string;
    element: any;
    isSelected: boolean;
    onSelect: (id: string) => void;
}

const DraggableElement = ({ id, element, isSelected, onSelect }: DraggableElementProps) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: id,
        data: { ...element },
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        left: `${element.x}px`,
        top: `${element.y}px`,
        position: 'absolute' as 'absolute',
        cursor: 'move',
        zIndex: isSelected ? 100 : 1,
    };

    const getElementContent = () => {
        switch (element.type) {
            case 'text':
                return element.content;
            case 'studentName':
                return "[اسم الطالب]";
            case 'courseName':
                return "[اسم الدورة]";
            case 'date':
                return "[تاريخ الإصدار]";
            case 'serialNumber':
                return "[رقم السيريال]";
            case 'qrCode':
                return (
                    <div className="bg-white border-2 border-dashed border-gray-300 w-full h-full flex items-center justify-center">
                        <span className="text-[10px] text-gray-400">QR Code</span>
                    </div>
                );
            case 'signature':
                return (
                    element.signatureUrl ? (
                        <img src={element.signatureUrl} alt="Signature" className="w-full h-full object-contain" />
                    ) : (
                        <div className="w-full h-full border border-dashed border-gray-400 bg-gray-50 flex items-center justify-center text-xs text-gray-500 gap-1 rounded">
                            <PenTool className="w-3 h-3" /> التوقيع
                        </div>
                    )
                );
            default:
                return element.type;
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={{
                ...style,
                fontSize: element.fontSize ? `${element.fontSize}px` : undefined,
                color: element.color,
                fontFamily: element.fontFamily,
                fontWeight: element.fontWeight,
                fontStyle: element.fontStyle,
                width: element.width ? `${element.width}px` : undefined,
                height: element.type === 'qrCode' ? `${element.width}px` : element.height ? `${element.height}px` : 'auto',
                textAlign: element.textAlign,
            }}
            {...listeners}
            {...attributes}
            className={`select-none whitespace-nowrap p-1 group ${isSelected
                    ? 'ring-2 ring-gold ring-offset-2'
                    : 'hover:ring-1 hover:ring-gold/50 hover:ring-offset-1'
                }`}
            onMouseDown={() => onSelect(id)}
            onClick={(e) => { e.stopPropagation(); onSelect(id); }}
        >
            {getElementContent()}
        </div>
    );
};

export default DraggableElement;
