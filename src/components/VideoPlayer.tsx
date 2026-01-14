import { useState } from "react";
import { Loader2, PlayCircle } from "lucide-react";

interface VideoPlayerProps {
    url: string;
    title?: string;
}

const VideoPlayer = ({ url, title }: VideoPlayerProps) => {
    const [isLoading, setIsLoading] = useState(true);

    // Basic detection for Bunny.net - if it's just an ID, we might need a library ID too.
    // For now, assume url is the full embed URL provided by bunny.net if it starts with http
    // Otherwise, we might treat it as a specific ID.

    const isBunny = url.includes("mediadelivery.net") || url.includes("bunny");

    return (
        <div className="relative aspect-video w-full bg-black rounded-2xl overflow-hidden shadow-2xl group border border-gold/20">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center z-10 bg-obsidian-dark">
                    <Loader2 className="w-10 h-10 animate-spin text-gold" />
                </div>
            )}

            {url ? (
                <iframe
                    src={url}
                    loading="lazy"
                    style={{ border: 0, position: "absolute", top: 0, height: "100%", width: "100%" }}
                    allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
                    allowFullScreen={true}
                    onLoad={() => setIsLoading(false)}
                    title={title}
                ></iframe>
            ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                    <PlayCircle className="w-16 h-16 opacity-20 mb-4" />
                    <p className="font-cairo text-sm">الفيديو غير متوفر حالياً</p>
                </div>
            )}

            {/* Aesthetic overlay for branding if needed */}
            <div className="absolute top-4 right-4 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-gold/30">
                    <span className="text-gold text-[10px] font-bold tracking-widest uppercase font-cairo">بيت الخط العربي</span>
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;
