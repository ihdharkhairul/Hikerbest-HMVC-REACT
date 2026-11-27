import { Head, Link, router } from '@inertiajs/react';
import { Mountain, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { FlashMessage } from '@/components/alert-message';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSharedProps } from '@/hooks/use-shared-props';

type GunungRow = {
    id: number;
    nama_gunung: string;
    lokasi: string;
    ketinggian: number;
    tingkat_kesulitan: 'Mudah' | 'Sedang' | 'Sulit';
    harga_tiket: number;
    foto_url: string | null;
};

type PaginationLink = { url: string | null; label: string; active: boolean };

type IndexProps = {
    gunung: {
        data: GunungRow[];
        links: PaginationLink[];
        from: number | null;
        to: number | null;
        total: number;
    };
    filters: { search: string };
};

const levelVariant = {
    Mudah: 'secondary',
    Sedang: 'default',
    Sulit: 'destructive',
} as const;

export default function Index({ gunung, filters }: IndexProps) {
    const { isAdmin } = useSharedProps();
    const [search, setSearch] = useState(filters.search);
    const [deleting, setDeleting] = useState<GunungRow | null>(null);
    const [processing, setProcessing] = useState(false);

    // Kirim ulang request GET /gunung dengan kata kunci pencarian
    const handleSearch = (event: FormEvent) => {
        event.preventDefault();
        router.get('/gunung', { search }, { preserveState: true, replace: true });
    };

    const handleDelete = () => {
        if (!deleting) {
            return;
        }

        router.delete(`/admin/gunung/${deleting.id}`, {
            preserveScroll: true,
            onStart: () => setProcessing(true),
            onFinish: () => {
                setProcessing(false);
                setDeleting(null);
            },
        });
    };

    return (
        <>
            <Head title="Data Gunung" />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <h1 className="text-xl font-semibold">Data Gunung</h1>
                        <p className="text-sm text-muted-foreground">Total {gunung.total} gunung tersedia.</p>
                    </div>
                    {isAdmin && (
                        <Button asChild>
                            <Link href="/admin/gunung/create">
                                <Plus /> Tambah Gunung
                            </Link>
                        </Button>
                    )}
                </div>

                <FlashMessage />

                <form onSubmit={handleSearch} className="flex gap-2">
                    <Input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Cari nama, lokasi, atau tingkat kesulitan..."
                        className="max-w-sm"
                    />
                    <Button type="submit" variant="secondary">
                        <Search /> Cari
                    </Button>
                </form>

                <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-left">
                            <tr>
                                <th className="px-4 py-3 font-medium">No</th>
                                <th className="px-4 py-3 font-medium">Foto</th>
                                <th className="px-4 py-3 font-medium">Nama Gunung</th>
                                <th className="px-4 py-3 font-medium">Lokasi</th>
                                <th className="px-4 py-3 font-medium">Ketinggian</th>
                                <th className="px-4 py-3 font-medium">Tingkat</th>
                                <th className="px-4 py-3 font-medium">Harga Tiket</th>
                                {isAdmin && <th className="px-4 py-3 text-right font-medium">Aksi</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {gunung.data.length === 0 && (
                                <tr>
                                    <td colSpan={isAdmin ? 8 : 7} className="px-4 py-8 text-center text-muted-foreground">
                                        Data gunung tidak ditemukan.
                                    </td>
                                </tr>
                            )}
                            {gunung.data.map((item, index) => (
                                <tr key={item.id} className="border-t">
                                    <td className="px-4 py-3">{(gunung.from ?? 1) + index}</td>
                                    <td className="px-4 py-3">
                                        {item.foto_url ? (
                                            <img src={item.foto_url} alt={item.nama_gunung} className="h-12 w-16 rounded-md border object-cover" />
                                        ) : (
                                            <div className="flex h-12 w-16 items-center justify-center rounded-md border text-muted-foreground">
                                                <Mountain className="size-5" />
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 font-medium">{item.nama_gunung}</td>
                                    <td className="px-4 py-3">{item.lokasi}</td>
                                    <td className="px-4 py-3">{item.ketinggian.toLocaleString('id-ID')} mdpl</td>
                                    <td className="px-4 py-3">
                                        <Badge variant={levelVariant[item.tingkat_kesulitan]}>{item.tingkat_kesulitan}</Badge>
                                    </td>
                                    <td className="px-4 py-3">Rp {item.harga_tiket.toLocaleString('id-ID')}</td>
                                    {isAdmin && (
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-2">
                                                <Button asChild size="sm" variant="outline">
                                                    <Link href={`/admin/gunung/${item.id}/edit`}>
                                                        <Pencil /> Edit
                                                    </Link>
                                                </Button>
                                                <Button size="sm" variant="destructive" onClick={() => setDeleting(item)}>
                                                    <Trash2 /> Hapus
                                                </Button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                    <p className="text-muted-foreground">
                        Menampilkan {gunung.from ?? 0}-{gunung.to ?? 0} dari {gunung.total} data
                    </p>
                    <div className="flex flex-wrap gap-1">
                        {gunung.links.map((link, index) =>
                            link.url ? (
                                <Button key={index} asChild size="sm" variant={link.active ? 'default' : 'outline'}>
                                    <Link href={link.url} preserveScroll>
                                        {cleanLabel(link.label)}
                                    </Link>
                                </Button>
                            ) : (
                                <Button key={index} size="sm" variant="outline" disabled>
                                    {cleanLabel(link.label)}
                                </Button>
                            ),
                        )}
                    </div>
                </div>
            </div>

            <ConfirmDialog
                open={deleting !== null}
                description={`Yakin ingin menghapus data "${deleting?.nama_gunung}" beserta fotonya? Booking yang terkait gunung ini juga ikut terhapus.`}
                processing={processing}
                onConfirm={handleDelete}
                onOpenChange={(open) => !open && setDeleting(null)}
            />
        </>
    );
}

// Breadcrumb halaman (layout dipasang otomatis oleh app.tsx)
Index.layout = {
    breadcrumbs: [{ title: 'Data Gunung', href: '/gunung' }],
};

// Label pagination Laravel berisi entitas HTML &laquo; dan &raquo;
function cleanLabel(label: string): string {
    return label.replace('&laquo;', '«').replace('&raquo;', '»');
}