
import { forwardRef } from "react";
// Using a simple component structure that can be printed
// Note: In a real app, we might use @react-pdf/renderer for generating actual PDFs,
// but for now we'll create a printable HTML component.

interface CertificateProps {
    studentName: string;
    courseName: string;
    date: Date;
    certificateId: string;
}

const Certificate = forwardRef<HTMLDivElement, CertificateProps>(({ studentName, courseName, date, certificateId }, ref) => {
    return (
        <div
            ref={ref}
            className="w-[1123px] h-[794px] bg-[#fff] relative overflow-hidden flex flex-col items-center text-center font-amiri text-foreground shadow-2xl"
            style={{
                direction: 'rtl'
            }}
        >
            {/* Background Pattern & Gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-neutral-50 to-neutral-100 z-0" />

            {/* Inner Border Frame - Double Line */}
            <div className="absolute inset-6 border-[3px] border-[#D4AF37] z-10" />
            <div className="absolute inset-8 border border-[#D4AF37]/50 z-10" />

            {/* Corner Ornaments - Islamic Star Pattern CSS */}
            <div className="absolute top-6 left-6 w-32 h-32 z-20 pointer-events-none">
                <svg viewBox="0 0 100 100" className="w-full h-full text-[#D4AF37] fill-current opacity-80">
                    <path d="M0,0 L40,0 L0,40 Z" />
                </svg>
            </div>
            <div className="absolute top-6 right-6 w-32 h-32 z-20 pointer-events-none rotate-90">
                <svg viewBox="0 0 100 100" className="w-full h-full text-[#D4AF37] fill-current opacity-80">
                    <path d="M0,0 L40,0 L0,40 Z" />
                </svg>
            </div>
            <div className="absolute bottom-6 left-6 w-32 h-32 z-20 pointer-events-none -rotate-90">
                <svg viewBox="0 0 100 100" className="w-full h-full text-[#D4AF37] fill-current opacity-80">
                    <path d="M0,0 L40,0 L0,40 Z" />
                </svg>
            </div>
            <div className="absolute bottom-6 right-6 w-32 h-32 z-20 pointer-events-none rotate-180">
                <svg viewBox="0 0 100 100" className="w-full h-full text-[#D4AF37] fill-current opacity-80">
                    <path d="M0,0 L40,0 L0,40 Z" />
                </svg>
            </div>

            {/* Content Container */}
            <div className="relative z-30 flex flex-col h-full w-full px-24 py-16 justify-between">

                {/* Header */}
                <div className="flex flex-col items-center gap-2 pt-6">
                    <img src="/logo.webp" alt="Bayt Al Khatt" className="h-20 opacity-90 drop-shadow-sm" />
                    <div className="flex flex-col items-center gap-0">
                        <h1 className="text-4xl font-bold text-[#b48811] tracking-wide drop-shadow-sm font-amiri">شــهادة إتـمـام</h1>
                        <p className="text-xs text-[#056d6a]/70 uppercase tracking-[0.4em] font-cairo font-bold mt-1">Certificate of Completion</p>
                    </div>
                </div>

                {/* Main Body */}
                <div className="flex-1 flex flex-col items-center justify-start pt-4 gap-4">
                    <p className="text-lg text-neutral-500 font-cairo">تشهد إدارة بيت الخط العربي بأن الطالب</p>

                    <div className="relative py-2">
                        <h2 className="text-5xl font-bold text-[#1a365d] px-12 relative z-10 leading-tight font-amiri">
                            {studentName}
                        </h2>
                        {/* Underline Decoration */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
                    </div>

                    <p className="text-lg text-neutral-500 font-cairo">قد أتم بنجاح متطلبات الدورة التدريبية</p>

                    <h3 className="text-3xl font-bold text-[#056d6a] drop-shadow-sm bg-[#f8f9fa] px-8 py-2 rounded-full border border-[#056d6a]/10 font-amiri">
                        {courseName}
                    </h3>

                    <p className="text-base text-neutral-400 font-cairo max-w-3xl text-center leading-relaxed px-8 mt-2">
                        منحت هذه الشهادة تقديراً للالتزام والتفوق في إتمام المنهج المقرر واجتياز التطبيقات العملية بنجاح
                    </p>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-end w-full pb-12 px-12 mt-auto relative z-40">
                    {/* Signature */}
                    <div className="text-center">
                        <div className="h-16 flex items-end justify-center mb-1">
                            <img src="/signature.png" alt="Signature" className="h-14 opacity-80" onError={(e) => e.currentTarget.style.display = 'none'} />
                        </div>
                        <div className="border-t-2 border-[#D4AF37]/30 pt-1 w-40">
                            <p className="font-bold text-[#1a365d] text-lg font-amiri">أ. محمد بيومي</p>
                            <p className="text-xs text-neutral-500 font-cairo">مدير الأكاديمية</p>
                        </div>
                    </div>

                    {/* Badge / Seal placeholder (Center) */}
                    <div className="opacity-5 absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none">
                        <AwardIcon className="w-64 h-64 text-[#D4AF37]" />
                    </div>

                    {/* Verification */}
                    <div className="flex flex-col items-center gap-2">
                        <div className="bg-white p-1 border-2 border-[#D4AF37] rounded-lg shadow-sm">
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${window.location.origin}/verify/${certificateId}`}
                                alt="QR Code"
                                className="w-20 h-20 object-contain"
                            />
                        </div>
                        <div className="text-center bg-[#f8f9fa] px-3 py-1 rounded border border-neutral-200">
                            <p className="text-[10px] text-neutral-500 font-mono tracking-widest font-bold mb-0.5">SERIAL NUMBER</p>
                            <p className="text-xs text-[#1a365d] font-mono font-bold tracking-wider">{certificateId}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

// Simple SVG Component for the background seal
const AwardIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
    </svg>
);

Certificate.displayName = "Certificate";

export default Certificate;
