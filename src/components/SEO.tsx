
import { Helmet } from "react-helmet-async";

interface SEOProps {
    title: string;
    description?: string;
    image?: string;
    url?: string;
    type?: "website" | "article" | "product";
    keywords?: string;
    schema?: object;
}

const SEO = ({
    title,
    description = "تعلم فن الخط العربي بأسلوب عصري من كبار الخطاطين. دورات تعليمية شاملة، تصميم شجره العائله،أدوات احترافية، وشهادات معتمدة من بيت الخط العربي.",
    image = "/logo.webp",
    url = "https://baytalkhattal-arabi.com",
    type = "website",
    keywords,
    schema
}: SEOProps) => {
    const siteTitle = "بيت الخط العربي | Bayt Al Khatt Al Arabi";
    const fullTitle = `${title} | بيت الخط العربي`;
    const domain = "https://baytalkhattal-arabi.com"; // Replace with actual Vercel domain if different
    const youtubeChannel = "https://www.youtube.com/@Bayt_Alkhatt_Ar";
    const legacyDomain = "https://baytalkhatt.com/";

    // Organization Schema for Knowledge Graph
    const baseSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "بيت الخط العربي",
        "alternateName": "Bayt Al Khatt Al Arabi",
        "url": domain,
        "logo": `${domain}${image}`,
        "sameAs": [
            youtubeChannel,
            legacyDomain,
            "https://twitter.com/Bayt_Alkhatt_Ar",
            "https://instagram.com/Bayt_Alkhatt_Ar"
        ]
    };

    const finalSchema = schema || baseSchema;

    return (
        <Helmet>
            {/* Standard Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords} />}
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta charSet="utf-8" />
            <link rel="canonical" href={url} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:site_name" content={siteTitle} />
            <meta property="og:locale" content="ar_SA" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:creator" content="@Bayt_Alkhatt_Ar" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            {/* Schema.org for Google Knowledge Graph */}
            <script type="application/ld+json">
                {JSON.stringify(finalSchema)}
            </script>
        </Helmet>
    );
};

export default SEO;
