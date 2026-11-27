import { Head, Link } from '@inertiajs/react';
import { HbBadge } from '@/components/hb-badge';
import { useSharedProps } from '@/hooks/use-shared-props';

export default function Profil() {
    const { user, isAdmin } = useSharedProps();
    const createdAt = (user as unknown as { created_at?: string }).created_at;
    const tanggal = createdAt
        ? new Date(createdAt).toLocaleString('id-ID', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
        : '-';

    return (
        <>
            <Head title="Profil" />

            <div className="hb-top">
                <h1>Profil Saya</h1>
            </div>

            <div className="hb-card" style={{ maxWidth: 560 }}>
                <p style={{ marginBottom: 8 }}>
                    <b>Nama:</b> {user.name}
                </p>
                <p style={{ marginBottom: 8 }}>
                    <b>Email:</b> {user.email}
                </p>
                <p style={{ marginBottom: 8 }}>
                    <b>Role:</b> <HbBadge value={isAdmin ? 'Admin' : 'User'} />
                </p>
                <p style={{ marginBottom: 20 }}>
                    <b>Akun dibuat:</b> {tanggal}
                </p>
                <Link href="/settings/profile" className="hb-btn hb-btn-light">
                    Pengaturan akun
                </Link>
            </div>
        </>
    );
}