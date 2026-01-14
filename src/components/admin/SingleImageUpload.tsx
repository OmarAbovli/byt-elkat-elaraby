import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from "@/components/ui/button";
import { X, Upload, Loader2, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SingleImageUploadProps {
    value: string;
    onChange: (value: string) => void;
    onRemove: () => void;
    disabled?: boolean;
    label?: string;
}

const SingleImageUpload: React.FC<SingleImageUploadProps> = ({
    value,
    onChange,
    onRemove,
    disabled,
    label = "اضغط أو اسحب صورة للرفع"
}) => {
    const [isLoading, setIsLoading] = useState(false);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;

        setIsLoading(true);
        try {
            const file = acceptedFiles[0];
            const reader = new FileReader();
            const result = await new Promise<string>((resolve, reject) => {
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
            onChange(result);
        } catch (error) {
            console.error("Error reading file:", error);
        } finally {
            setIsLoading(false);
        }
    }, [onChange]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': [],
            'image/png': [],
            'image/webp': [],
            'image/svg+xml': []
        },
        disabled: disabled || isLoading,
        multiple: false
    });

    return (
        <div className="space-y-4">
            {value ? (
                <div className="relative aspect-video rounded-lg overflow-hidden border border-border group max-w-sm mx-auto">
                    <div className="absolute top-2 right-2 z-10">
                        <Button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemove();
                            }}
                            variant="destructive"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                    <img
                        src={value}
                        alt="Uploaded"
                        className="object-cover w-full h-full"
                    />
                </div>
            ) : (
                <div
                    {...getRootProps()}
                    className={cn(
                        "border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all",
                        isDragActive ? "border-gold bg-gold/5" : "border-border hover:bg-secondary/50",
                        (disabled || isLoading) && "opacity-50 cursor-not-allowed"
                    )}
                >
                    <input {...getInputProps()} />
                    {isLoading ? (
                        <Loader2 className="h-10 w-10 animate-spin text-gold" />
                    ) : (
                        <Upload className="h-10 w-10 text-muted-foreground" />
                    )}
                    <div className="text-sm text-center text-muted-foreground font-cairo">
                        {isDragActive ? (
                            <p>افلت الصورة هنا</p>
                        ) : (
                            <p>{label}</p>
                        )}
                        <p className="text-xs mt-1 text-muted-foreground/60">JPG, PNG, WebP (Max 5MB)</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SingleImageUpload;
