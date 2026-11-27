import { Link } from '@inertiajs/react';
import type { FormEvent } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export type PeralatanFormData = {
    nama_peralatan: string;
    kategori: string;
    stok: string;
    harga_sewa: string;
    kondisi: string;
};

type TextField = 'nama_peralatan' | 'kategori' | 'stok' | 'harga_sewa';

const textFields: { name: TextField; label: string; type: string }[] = [
    { name: 'nama_peralatan', label: 'Nama Peralatan', type: 'text' },
    { name: 'kategori', label: 'Kategori', type: 'text' },
    { name: 'stok', label: 'Stok', type: 'number' },
    { name: 'harga_sewa', label: 'Harga Sewa (Rp)', type: 'number' },
];

export const kondisiOptions = ['Baik', 'Rusak Ringan', 'Perlu Perawatan'];

type PeralatanFormProps = {
    data: PeralatanFormData;
    errors: Partial<Record<keyof PeralatanFormData, string>>;
    processing: boolean;
    submitLabel: string;
    setData: (key: keyof PeralatanFormData, value: string) => void;
    onSubmit: (event: FormEvent) => void;
};

export function PeralatanForm({ data, errors, processing, submitLabel, setData, onSubmit }: PeralatanFormProps) {
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
                <Label htmlFor="kondisi">
                    Kondisi <span className="text-red-500">*</span>
                </Label>
                <select
                    id="kondisi"
                    value={data.kondisi}
                    onChange={(event) => setData('kondisi', event.target.value)}
                    className="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs"
                >
                    <option value="">Pilih kondisi</option>
                    {kondisiOptions.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
                <InputError message={errors.kondisi} />
            </div>

            <div className="flex gap-2">
                <Button type="submit" disabled={processing}>
                    {processing ? 'Menyimpan...' : submitLabel}
                </Button>
                <Button asChild variant="secondary">
                    <Link href="/peralatan">Batal</Link>
                </Button>
            </div>
        </form>
    );
}