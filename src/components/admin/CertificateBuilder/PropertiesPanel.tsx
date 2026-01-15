
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { HexColorPicker } from "react-colorful";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { AlignLeft, AlignCenter, AlignRight, Bold, Italic, Trash2 } from "lucide-react";
import SingleImageUpload from "@/components/admin/SingleImageUpload";

interface PropertiesPanelProps {
    element: any;
    onUpdate: (updates: any) => void;
    onDelete: (id: string) => void;
}

const PropertiesPanel = ({ element, onUpdate, onDelete }: PropertiesPanelProps) => {
    if (!element) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8 text-center">
                <p className="font-cairo">اختر عنصراً لتعديل خصائصه</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="font-bold font-cairo text-sm text-muted-foreground">خصائص العنصر</h3>
                <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => onDelete(element.id)}>
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>

            <div className="space-y-4">
                {/* Content (Only for static text) */}
                {element.type === 'text' && (
                    <div className="space-y-2">
                        <Label className="font-cairo text-xs">النص</Label>
                        <Input
                            value={element.content}
                            onChange={(e) => onUpdate({ content: e.target.value })}
                            className="font-cairo"
                        />
                    </div>
                )}

                {/* Font Size */}
                <div className="space-y-2">
                    <Label className="font-cairo text-xs">حجم الخط ({element.fontSize}px)</Label>
                    <Slider
                        value={[element.fontSize || 16]}
                        min={8}
                        max={100}
                        step={1}
                        onValueChange={([val]) => onUpdate({ fontSize: val })}
                    />
                </div>

                {/* Color */}
                <div className="space-y-2">
                    <Label className="font-cairo text-xs">اللون</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-full justify-start gap-2"
                                style={{ color: element.color }}
                            >
                                <div className="w-4 h-4 rounded-full border border-border" style={{ backgroundColor: element.color }} />
                                {element.color}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 border-none shadow-xl">
                            <HexColorPicker color={element.color} onChange={(val) => onUpdate({ color: val })} />
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Font Family */}
                {['text', 'studentName', 'courseName', 'date', 'serialNumber'].includes(element.type) && (
                    <div className="space-y-2">
                        <Label className="font-cairo text-xs">نوع الخط</Label>
                        <Select value={element.fontFamily} onValueChange={(val) => onUpdate({ fontFamily: val })}>
                            <SelectTrigger className="font-cairo">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Cairo, sans-serif" className="font-cairo">Cairo</SelectItem>
                                <SelectItem value="'Amiri', serif" className="font-amiri">Amiri</SelectItem>
                                <SelectItem value="'Reem Kufi', sans-serif" style={{ fontFamily: 'Reem Kufi' }}>Reem Kufi</SelectItem>
                                <SelectItem value="'Aref Ruqaa', serif" style={{ fontFamily: 'Aref Ruqaa' }}>Aref Ruqaa</SelectItem>
                                <SelectItem value="monospace">Monospace</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {/* Alignment & Style */}
                <div className="flex items-center gap-2">
                    <Button
                        variant={element.fontWeight === 'bold' ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => onUpdate({ fontWeight: element.fontWeight === 'bold' ? 'normal' : 'bold' })}
                    >
                        <Bold className="w-4 h-4" />
                    </Button>
                    <Button
                        variant={element.fontStyle === 'italic' ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => onUpdate({ fontStyle: element.fontStyle === 'italic' ? 'normal' : 'italic' })}
                    >
                        <Italic className="w-4 h-4" />
                    </Button>
                    <div className="w-px h-6 bg-border mx-2" />
                    <Button
                        variant={element.textAlign === 'right' ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => onUpdate({ textAlign: 'right' })}
                    >
                        <AlignRight className="w-4 h-4" />
                    </Button>
                    <Button
                        variant={element.textAlign === 'center' ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => onUpdate({ textAlign: 'center' })}
                    >
                        <AlignCenter className="w-4 h-4" />
                    </Button>
                    <Button
                        variant={element.textAlign === 'left' ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => onUpdate({ textAlign: 'left' })}
                    >
                        <AlignLeft className="w-4 h-4" />
                    </Button>
                </div>

                {/* Specific Dimensions for non-text items */}
                {['qrCode', 'signature', 'image'].includes(element.type) && (
                    <div className="space-y-2">
                        <Label className="font-cairo text-xs">العرض ({element.width}px)</Label>
                        <Slider
                            value={[element.width || 100]}
                            min={20}
                            max={500}
                            step={5}
                            onValueChange={([val]) => onUpdate({ width: val })}
                        />
                    </div>
                )}

                {/* Position Manual Adjustment */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                    <div className="space-y-1">
                        <Label className="text-[10px] text-muted-foreground">X</Label>
                        <Input
                            type="number"
                            value={Math.round(element.x)}
                            onChange={(e) => onUpdate({ x: parseInt(e.target.value) })}
                            className="h-8"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-[10px] text-muted-foreground">Y</Label>
                        <Input
                            type="number"
                            value={Math.round(element.y)}
                            onChange={(e) => onUpdate({ y: parseInt(e.target.value) })}
                            className="h-8"
                        />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PropertiesPanel;
