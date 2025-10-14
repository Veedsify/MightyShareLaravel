import { cn } from '@/lib/utils';

interface SectionProps {
    children: React.ReactNode;
    className?: string;
    id?: string;
}

export const Section = ({ children, className, id }: SectionProps) => {
    return (
        <section id={id} className={cn('py-20 md:py-32', className)}>
            {children}
        </section>
    );
};
