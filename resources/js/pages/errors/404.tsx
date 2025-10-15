import { Button } from '@/components/ui/Button';
import { Head, Link } from '@inertiajs/react';

interface Props {
    error?: string;
}

export default function NotFound({ error = 'Page not found' }: Props) {
    return (
        <>
            <Head title="404 - Not Found" />
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="w-full max-w-md text-center">
                    <div className="mb-8">
                        <h1 className="text-9xl font-bold text-gray-300">
                            404
                        </h1>
                        <h2 className="mb-2 text-2xl font-semibold text-gray-900">
                            Page Not Found
                        </h2>
                        <p className="mb-8 text-gray-600">{error}</p>
                    </div>

                    <div className="space-y-4">
                        <Link href="/dashboard">
                            <Button className="w-full">Go to Dashboard</Button>
                        </Link>
                        <Link href="/" className="block">
                            <Button variant="outline" className="w-full">
                                Go Home
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
