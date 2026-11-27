import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        post('/register', { onFinish: () => reset('password', 'password_confirmation') });
    };

    return (
        <>
            <Head title="Register" />

            <div className="hb-top">
                <h1>Daftar Akun</h1>
            </div>

            <div className="hb-card hb-narrow">
                <form onSubmit={submit} noValidate>
                    <div className="hb-field">
                        <label htmlFor="name">Nama</label>
                        <input id="name" type="text" value={data.name} onChange={(event) => setData('name', event.target.value)} autoFocus />
                        {errors.name && <span className="hb-error">{errors.name}</span>}
                    </div>

                    <div className="hb-field">
                        <label htmlFor="email">Email</label>
                        <input id="email" type="email" value={data.email} onChange={(event) => setData('email', event.target.value)} />
                        {errors.email && <span className="hb-error">{errors.email}</span>}
                    </div>

                    <div className="hb-field">
                        <label htmlFor="password">Password</label>
                        <input id="password" type="password" value={data.password} onChange={(event) => setData('password', event.target.value)} />
                        {errors.password && <span className="hb-error">{errors.password}</span>}
                    </div>

                    <div className="hb-field">
                        <label htmlFor="password_confirmation">Konfirmasi Password</label>
                        <input
                            id="password_confirmation"
                            type="password"
                            value={data.password_confirmation}
                            onChange={(event) => setData('password_confirmation', event.target.value)}
                        />
                    </div>

                    <div className="hb-aksi">
                        <button type="submit" className="hb-btn hb-glow" disabled={processing}>
                            {processing ? 'Memproses...' : 'Register'}
                        </button>
                        <Link href="/login" className="hb-btn hb-btn-light">
                            Sudah punya akun?
                        </Link>
                    </div>
                </form>
            </div>
        </>
    );
}