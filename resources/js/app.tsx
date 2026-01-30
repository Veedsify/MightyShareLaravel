import '@fontsource-variable/geist';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import '../css/app.css';
import { Helmet } from 'react-helmet';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <>
                <Helmet>
                    <title>MightyShare Charity Foundation</title>
                    <meta
                        name="description"
                        content="MightyShare Charity Foundation is a non-profit organization that provides financial assistance to individuals and families in need."
                    />
                </Helmet>
                <Toaster />
                <App {...props} />
            </>,
        );
    },
    progress: {
        color: '#4B5563',
    },
});
