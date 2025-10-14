import { cn } from '@/lib/utils';
import { Quote } from 'lucide-react';

interface TestimonialCardProps {
    content: string;
    author: string;
    role: string;
    image?: string;
    className?: string;
}

export const TestimonialCard = ({
    content,
    author,
    role,
    image,
    className,
}: TestimonialCardProps) => {
    return (
        <div
            className={cn(
                'group relative rounded-2xl border border-slate-200 bg-white p-8 shadow-lg transition-all hover:-translate-y-2 hover:border-cyan-400/40 hover:shadow-2xl',
                className,
            )}
        >
            {/* Background on hover */}
            <div className="absolute inset-0 rounded-2xl bg-cyan-400/0 opacity-0 transition-opacity group-hover:opacity-5" />

            <div className="relative">
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-full bg-pink-50">
                    <Quote className="h-6 w-6 text-pink-500" />
                </div>
                <p className="mb-8 text-base leading-relaxed text-muted-foreground italic">
                    {content}
                </p>
                <div className="flex items-center gap-4 border-t border-slate-100 pt-4">
                    {image ? (
                        <img
                            src={image}
                            alt={author}
                            className="h-14 w-14 rounded-full object-cover ring-2 ring-slate-100 transition-all group-hover:ring-cyan-400/30"
                        />
                    ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-cyan-400 text-lg font-bold text-blue-900 shadow-md transition-all group-hover:shadow-lg">
                            {author.charAt(0)}
                        </div>
                    )}
                    <div>
                        <p className="font-bold text-foreground">{author}</p>
                        <p className="text-sm text-muted-foreground">{role}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
