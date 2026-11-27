import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { FlashMessage } from '@/components/alert-message';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type PeralatanRow = {
    id: number;
    nama_peralatan: string;
    kategori: string;
    stok: number;
    harga_sewa: number;
    kondisi: 'Baik' | 'Rusak Ringan' | 'Perlu Perawatan';
};

type PaginationLink = { url: string | null; label: string; active: boolean };

type IndexProps = {
    peralatan: {
        data: PeralatanRow[];
        links: PaginationLink[];
        from: number | null;
        to: number | null;
        total: number;
    };
    filters: { search: string };
};

const kondisiVariant = {
    Baik: 'secondary',
    'Rusak Ringan': 'default',
    'Perlu Perawatan': 'destructive',
} as const;

export default function Index({ peralatan, filters }: IndexProps) {
    const [search, setSearch] = useState(filters.search);
    const [deleting, setDeleting] = useState<PeralatanRow | null>(null);
    const [processing, setProcessing] = useState(false);

    // Kirim ulang request GET /peralatan dengan kata kunci pencarian
    const handleSearch = (event: FormEvent) => {
        event.preventDefault();
        router.get('/peralatan', { search }, { preserveState: true, replace: true });
    };

    const handleDelete = () => {
        if (!deleting) {
            return;
        }

        router.delete(`/peralatan/${deleting.id}`, {
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
            <Head title="Data Peralatan" />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <h1 className="text-xl font-semibold">Data Peralatan</h1>
                        <p className="text-sm text-muted-foreground">Total {peralatan.total} peralatan tercatat.</p>
                    </div>
                    <Button asChild>
                        <Link href="/peralatan/create">
                            <Plus /> Tambah Peralatan
                        </Link>
                    </Button>
                </div>

                <FlashMessage />

                <form onSubmit={handleSearch} className="flex gap-2">
                    <Input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Cari nama, kategori, atau kondisi..."
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
                                <th className="px-4 py-3 font-medium">Nama Peralatan</th>
                                <th className="px-4 py-3 font-medium">Kategori</th>
                                <th className="px-4 py-3 font-medium">Stok</th>
                                <th className="px-4 py-3 font-medium">Harga Sewa</th>
                                <th className="px-4 py-3 font-medium">Kondisi</th>
                                <th className="px-4 py-3 text-right font-medium">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {peralatan.data.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                                        Data peralatan tidak ditemukan.
                                    </td>
                                </tr>
                            )}
                            {peralatan.data.map((item, index) => (
                                <tr key={item.id} className="border-t">
                                    <td className="px-4 py-3">{(peralatan.from ?? 1) + index}</td>
                                    <td className="px-4 py-3 font-medium">{item.nama_peralatan}</td>
                                    <td className="px-4 py-3">{item.kategori}</td>
                                    <td className="px-4 py-3">{item.stok}</td>
                                    <td className="px-4 py-3">Rp {item.harga_sewa.toLocaleString('id-ID')}</td>
                                    <td className="px-4 py-3">
                                        <Badge variant={kondisiVariant[item.kondisi]}>{item.kondisi}</Badge>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-2">
                                            <Button asChild size="sm" variant="outline">
                                                <Link href={`/peralatan/${item.id}/edit`}>
                                                    <Pencil /> Edit
                                                </Link>
                                            </Button>
                                            <Button size="sm" variant="destructive" onClick={() => setDeleting(item)}>
                                                <Trash2 /> Hapus
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                    <p className="text-muted-foreground">
                        Menampilkan {peralatan.from ?? 0}-{peralatan.to ?? 0} dari {peralatan.total} data
                    </p>
                    <div className="flex flex-wrap gap-1">
                        {peralatan.links.map((link, index) =>
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
                description={`Yakin ingin menghapus peralatan "${deleting?.nama_peralatan}"? Tindakan ini tidak dapat dibatalkan.`}
                processing={processing}
                onConfirm={handleDelete}
                onOpenChange={(open) => !open && setDeleting(null)}
            />
        </>
    );
}

// Breadcrumb halaman (layout dipasang otomatis oleh app.tsx)
Index.layout = {
    breadcrumbs: [{ title: 'Data Peralatan', href: '/peralatan' }],
};

// Label pagination Laravel berisi entitas HTML &laquo; dan &raquo;
function cleanLabel(label: string): string {
    return label.replace('&laquo;', '«').replace('&raquo;', '»');
}