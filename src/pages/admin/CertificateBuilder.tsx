
import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Loader2, Save, Undo2 } from "lucide-react";
import Toolbox from "@/components/admin/CertificateBuilder/Toolbox";
import PropertiesPanel from "@/components/admin/CertificateBuilder/PropertiesPanel";
import BuilderCanvas from "@/components/admin/CertificateBuilder/BuilderCanvas";
import { db } from "@/lib/db";
import { courses, certificateTemplates } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';

const CertificateBuilder = () => {
    const { id } = useParams(); // This can be courseId or templateId depending on route
    const location = useLocation();
    const isTemplateMode = location.pathname.includes('/templates/');

    const navigate = useNavigate();
    const { toast } = useToast();

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Builder State
    const [backgroundUrl, setBackgroundUrl] = useState("");
    const [elements, setElements] = useState<any[]>([]);
    const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
    const [templateName, setTemplateName] = useState("");

    // Load initial data
    useEffect(() => {
        const fetchSettings = async () => {
            if (!id) return;
            try {
                if (isTemplateMode) {
                    // Check if it's a new template
                    if (id === 'new') {
                        setIsLoading(false);
                        return;
                    }

                    const result = await db.select().from(certificateTemplates).where(eq(certificateTemplates.id, id)).limit(1);
                    if (result.length > 0) {
                        const settings: any = result[0].settings;
                        setTemplateName(result[0].name);
                        if (settings) {
                            setBackgroundUrl(settings.background || "");
                            setElements(settings.elements || []);
                        }
                    }
                } else {
                    // Course Mode
                    const result = await db.select({ certificateSettings: courses.certificateSettings })
                        .from(courses)
                        .where(eq(courses.id, id))
                        .limit(1);

                    if (result.length > 0 && result[0].certificateSettings) {
                        const settings: any = result[0].certificateSettings;
                        if (settings.mode === 'custom') {
                            setBackgroundUrl(settings.background || "");
                            setElements(settings.elements || []);
                        }
                    }
                }
            } catch (error) {
                console.error("Failed to load settings", error);
                toast({ title: "فشل تحميل الإعدادات", variant: "destructive" });
            } finally {
                setIsLoading(false);
            }
        };

        fetchSettings();
    }, [id, isTemplateMode, toast]);

    const handleAddElement = (type: string) => {
        const newElement = {
            id: uuidv4(),
            type,
            x: 50,
            y: 50,
            content: type === 'text' ? 'نص جديد' : '',
            fontSize: 24,
            color: '#000000',
            fontFamily: 'Cairo, sans-serif',
            textAlign: 'center',
            width: ['qrCode', 'signature', 'image'].includes(type) ? 100 : undefined,
        };
        setElements([...elements, newElement]);
        setSelectedElementId(newElement.id);
    };

    const handleUpdateElement = (updates: any) => {
        if (!selectedElementId) return;
        setElements(elements.map(el => el.id === selectedElementId ? { ...el, ...updates } : el));
    };

    const handleDeleteElement = (id: string) => {
        setElements(elements.filter(el => el.id !== id));
        setSelectedElementId(null);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, delta } = event;
        setElements(elements.map(el => {
            if (el.id === active.id) {
                return {
                    ...el,
                    x: el.x + delta.x,
                    y: el.y + delta.y,
                };
            }
            return el;
        }));
    };

    const handleSave = async () => {
        if (!id) return;
        setIsSaving(true);
        try {
            const settings = {
                mode: 'custom',
                background: backgroundUrl,
                elements: elements,
                updatedAt: new Date().toISOString()
            };

            if (isTemplateMode) {
                // If creating new template, we need a name dialog ideally, but for now lets default or use a prompt
                let currentId = id;
                let nameToUse = templateName || "قالب جديد " + new Date().toLocaleDateString();

                if (id === 'new') {
                    // Insert new
                    const inserted = await db.insert(certificateTemplates).values({
                        name: nameToUse,
                        settings: settings
                    }).returning({ id: certificateTemplates.id });

                    if (inserted.length > 0) {
                        currentId = inserted[0].id;
                        navigate(`/admin/templates/${currentId}/builder`, { replace: true });
                    }
                } else {
                    // Update existing
                    await db.update(certificateTemplates)
                        .set({ settings: settings, updatedAt: new Date() })
                        .where(eq(certificateTemplates.id, id));
                }
            } else {
                // Save to Course
                await db.update(courses)
                    .set({ certificateSettings: settings })
                    .where(eq(courses.id, id));
            }

            toast({ title: "تم حفظ التصميم بنجاح", className: "bg-emerald-500 text-white" });
        } catch (error) {
            console.error(error);
            toast({ title: "حدث خطأ أثناء الحفظ", variant: "destructive" });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-gold" /></div>;
    }

    const selectedElement = elements.find(el => el.id === selectedElementId);

    return (
        <div className="h-screen flex flex-col bg-background">
            <Navbar />

            {/* Toolbar */}
            <div className="h-16 border-b border-border bg-card flex items-center justify-between px-6 pt-20 pb-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => navigate('/admin/certificates')}>
                        <Undo2 className="w-4 h-4 ml-2" /> رجوع
                    </Button>
                    <h1 className="font-bold font-amiri text-lg">
                        {isTemplateMode ? (templateName || "قالب جديد") : "مصمم شهادات الدورات"}
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={handleSave} disabled={isSaving || !backgroundUrl} className="btn-gold gap-2">
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        حفظ التصميم
                    </Button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden pt-12">
                {/* Left Sidebar - Properties */}
                <div className="w-80 border-r border-border bg-card p-6 overflow-y-auto">
                    <PropertiesPanel
                        element={selectedElement}
                        onUpdate={handleUpdateElement}
                        onDelete={handleDeleteElement}
                    />
                </div>

                {/* Center - Canvas */}
                <BuilderCanvas
                    elements={elements}
                    backgroundUrl={backgroundUrl}
                    onBackgroundChange={setBackgroundUrl}
                    onDragEnd={handleDragEnd}
                    selectedElementId={selectedElementId}
                    onSelectElement={setSelectedElementId}
                />

                {/* Right Sidebar - Toolbox */}
                <div className="w-64 border-l border-border bg-card p-6 overflow-y-auto">
                    <Toolbox onAddElement={handleAddElement} />
                </div>
            </div>
        </div>
    );
};

export default CertificateBuilder;
