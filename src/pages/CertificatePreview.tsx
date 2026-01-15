
import Certificate from "@/components/Certificate";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

const CertificatePreview = () => {

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-background flex flex-col relative">
            <style>
                {`
                    @media print {
                        @page {
                            size: landscape;
                            margin: 0;
                        }
                        body {
                            margin: 0;
                            padding: 0;
                            background: white;
                        }
                        .no-print {
                            display: none !important;
                        }
                        .print-content {
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            margin: 0;
                            padding: 0;
                            display: flex;
                            justify-content: center;
                            items-align: center;
                            background: white;
                        }
                        /* Scale down if needed to fit standard A4 margins if printer acts up */
                        .certificate-container {
                            transform: scale(0.95);
                            transform-origin: center;
                        }
                    }
                `}
            </style>

            <div className="no-print">
                <Navbar />
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-8 pt-24 gap-8 no-print">
                <div className="flex flex-col items-center gap-4">
                    <h1 className="text-2xl font-bold font-amiri text-gold-gradient">معاينة الشهادة</h1>
                    <p className="text-muted-foreground font-cairo">هذا نموذج لكيفية ظهور الشهادة عند الطباعة</p>
                    <Button onClick={handlePrint} className="btn-gold gap-2 font-cairo">
                        طباعة / تحميل PDF
                    </Button>
                </div>

                <div className="border border-border shadow-2xl overflow-auto max-w-full">
                    <Certificate
                        studentName="أحمد محمد علي"
                        courseName="دورة خط النسخ للمبتدئين"
                        date={new Date()}
                        certificateId="CERT-TEST-123456"
                    />
                </div>
            </div>

            {/* Hidden Print Content */}
            <div className="hidden print:flex print-content justify-center items-center h-screen w-screen bg-white">
                <div className="certificate-container">
                    <Certificate
                        studentName="أحمد محمد علي"
                        courseName="دورة خط النسخ للمبتدئين"
                        date={new Date()}
                        certificateId="CERT-TEST-123456"
                    />
                </div>
            </div>
        </div>
    );
};

export default CertificatePreview;
