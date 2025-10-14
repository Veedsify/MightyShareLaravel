import { cn } from '@/lib/utils';

interface SectionHeadingProps {
    title: string;
    subtitle?: string;
    description?: string;
    className?: string;
    centered?: boolean;
}

export const SectionHeading = ({
    title,
    subtitle,
    description,
    className,
    centered = false,
}: SectionHeadingProps) => {
    return (
        <div
            className={cn(
                'mb-12 md:mb-16',
                centered ? 'text-center' : '',
                className,
            )}
        >
            {subtitle && (
                <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-pink-500">
                    {subtitle}
                </p>
            )}
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                {title}
            </h2>
            {description && (
                <p
                    className={cn(
                        'text-lg text-muted-foreground',
                        centered ? 'mx-auto max-w-2xl' : 'max-w-3xl',
                    )}
                >
                    {description}
                </p>
            )}
        </div>
    );
};
