import { createInertiaApp } from '@inertiajs/react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import HikerBestLayout from '@/layouts/hikerbest-layout';
import SettingsLayout from '@/layouts/settings/layout';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Kumpulkan halaman milik aplikasi utama dan halaman milik setiap modul
const pages = import.meta.glob<any>([
    './pages/**/*.tsx',
    '../../Modules/*/resources/js/pages/**/*.tsx',
]);

void createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: async (name) => {
        let path: string;

        // Halaman modul ditulis dengan format NamaModul::nama-halaman
        if (name.includes('::')) {
            const [module, page] = name.split('::');
            path = `../../Modules/${module}/resources/js/pages/${page}.tsx`;
        } else {
            path = `./pages/${name}.tsx`;
        }

        const importPage = pages[path];

        if (!importPage) {
            throw new Error(`Halaman tidak ditemukan: ${name}`);
        }

        return await importPage();
    },
    layout: (name) => {
        switch (true) {
            // Halaman auth lain (lupa password dan sejenisnya) tetap memakai layout bawaan
            case name.startsWith('auth/') && name !== 'auth/login' && name !== 'auth/register':
                return AuthLayout;
            case name.startsWith('settings/'):
            case name.startsWith('teams/'):
                return [AppLayout, SettingsLayout];
            // Halaman depan, login, register, dashboard, profil, dan semua halaman modul
            default:
                return HikerBestLayout;
        }
    },
    strictMode: true,
    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                {app}
                <Toaster />
            </TooltipProvider>
        );
    },
    progress: {
        color: '#3ddc97',
    },
});

// This will set light / dark mode on load...
initializeTheme();