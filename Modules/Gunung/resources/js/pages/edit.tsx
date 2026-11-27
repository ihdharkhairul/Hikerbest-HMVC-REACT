import { Head, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { GunungForm } from '../components/gunung-form';
import type { GunungFormData } from '../components/gunung-form';

type EditProps = {
    gunung: {
        id: number;
        nama_gunung: string;
        lokasi: string;
        ketinggian: number;
        tingkat_kesulitan: string;
        harga_tiket: number;
        deskripsi: string | null;
        foto_url: string | null;
    };
};

export default function Edit({ gunung }: EditProps) {
    const { data, setData, post, processing, errors, transform } = useForm<GunungFormData>({
        nama_gunung: gunung.nama_gunung,
        lokasi: gunung.lokasi,
        ketinggian: String(gunung.ketinggian),
        tingkat_kesulitan: gunung.tingkat_kesulitan,
        harga_tiket: String(gunung.harga_tiket),
        deskripsi: gunung.deskripsi ?? '',
        foto: null,
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        transform((formData) => ({ ...formData, _method: 'put' }));
        post(`/admin/gunung/${gunung.id}`, { forceFormData: true });
    };

    return (
        <>
            <Head title="Edit Gunung" />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div>
                    <h1 className="text-xl font-semibold">Edit Gunung</h1>
                    <p className="text-sm text-muted-foreground">Perbarui data {gunung.nama_gunung}.</p>
                </div>

                <GunungForm
                    data={data}
                    errors={errors}
                    processing={processing}
                    submitLabel="Simpan Perubahan"
                    currentPhotoUrl={gunung.foto_url}
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
        { title: 'Data Gunung', href: '/gunung' },
        { title: 'Edit Gunung', href: '#' },
    ],
};