import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from "@/components/ui/button";
import { X, Upload, Loader2, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
    value: string[];
    onChange: (value: string[]) => void;
    onRemove: (value: string) => void;
    disabled?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    value,
    onChange,
    onRemove,
    disabled
}) => {
    const [isLoading, setIsLoading] = useState(false);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        setIsLoading(true);
        try {
            const newImages: string[] = [];

            for (const file of acceptedFiles) {
                const reader = new FileReader();
                const result = await new Promise<string>((resolve, reject) => {
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
                newImages.push(result);
            }

            onChange([...value, ...newImages]);
        } catch (error) {
            console.error("Error reading files:", error);
        } finally {
            setIsLoading(false);
        }
    }, [onChange, value]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': [],
            'image/png': [],
            'image/webp': []
        },
        disabled: disabled || isLoading,
        multiple: true
    });

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
                {value.map((url, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-border group">
                        <div className="absolute top-2 right-2 z-10">
                            <Button
                                type="button"
                                onClick={() => onRemove(url)}
                                variant="destructive"
                                size="icon"
                                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <img
                            src={url}
                            alt="Product"
                            className="object-cover w-full h-full"
                        />
                    </div>
                ))}
            </div>

            <div
                {...getRootProps()}
                className={cn(
                    "border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors",
                    isDragActive ? "border-gold bg-gold/5" : "border-border hover:bg-secondary/50",
                    (disabled || isLoading) && "opacity-50 cursor-not-allowed"
                )}
            >
                <input {...getInputProps()} />
                {isLoading ? (
                    <Loader2 className="h-8 w-8 animate-spin text-gold" />
                ) : (
                    <Upload className="h-8 w-8 text-muted-foreground" />
                )}
                <div className="text-sm text-center text-muted-foreground">
                    {isDragActive ? (
                        <p>افلت الصور هنا</p>
                    ) : (
                        <p>اضغط أو اسحب الصور هنا للرفع</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImageUpload;
