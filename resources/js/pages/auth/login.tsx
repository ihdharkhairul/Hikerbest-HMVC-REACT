import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

type LoginProps = {
    status?: string;
    canResetPassword?: boolean;
};

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        post('/login', { onFinish: () => reset('password') });
    };

    return (
        <>
            <Head title="Login" />

            <div className="hb-top">
                <h1>Login</h1>
            </div>

            {status && (
                <div className="hb-alert hb-alert-success hb-narrow">
                    <p>{status}</p>
                </div>
            )}

            <div className="hb-card hb-narrow">
                <form onSubmit={submit} noValidate>
                    <div className="hb-field">
                        <label htmlFor="email">Email</label>
                        <input id="email" type="email" value={data.email} onChange={(event) => setData('email', event.target.value)} autoFocus />
                        {errors.email && <span className="hb-error">{errors.email}</span>}
                    </div>

                    <div className="hb-field">
                        <label htmlFor="password">Password</label>
                        <input id="password" type="password" value={data.password} onChange={(event) => setData('password', event.target.value)} />
                        {errors.password && <span className="hb-error">{errors.password}</span>}
                    </div>

                    <div className="hb-field">
                        <label className="hb-check">
                            <input type="checkbox" checked={data.remember} onChange={(event) => setData('remember', event.target.checked)} /> Ingat saya
                        </label>
                    </div>

                    <div className="hb-aksi">
                        <button type="submit" className="hb-btn hb-glow" disabled={processing}>
                            {processing ? 'Memproses...' : 'Login'}
                        </button>
                        <Link href="/register" className="hb-btn hb-btn-light">
                            Buat akun
                        </Link>
                    </div>

                    {canResetPassword && (
                        <p style={{ marginTop: 18, fontSize: 13 }}>
                            <Link href="/forgot-password" className="hb-muted">
                                Lupa password?
                            </Link>
                        </p>
                    )}
                </form>
            </div>
        </>
    );
}