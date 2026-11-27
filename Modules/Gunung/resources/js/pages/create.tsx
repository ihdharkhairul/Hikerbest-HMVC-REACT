import { Head, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { GunungForm } from '../components/gunung-form';
import type { GunungFormData } from '../components/gunung-form';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm<GunungFormData>({
        nama_gunung: '',
        lokasi: '',
        ketinggian: '',
        tingkat_kesulitan: '',
        harga_tiket: '',
        deskripsi: '',
        foto: null,
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        post('/admin/gunung', { forceFormData: true });
    };

    return (
        <>
            <Head title="Tambah Gunung" />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div>
                    <h1 className="text-xl font-semibold">Tambah Gunung</h1>
                    <p className="text-sm text-muted-foreground">Isi data gunung yang akan ditambahkan.</p>
                </div>

                <GunungForm data={data} errors={errors} processing={processing} submitLabel="Simpan" setData={setData} onSubmit={submit} />
            </div>
        </>
    );
}

// Breadcrumb halaman (layout dipasang otomatis oleh app.tsx)
Create.layout = {
    breadcrumbs: [
        { title: 'Data Gunung', href: '/gunung' },
        { title: 'Tambah Gunung', href: '/admin/gunung/create' },
    ],
};