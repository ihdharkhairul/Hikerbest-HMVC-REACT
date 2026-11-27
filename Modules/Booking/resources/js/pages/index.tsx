import { Head } from '@inertiajs/react';
import { FileImage, FileText, LoaderCircle, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { AlertMessage } from '@/components/alert-message';
import { ConfirmDialog } from '@/components/confirm-dialog';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { http, HttpError } from '@/lib/http';
import type { ValidationErrors } from '@/lib/http';

type GunungOption = { id: number; nama_gunung: string };

type Booking = {
    id: number;
    nama_gunung: string | null;
    nama_pendaki: string;
    no_hp: string;
    tanggal_naik: string;
    jumlah_pendaki: number;
    status: 'Menunggu' | 'Dikonfirmasi' | 'Dibatalkan';
    nama_bukti: string | null;
    bukti_url: string | null;
};

type BookingDetail = {
    id: number;
    gunung_id: number;
    nama_pendaki: string;
    no_hp: string;
    tanggal_naik: string;
    jumlah_pendaki: number;
    status: Booking['status'];
    nama_bukti: string | null;
    bukti_url: string | null;
};

type FormFields = {
    gunung_id: string;
    nama_pendaki: string;
    no_hp: string;
    tanggal_naik: string;
    jumlah_pendaki: string;
    status: string;
};

type Message = { type: 'success' | 'error'; text: string } | null;

const emptyForm: FormFields = {
    gunung_id: '',
    nama_pendaki: '',
    no_hp: '',
    tanggal_naik: '',
    jumlah_pendaki: '1',
    status: 'Menunggu',
};

const statusVariant = {
    Menunggu: 'default',
    Dikonfirmasi: 'secondary',
    Dibatalkan: 'destructive',
} as const;

const urls = {
    data: '/booking/data',
    store: '/booking',
    edit: (id: number) => `/booking/${id}/edit`,
    update: (id: number) => `/booking/${id}`,
    destroy: (id: number) => `/booking/${id}`,
};

// Tautan berkas yang dibuka di tab baru, ikon dipilih berdasarkan ekstensi
function FileLink({ url, name }: { url: string | null; name: string | null }) {
    if (!url) {
        return <span className="text-muted-foreground">-</span>;
    }

    const Icon = name?.toLowerCase().endsWith('.pdf') ? FileText : FileImage;

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary underline-offset-4 hover:underline"
        >
            <Icon className="size-4" /> {name ?? 'Lihat berkas'}
        </a>
    );
}

