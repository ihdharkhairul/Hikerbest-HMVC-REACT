import { Head, Link } from '@inertiajs/react';
import { CalendarCheck, Mountain, Tent } from 'lucide-react';
import { useSharedProps } from '@/hooks/use-shared-props';

const features = [
    {
        icon: Mountain,
        title: 'Informasi Gunung',
        text: 'Lihat daftar gunung beserta lokasi, ketinggian, tingkat kesulitan, dan harga tiket pendakian.',
    },
    {
        icon: CalendarCheck,
        title: 'Booking Pendakian',
        text: 'Pesan jadwal pendakian dan unggah bukti pembayaran langsung dari satu halaman.',
    },
    {
        icon: Tent,
        title: 'Peralatan Pendakian',
        text: 'Kelola persediaan tenda, carrier, dan perlengkapan pendakian beserta kondisinya.',
    },
];

export default function Welcome() {
    const { user } = useSharedProps();

    return (
        <>
            <Head title="HikerBest" />

            <section className="hb-hero">
                <span className="hb-pill">Platform Pendakian Gunung</span>
                <h1>
                    Rencanakan pendakian <span className="hb-accent">terbaikmu</span> bersama HikerBest
                </h1>
                <p>Temukan gunung, pesan jadwal pendakian, dan siapkan peralatan dalam satu aplikasi.</p>
                <div className="hb-cta">
                    {user ? (
                        <Link href="/gunung" className="hb-btn hb-glow">
                            Lihat Gunung
                        </Link>
                    ) : (
                        <>
                            <Link href="/register" className="hb-btn hb-glow">
                                Mulai Sekarang
                            </Link>
                            <Link href="/login" className="hb-btn hb-btn-light">
                                Sudah punya akun? Login
                            </Link>
                        </>
                    )}
                </div>
            </section>

            <section className="hb-grid">
                {features.map((feature) => (
                    <div key={feature.title} className="hb-tile">
                        <feature.icon className="size-8 text-[#3ddc97]" />
                        <h3>{feature.title}</h3>
                        <p>{feature.text}</p>
                    </div>
                ))}
            </section>
        </>
    );
}