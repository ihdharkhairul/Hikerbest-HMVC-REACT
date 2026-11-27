import { Head, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { PeralatanForm } from '../components/peralatan-form';
import type { PeralatanFormData } from '../components/peralatan-form';

type EditProps = {
    peralatan: {
        id: number;
        nama_peralatan: string;
        kategori: string;
        stok: number;
        harga_sewa: number;
        kondisi: string;
    };
};

export default function Edit({ peralatan }: EditProps) {
    const { data, setData, put, processing, errors } = useForm<PeralatanFormData>({
        nama_peralatan: peralatan.nama_peralatan,
        kategori: peralatan.kategori,
        stok: String(peralatan.stok),
        harga_sewa: String(peralatan.harga_sewa),
        kondisi: peralatan.kondisi,
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        put(`/peralatan/${peralatan.id}`);
    };

    return (
        <>
            <Head title="Edit Peralatan" />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div>
                    <h1 className="text-xl font-semibold">Edit Peralatan</h1>
                    <p className="text-sm text-muted-foreground">Perbarui data {peralatan.nama_peralatan}.</p>
                </div>

                <PeralatanForm
                    data={data}
                    errors={errors}
                    processing={processing}
                    submitLabel="Simpan Perubahan"
                    setData={setData}
                    onSubmit={submit}
                />
            </div>
        </>
    );
}

// Breadcrumb halaman (layout dipasang otomatis oleh app.tsx)
Edit.layout = {
    breadcrumbs: [
        { title: 'Data Peralatan', href: '/peralatan' },
        { title: 'Edit Peralatan', href: '#' },
    ],
};