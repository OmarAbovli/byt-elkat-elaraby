
import { ChevronLeft, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
    return (
        <nav className="flex items-center text-sm text-muted-foreground font-cairo mb-6">
            <Link
                to="/"
                className="flex items-center hover:text-primary transition-colors"
            >
                <Home className="w-4 h-4 ml-1" />
                <span>الرئيسية</span>
            </Link>

            {items.map((item, index) => (
                <div key={index} className="flex items-center">
                    <ChevronLeft className="w-4 h-4 mx-2 text-muted-foreground/50" />
                    {item.href ? (
                        <Link
                            to={item.href}
                            className="hover:text-primary transition-colors"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-foreground font-medium">
                            {item.label}
                        </span>
                    )}
                </div>
            ))}
        </nav>
    );
};

export default Breadcrumbs;
