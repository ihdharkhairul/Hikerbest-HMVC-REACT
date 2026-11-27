import { Head, Link } from '@inertiajs/react';
import { CalendarCheck, Mountain, Tent } from 'lucide-react';
import { HbBadge } from '@/components/hb-badge';
import { useSharedProps } from '@/hooks/use-shared-props';

export default function Dashboard() {
    const { user, isAdmin } = useSharedProps();

    const tiles = [
        { icon: Mountain, title: 'Gunung', text: 'Lihat daftar gunung dan detail jalur pendakian.', href: '/gunung' },
        { icon: CalendarCheck, title: 'Booking', text: 'Kelola booking pendakian dan bukti pembayaran.', href: '/booking' },
        // Peralatan hanya untuk admin
        ...(isAdmin ? [{ icon: Tent, title: 'Peralatan', text: 'Kelola stok dan kondisi peralatan pendakian.', href: '/peralatan' }] : []),
    ];

    return (
        <>
            <Head title="Dashboard" />

            <div className="hb-top">
                <h1>
                    Halo, <span className="hb-accent">{user.name}</span>!
                </h1>
                <HbBadge value={isAdmin ? 'Admin' : 'User'} />
            </div>

            <p className="hb-muted" style={{ marginBottom: 24 }}>
                Selamat datang di HikerBest. Pilih menu di bawah untuk mulai.
            </p>

            <div className="hb-grid">
                {tiles.map((tile) => (
                    <Link key={tile.href} href={tile.href} className="hb-tile">
                        <tile.icon className="size-8 text-[#3ddc97]" />
                        <h3>{tile.title}</h3>
                        <p>{tile.text}</p>
                    </Link>
                ))}
            </div>
        </>
    );
}