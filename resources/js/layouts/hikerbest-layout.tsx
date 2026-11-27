import { Link, router, usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { useSharedProps } from '@/hooks/use-shared-props';

type NavLink = { title: string; href: string; match: string[] };

function isActive(url: string, prefixes: string[]): boolean {
    const path = url.split('?')[0];

    return prefixes.some((prefix) => path === prefix || path.startsWith(prefix + '/'));
}

export default function HikerBestLayout({ children }: { children: ReactNode }) {
    const { url } = usePage();
    const { user, isAdmin } = useSharedProps();

    const links: NavLink[] = [
        { title: 'Gunung', href: '/gunung', match: ['/gunung', '/admin/gunung'] },
        { title: 'Booking', href: '/booking', match: ['/booking'] },
        // Menu Peralatan hanya tampil untuk admin
        ...(isAdmin ? [{ title: 'Peralatan', href: '/peralatan', match: ['/peralatan'] }] : []),
        { title: 'Profil', href: '/profil', match: ['/profil'] },
    ];

    return (
        <div className="hb-shell">
            <div className="hb-bg" style={{ backgroundImage: "url('/images/bg.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }} aria-hidden="true" />
            <div className="hb-overlay" aria-hidden="true" />
            <div className="hb-aura hb-aura-1" aria-hidden="true" />
            <div className="hb-aura hb-aura-2" aria-hidden="true" />

            <header className="hb-header">
                <Link href={user ? '/dashboard' : '/'} className="hb-brand">
                    Hiker<span>Best</span>
                </Link>

                <nav className="hb-nav">
                    {user ? (
                        <>
                            {links.map((link) => (
                                <Link key={link.href} href={link.href} className={isActive(url, link.match) ? 'active' : undefined}>
                                    {link.title}
                                </Link>
                            ))}
                            <button type="button" onClick={() => router.post('/logout')}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className={isActive(url, ['/login']) ? 'active' : undefined}>
                                Login
                            </Link>
                            <Link href="/register" className={isActive(url, ['/register']) ? 'active' : undefined}>
                                Register
                            </Link>
                        </>
                    )}
                </nav>
            </header>

            <main className="hb-main">{children}</main>

            <footer className="hb-footer">&copy; 2026 HikerBest</footer>
        </div>
    );
}