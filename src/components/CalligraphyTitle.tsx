import { motion } from "framer-motion";
import { useId } from "react";

interface CalligraphyTitleProps {
    className?: string;
    size?: "sm" | "md" | "lg";
}

const CalligraphyTitle = ({ className = "", size = "md" }: CalligraphyTitleProps) => {
    const id = useId();
    const maskId = `mask-${id}`;
    const glowId = `glow-${id}`;
    const gradientId = `grad-${id}`;
    const bevelId = `bevel-${id}`;

    const config = size === "lg"
        ? { viewBox: "0 0 1000 400", x: 500, y: 200, fontSize: 130, strokeWidth: 400, underlineY: 340 }
        : size === "md"
            ? { viewBox: "0 0 500 200", x: 250, y: 100, fontSize: 65, strokeWidth: 200, underlineY: 170 }
            : { viewBox: "0 0 300 120", x: 150, y: 60, fontSize: 35, strokeWidth: 100, underlineY: 95 };

    return (
        <div className={`relative inline-block ${className}`}>
            <svg
                viewBox={config.viewBox}
                className="w-full h-full overflow-visible"
                preserveAspectRatio="xMidYMid meet"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    {/* Premium Glow & 3D Bevel Filter */}
                    <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>

                    <filter id={bevelId}>
                        <feGaussianBlur stdDeviation="1" result="blur" />
                        <feSpecularLighting in="blur" surfaceScale="5" specularConstant="0.75" specularExponent="20" lightingColor="#ffffff" result="specOut">
                            <fePointLight x="-5000" y="-10000" z="20000" />
                        </feSpecularLighting>
                        <feComposite in="specOut" in2="SourceGraphic" operator="in" result="specOut" />
                        <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
                    </filter>

                    <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8A6E2F" />
                        <stop offset="25%" stopColor="#D4AF37" />
                        <stop offset="50%" stopColor="#FFF9E3" />
                        <stop offset="75%" stopColor="#D4AF37" />
                        <stop offset="100%" stopColor="#8A6E2F" />
                    </linearGradient>

                    <mask id={maskId}>
                        <motion.path
                            d={`M ${config.x + 400} ${config.y} L ${config.x - 400} ${config.y}`}
                            fill="none"
                            stroke="white"
                            strokeWidth={config.strokeWidth}
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 2.5, ease: "easeInOut" }}
                        />
                    </mask>
                </defs>

                {/* Canonical Calligraphic Tashkeel (Vocalizations Only) */}
                <g fill="none" stroke={`url(#${gradientId})`} strokeWidth={size === "lg" ? "5" : "2.5"} strokeLinecap="round" filter={`url(#${bevelId})`}>

                    {/* --- بَيْتُ (Baytu) --- */}
                    {/* بَ (Fatha over Ba) */}
                    <motion.path
                        d={size === "lg" ? "M 830 140 L 850 125" : "M 415 70 L 425 62"}
                        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ delay: 2 }}
                    />
                    {/* يْ (Sukun over Ya) */}
                    <motion.circle
                        cx={size === "lg" ? 780 : 390} cy={size === "lg" ? 130 : 65} r={size === "lg" ? 8 : 4}
                        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ delay: 2.2 }}
                    />
                    {/* تُ (Damma over Ta) - Clear small waw shape */}
                    <motion.path
                        d={size === "lg" ? "M 700 130 A 8 8 0 1 1 708 138 C 708 145, 700 155, 695 160" : "M 350 65 A 4 4 0 1 1 354 69 C 354 72, 350 77, 347 80"}
                        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ delay: 2.4 }}
                    />

                    {/* --- الخَطِّ (al-Khatt) --- */}
                    {/* خَ (Fatha over Kha) */}
                    <motion.path
                        d={size === "lg" ? "M 570 140 L 590 125" : "M 285 70 L 295 62"}
                        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ delay: 2.6 }}
                    />
                    {/* طِّ (Shadda & Kasra for Ta) */}
                    <motion.path
                        d={size === "lg" ? "M 510 135 Q 515 125 520 135 Q 525 125 530 135" : "M 255 67 Q 257 62 260 67 Q 262 62 265 67"}
                        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ delay: 2.8 }}
                    />
                    <motion.path
                        d={size === "lg" ? "M 510 260 L 530 250" : "M 255 130 L 265 125"}
                        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ delay: 3.0 }}
                    />

                    {/* --- العَرَبِيِّ (al-'Arabi) --- */}
                    {/* عَ (Fatha over Ayn) */}
                    <motion.path
                        d={size === "lg" ? "M 340 140 L 360 125" : "M 170 70 L 180 62"}
                        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ delay: 3.2 }}
                    />
                    {/* رَ (Fatha over Ra) */}
                    <motion.path
                        d={size === "lg" ? "M 270 150 L 290 135" : "M 135 75 L 145 67"}
                        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ delay: 3.4 }}
                    />
                    {/* بِ (Kasra under Ba) */}
                    <motion.path
                        d={size === "lg" ? "M 210 270 L 230 260" : "M 105 135 L 115 130"}
                        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ delay: 3.6 }}
                    />
                    {/* يِّ (Shadda & Kasra for final Ya) */}
                    <motion.path
                        d={size === "lg" ? "M 125 135 Q 130 125 135 135 Q 140 125 145 135" : "M 62 67 Q 65 62 67 67 Q 70 62 72 67"}
                        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ delay: 3.8 }}
                    />
                    <motion.path
                        d={size === "lg" ? "M 125 270 L 145 260" : "M 62 135 L 72 130"}
                        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ delay: 4.0 }}
                    />
                </g>

                {/* The Main Text */}
                <motion.text
                    x={config.x}
                    y={config.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    mask={`url(#${maskId})`}
                    fill={`url(#${gradientId})`}
                    fontSize={config.fontSize}
                    className="font-amiri font-bold"
                    style={{
                        filter: `url(#${bevelId})`,
                        direction: "rtl",
                        textShadow: "0 10px 20px rgba(0,0,0,0.5)"
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    بيت الخط العربي
                </motion.text>

                {/* Animated Calligraphic underline */}
                <motion.path
                    d={`M ${config.x - 300} ${config.underlineY} C ${config.x - 150} ${config.underlineY + 20}, ${config.x + 150} ${config.underlineY - 20}, ${config.x + 300} ${config.underlineY}`}
                    fill="none"
                    stroke={`url(#${gradientId})`}
                    strokeWidth="4"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.4 }}
                    transition={{ delay: 1.8, duration: 1.2 }}
                />
            </svg>

            {/* Fallback for SEO - hidden text */}
            <span className="sr-only">بيت الخط العربي</span>
        </div>
    );
};

export default CalligraphyTitle;
