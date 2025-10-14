import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    className?: string;
}

export const FeatureCard = ({
    icon: Icon,
    title,
    description,
    className,
}: FeatureCardProps) => {
    return (
        <div
            className={cn(
                'group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 transition-all hover:-translate-y-2 hover:border-cyan-400/40 hover:shadow-2xl',
                className,
            )}
        >
            {/* Subtle overlay on hover */}
            <div className="absolute inset-0 bg-cyan-400/0 opacity-0 transition-opacity group-hover:opacity-5" />

            <div className="relative">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 transition-all group-hover:scale-110 group-hover:bg-cyan-400/10 group-hover:shadow-md">
                    <Icon className="h-7 w-7 text-blue-900 transition-colors group-hover:text-cyan-600" />
                </div>
                <h3 className="mb-3 text-xl font-bold">{title}</h3>
                <p className="leading-relaxed text-muted-foreground">
                    {description}
                </p>
            </div>
        </div>
    );
};
