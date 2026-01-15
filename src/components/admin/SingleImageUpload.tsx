import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from "@/components/ui/button";
import { X, Upload, Loader2, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface SingleImageUploadProps {
    value: string;
    onChange: (value: string) => void;
    onRemove: () => void;
    disabled?: boolean;
    label?: string;
    maxSizeMB?: number;
}

const SingleImageUpload: React.FC<SingleImageUploadProps> = ({
    value,
    onChange,
    onRemove,
    disabled,
    label = "اضغط أو اسحب ملف للرفع",
    maxSizeMB = 10
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;

        setIsLoading(true);
        try {
            const file = acceptedFiles[0];

            // Check file size
            if (file.size > maxSizeMB * 1024 * 1024) {
                alert(`حجم الملف أكبر من ${maxSizeMB} ميجابايت`);
                setIsLoading(false);
                return;
            }

            setFileName(file.name);
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
    }, [onChange, maxSizeMB]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        // Accept any file type
        disabled: disabled || isLoading,
        multiple: false,
        maxSize: maxSizeMB * 1024 * 1024
    });

    const isImage = value && (value.startsWith('data:image') || value.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i));
    const isPDF = value && value.startsWith('data:application/pdf');

    return (
        <div className="space-y-4">
            {value ? (
                <div className="relative rounded-lg overflow-hidden border border-border group max-w-sm mx-auto">
                    <div className="absolute top-2 right-2 z-10">
                        <Button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemove();
                                setFileName(null);
                            }}
                            variant="destructive"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                    {isImage ? (
                        <div className="aspect-video">
                            <img
                                src={value}
                                alt="Uploaded"
                                className="object-cover w-full h-full"
                            />
                        </div>
                    ) : (
                        <div className="p-6 flex flex-col items-center gap-2 bg-secondary/20">
                            <FileText className="h-12 w-12 text-gold" />
                            <p className="text-sm text-muted-foreground font-cairo truncate max-w-full">
                                {fileName || (isPDF ? "ملف PDF" : "ملف مرفق")}
                            </p>
                            <p className="text-xs text-muted-foreground/60 font-cairo">تم رفع الملف بنجاح</p>
                        </div>
                    )}
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
                            <p>افلت الملف هنا</p>
                        ) : (
                            <p>{label}</p>
                        )}
                        <p className="text-xs mt-1 text-muted-foreground/60">أي نوع ملف (حد أقصى {maxSizeMB} ميجا)</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SingleImageUpload;
