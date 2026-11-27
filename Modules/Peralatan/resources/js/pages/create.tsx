import { Head, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { PeralatanForm } from '../components/peralatan-form';
import type { PeralatanFormData } from '../components/peralatan-form';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm<PeralatanFormData>({
        nama_peralatan: '',
        kategori: '',
        stok: '',
        harga_sewa: '',
        kondisi: 'Baik',
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        post('/peralatan');
    };

    return (
        <>
            <Head title="Tambah Peralatan" />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div>
                    <h1 className="text-xl font-semibold">Tambah Peralatan</h1>
                    <p className="text-sm text-muted-foreground">Isi data peralatan yang akan ditambahkan.</p>
                </div>

                <PeralatanForm data={data} errors={errors} processing={processing} submitLabel="Simpan" setData={setData} onSubmit={submit} />
            </div>
        </>
    );
}

// Breadcrumb halaman (layout dipasang otomatis oleh app.tsx)
Create.layout = {
    breadcrumbs: [
        { title: 'Data Peralatan', href: '/peralatan' },
        { title: 'Tambah Peralatan', href: '/peralatan/create' },
    ],
};