export default function Index({ gunung }: { gunung: GunungOption[] }) {
    const [records, setRecords] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState('');
    const [message, setMessage] = useState<Message>(null);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<BookingDetail | null>(null);
    const [form, setForm] = useState<FormFields>(emptyForm);
    const [file, setFile] = useState<File | null>(null);
    const [fileInputKey, setFileInputKey] = useState(0);
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [saving, setSaving] = useState(false);

    const [deleting, setDeleting] = useState<Booking | null>(null);
    const [processingDelete, setProcessingDelete] = useState(false);

    const showError = (error: unknown, fallback: string) => {
        const text = error instanceof HttpError ? (error.data?.message ?? fallback) : fallback;
        setMessage({ type: 'error', text });
    };

    // Mengambil seluruh data booking dari server (GET /booking/data)
    const loadData = async () => {
        setLoading(true);

        try {
            setRecords(await http<Booking[]>(urls.data));
        } catch (error) {
            showError(error, 'Gagal memuat data booking.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // Pencarian dilakukan di browser tanpa request baru ke server
    const filtered = useMemo(() => {
        const q = keyword.trim().toLowerCase();

        if (q === '') {
            return records;
        }

        return records.filter((item) =>
            [item.nama_pendaki, item.nama_gunung ?? '', item.no_hp, item.status].some((value) => value.toLowerCase().includes(q)),
        );
    }, [records, keyword]);

    const resetFileAndErrors = () => {
        setFile(null);
        setFileInputKey((key) => key + 1);
        setErrors({});
    };

    const openCreate = () => {
        setEditing(null);
        setForm(emptyForm);
        resetFileAndErrors();
        setDialogOpen(true);
    };

    // Mengambil satu data (GET /booking/{id}/edit) lalu mengisi form di dialog
    const openEdit = async (id: number) => {
        try {
            const data = await http<BookingDetail>(urls.edit(id));

            setEditing(data);
            setForm({
                gunung_id: String(data.gunung_id),
                nama_pendaki: data.nama_pendaki,
                no_hp: data.no_hp,
                tanggal_naik: data.tanggal_naik,
                jumlah_pendaki: String(data.jumlah_pendaki),
                status: data.status,
            });
            resetFileAndErrors();
            setDialogOpen(true);
        } catch (error) {
            showError(error, 'Data tidak ditemukan.');
        }
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [event.target.name]: event.target.value });
    };

    // Menyimpan data (tambah dan edit) menggunakan FormData
    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setSaving(true);
        setErrors({});

        const formData = new FormData();
        Object.entries(form).forEach(([key, value]) => formData.append(key, value));

        if (file) {
            formData.append('bukti_bayar', file);
        }

        if (editing) {
            formData.append('_method', 'PUT');
        }

        try {
            const result = await http<{ message: string }>(editing ? urls.update(editing.id) : urls.store, {
                method: 'POST',
                body: formData,
            });

            setDialogOpen(false);
            setMessage({ type: 'success', text: result.message });
            await loadData();
        } catch (error) {
            if (error instanceof HttpError && error.status === 422) {
                setErrors(error.data?.errors ?? {});
            } else {
                showError(error, 'Terjadi kesalahan, silakan coba lagi.');
            }
        } finally {
            setSaving(false);
        }
    };

    // Menghapus data (DELETE /booking/{id}) setelah dikonfirmasi
    const handleDelete = async () => {
        if (!deleting) {
            return;
        }

        setProcessingDelete(true);

        try {
            const result = await http<{ message: string }>(urls.destroy(deleting.id), { method: 'DELETE' });

            setMessage({ type: 'success', text: result.message });
            await loadData();
        } catch (error) {
            showError(error, 'Data gagal dihapus.');
        } finally {
            setProcessingDelete(false);
            setDeleting(null);
        }
    };

    return (
        <>
            <Head title="Booking" />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <h1 className="flex items-center gap-2 text-xl font-semibold">
                            Data Booking <Badge variant="secondary">{records.length}</Badge>
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Seluruh operasi pada halaman ini berjalan dengan AJAX tanpa memuat ulang halaman.
                        </p>
                    </div>
                    <Button onClick={openCreate}>
                        <Plus /> Tambah Booking
                    </Button>
                </div>

                <AlertMessage type={message?.type ?? 'success'} message={message?.text} onClose={() => setMessage(null)} />

                <div className="relative max-w-sm">
                    <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={keyword}
                        onChange={(event) => setKeyword(event.target.value)}
                        placeholder="Cari pendaki, gunung, no HP, atau status..."
                        className="pl-9"
                    />
                </div>

                <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-left">
                            <tr>
                                <th className="px-4 py-3 font-medium">No</th>
                                <th className="px-4 py-3 font-medium">Gunung</th>
                                <th className="px-4 py-3 font-medium">Pendaki</th>
                                <th className="px-4 py-3 font-medium">No HP</th>
                                <th className="px-4 py-3 font-medium">Tgl Naik</th>
                                <th className="px-4 py-3 font-medium">Jumlah</th>
                                <th className="px-4 py-3 font-medium">Status</th>
                                <th className="px-4 py-3 font-medium">Bukti Bayar</th>
                                <th className="px-4 py-3 text-right font-medium">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && (
                                <tr>
                                    <td colSpan={9} className="px-4 py-8 text-center text-muted-foreground">
                                        <LoaderCircle className="mx-auto size-5 animate-spin" />
                                    </td>
                                </tr>
                            )}
                            {!loading && filtered.length === 0 && (
                                <tr>
                                    <td colSpan={9} className="px-4 py-8 text-center text-muted-foreground">
                                        {records.length === 0 ? 'Belum ada data booking.' : 'Data tidak ditemukan.'}
                                    </td>
                                </tr>
                            )}
                            {!loading &&
                                filtered.map((item, index) => (
                                    <tr key={item.id} className="border-t">
                                        <td className="px-4 py-3">{index + 1}</td>
                                        <td className="px-4 py-3 font-medium">{item.nama_gunung ?? '-'}</td>
                                        <td className="px-4 py-3">{item.nama_pendaki}</td>
                                        <td className="px-4 py-3">{item.no_hp}</td>
                                        <td className="px-4 py-3">{item.tanggal_naik}</td>
                                        <td className="px-4 py-3">{item.jumlah_pendaki} orang</td>
                                        <td className="px-4 py-3">
                                            <Badge variant={statusVariant[item.status]}>{item.status}</Badge>
                                        </td>
                                        <td className="px-4 py-3">
                                            <FileLink url={item.bukti_url} name={item.nama_bukti} />
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-2">
                                                <Button size="sm" variant="outline" onClick={() => openEdit(item.id)}>
                                                    <Pencil /> Edit
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
            </div>

            <Dialog open={dialogOpen} onOpenChange={(open) => !saving && setDialogOpen(open)}>
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
                    <form onSubmit={handleSubmit} noValidate className="space-y-4">
                        <DialogHeader>
                            <DialogTitle>{editing ? 'Edit Booking' : 'Tambah Booking'}</DialogTitle>
                            <DialogDescription>Lengkapi data booking pendakian beserta bukti pembayaran.</DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-2">
                            <Label htmlFor="gunung_id">
                                Gunung <span className="text-red-500">*</span>
                            </Label>
                            <select
                                id="gunung_id"
                                name="gunung_id"
                                value={form.gunung_id}
                                onChange={handleChange}
                                className="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs"
                            >
                                <option value="">Pilih gunung</option>
                                {gunung.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.nama_gunung}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.gunung_id?.[0]} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="nama_pendaki">
                                Nama Pendaki <span className="text-red-500">*</span>
                            </Label>
                            <Input id="nama_pendaki" name="nama_pendaki" value={form.nama_pendaki} onChange={handleChange} />
                            <InputError message={errors.nama_pendaki?.[0]} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="no_hp">
                                No HP <span className="text-red-500">*</span>
                            </Label>
                            <Input id="no_hp" name="no_hp" value={form.no_hp} onChange={handleChange} />
                            <InputError message={errors.no_hp?.[0]} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="tanggal_naik">
                                Tanggal Naik <span className="text-red-500">*</span>
                            </Label>
                            <Input id="tanggal_naik" name="tanggal_naik" type="date" value={form.tanggal_naik} onChange={handleChange} />
                            <InputError message={errors.tanggal_naik?.[0]} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="jumlah_pendaki">
                                Jumlah Pendaki <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="jumlah_pendaki"
                                name="jumlah_pendaki"
                                type="number"
                                value={form.jumlah_pendaki}
                                onChange={handleChange}
                            />
                            <InputError message={errors.jumlah_pendaki?.[0]} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="status">
                                Status <span className="text-red-500">*</span>
                            </Label>
                            <select
                                id="status"
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                className="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs"
                            >
                                <option value="Menunggu">Menunggu</option>
                                <option value="Dikonfirmasi">Dikonfirmasi</option>
                                <option value="Dibatalkan">Dibatalkan</option>
                            </select>
                            <InputError message={errors.status?.[0]} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="bukti_bayar">Bukti Bayar</Label>
                            <Input
                                key={fileInputKey}
                                id="bukti_bayar"
                                type="file"
                                accept=".jpg,.jpeg,.png,.pdf"
                                onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                                aria-invalid={!!errors.bukti_bayar}
                            />
                            <p className="text-xs text-muted-foreground">
                                Format jpg, jpeg, png, atau pdf, maksimal 2 MB.
                                {editing && ' Kosongkan jika tidak ingin mengganti berkas.'}
                            </p>
                            {editing?.bukti_url && (
                                <p className="text-xs">
                                    Berkas saat ini: <FileLink url={editing.bukti_url} name={editing.nama_bukti} />
                                </p>
                            )}
                            <InputError message={errors.bukti_bayar?.[0]} />
                        </div>

                        <DialogFooter className="gap-2">
                            <Button type="button" variant="secondary" onClick={() => setDialogOpen(false)} disabled={saving}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={saving}>
                                {saving && <LoaderCircle className="animate-spin" />}
                                {saving ? 'Menyimpan...' : 'Simpan'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <ConfirmDialog
                open={deleting !== null}
                description={`Yakin ingin menghapus booking atas nama ${deleting?.nama_pendaki} beserta bukti bayarnya?`}
                processing={processingDelete}
                onConfirm={handleDelete}
                onOpenChange={(open) => !open && setDeleting(null)}
            />
        </>
    );
}

// Breadcrumb halaman (layout dipasang otomatis oleh app.tsx)
Index.layout = {
    breadcrumbs: [{ title: 'Booking', href: '/booking' }],
};