import { Link } from '@inertiajs/react';
import type { FormEvent } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export type GunungFormData = {
    nama_gunung: string;
    lokasi: string;
    ketinggian: string;
    tingkat_kesulitan: string;
    harga_tiket: string;
    deskripsi: string;
    foto: File | null;
};

type TextField = 'nama_gunung' | 'lokasi' | 'ketinggian' | 'harga_tiket';

const textFields: { name: TextField; label: string; type: string }[] = [
    { name: 'nama_gunung', label: 'Nama Gunung', type: 'text' },
    { name: 'lokasi', label: 'Lokasi', type: 'text' },
    { name: 'ketinggian', label: 'Ketinggian (mdpl)', type: 'number' },
    { name: 'harga_tiket', label: 'Harga Tiket (Rp)', type: 'number' },
];

type GunungFormProps = {
    data: GunungFormData;
    errors: Partial<Record<keyof GunungFormData, string>>;
    processing: boolean;
    submitLabel: string;
    currentPhotoUrl?: string | null;
    setData: (key: keyof GunungFormData, value: string | File | null) => void;
    onSubmit: (event: FormEvent) => void;
};

export function GunungForm({ data, errors, processing, submitLabel, currentPhotoUrl, setData, onSubmit }: GunungFormProps) {
    return (
        <form onSubmit={onSubmit} noValidate className="max-w-xl space-y-5 rounded-xl border p-6">
            {textFields.map((field, index) => (
                <div key={field.name} className="grid gap-2">
                    <Label htmlFor={field.name}>
                        {field.label} <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id={field.name}
                        type={field.type}
                        value={data[field.name]}
                        onChange={(event) => setData(field.name, event.target.value)}
                        autoFocus={index === 0}
                    />
                    <InputError message={errors[field.name]} />
                </div>
            ))}

            <div className="grid gap-2">
                <Label htmlFor="tingkat_kesulitan">
                    Tingkat Kesulitan <span className="text-red-500">*</span>
                </Label>
                <select
                    id="tingkat_kesulitan"
                    value={data.tingkat_kesulitan}
                    onChange={(event) => setData('tingkat_kesulitan', event.target.value)}
                    className="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs"
                >
                    <option value="">Pilih tingkat kesulitan</option>
                    <option value="Mudah">Mudah</option>
                    <option value="Sedang">Sedang</option>
                    <option value="Sulit">Sulit</option>
                </select>
                <InputError message={errors.tingkat_kesulitan} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="deskripsi">Deskripsi</Label>
                <textarea
                    id="deskripsi"
                    rows={4}
                    value={data.deskripsi}
                    onChange={(event) => setData('deskripsi', event.target.value)}
                    className="rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs"
                />
                <InputError message={errors.deskripsi} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="foto">Foto</Label>
                <Input
                    id="foto"
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={(event) => setData('foto', event.target.files?.[0] ?? null)}
                />
                <p className="text-xs text-muted-foreground">Format jpg, jpeg, png, atau webp, maksimal 2 MB.</p>
                {currentPhotoUrl && (
                    <img src={currentPhotoUrl} alt="Foto saat ini" className="h-24 w-36 rounded-md border object-cover" />
                )}
                <InputError message={errors.foto} />
            </div>

            <div className="flex gap-2">
                <Button type="submit" disabled={processing}>
                    {processing ? 'Menyimpan...' : submitLabel}
                </Button>
                <Button asChild variant="secondary">
                    <Link href="/gunung">Batal</Link>
                </Button>
            </div>
        </form>
    );
}