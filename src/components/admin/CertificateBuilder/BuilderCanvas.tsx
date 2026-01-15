
import { DndContext, useDroppable, DragEndEvent } from "@dnd-kit/core";
import DraggableElement from "./DraggableElement";
import { useRef, useEffect } from "react";
import SingleImageUpload from "@/components/admin/SingleImageUpload";

interface BuilderCanvasProps {
    elements: any[];
    backgroundUrl: string;
    onBackgroundChange: (url: string) => void;
    onDragEnd: (event: DragEndEvent) => void;
    selectedElementId: string | null;
    onSelectElement: (id: string) => void;
}

const BuilderCanvas = ({
    elements,
    backgroundUrl,
    onBackgroundChange,
    onDragEnd,
    selectedElementId,
    onSelectElement
}: BuilderCanvasProps) => {
    const { setNodeRef } = useDroppable({
        id: 'canvas',
    });

    // Reference to container to calculate relative positions
    const containerRef = useRef<HTMLDivElement>(null);

    // This wrapper ensures we are dropping RELATIVE to the canvas, not the window. 
    // Actual coordinate logic needs to be handled in the parent's onDragEnd using the delta.

    return (
        <div className="flex-1 flex flex-col items-center gap-4 p-8 bg-muted/20 overflow-auto min-h-[600px]">
            {/* Background Uploader if empty */}
            {!backgroundUrl && (
                <div className="w-full max-w-xl p-12 border-2 border-dashed border-muted-foreground/20 rounded-xl flex flex-col items-center justify-center gap-4 bg-background">
                    <p className="font-cairo text-muted-foreground">صورة خلفية الشهادة</p>
                    <SingleImageUpload
                        value={backgroundUrl}
                        onChange={onBackgroundChange}
                        onRemove={() => onBackgroundChange("")}
                    />
                </div>
            )}

            {/* The Canvas */}
            {backgroundUrl && (
                <DndContext onDragEnd={onDragEnd}>
                    <div
                        ref={(node) => {
                            setNodeRef(node);
                            // @ts-ignore
                            containerRef.current = node;
                        }}
                        className="relative shadow-2xl bg-white overflow-hidden transition-all duration-300"
                        style={{
                            width: '842px', // A4 Landscape roughly at 96 DPI
                            height: '595px',
                            backgroundImage: `url(${backgroundUrl})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                        onClick={() => onSelectElement('')} // Deselect on click canvas
                    >
                        {elements.map((el) => (
                            <DraggableElement
                                key={el.id}
                                id={el.id}
                                element={el}
                                isSelected={el.id === selectedElementId}
                                onSelect={onSelectElement}
                            />
                        ))}
                    </div>
                </DndContext>
            )}

            {backgroundUrl && (
                <div className="text-xs text-muted-foreground font-mono mt-2">
                    A4 Landscape (842px x 595px)
                </div>
            )}
        </div>
    );
};

export default BuilderCanvas;
