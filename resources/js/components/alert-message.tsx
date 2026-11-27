import { CircleAlert, CircleCheck, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSharedProps } from '@/hooks/use-shared-props';

type AlertMessageProps = {
    type: 'success' | 'error';
    message?: string | null;
    onClose?: () => void;
};

export function AlertMessage({ type, message, onClose }: AlertMessageProps) {
    // Pesan berhasil otomatis tertutup setelah 4 detik
    useEffect(() => {
        if (!message || type !== 'success' || !onClose) {
            return;
        }

        const timer = setTimeout(onClose, 4000);

        return () => clearTimeout(timer);
    }, [message, type]);

    if (!message) {
        return null;
    }

    const Icon = type === 'success' ? CircleCheck : CircleAlert;

    return (
        <div role="alert" className={`hb-alert ${type === 'success' ? 'hb-alert-success' : 'hb-alert-error'}`}>
            <Icon className="mt-0.5 size-4 shrink-0" />
            <p>{message}</p>
            {onClose && (
                <button type="button" onClick={onClose} aria-label="Tutup">
                    <X className="size-4" />
                </button>
            )}
        </div>
    );
}

export function FlashMessage() {
    const { flash } = useSharedProps();
    const [success, setSuccess] = useState(flash.success);
    const [error, setError] = useState(flash.error);

    // Tampilkan ulang pesan setiap kali server mengirim flash baru
    useEffect(() => {
        setSuccess(flash.success);
        setError(flash.error);
    }, [flash]);

    return (
        <>
            <AlertMessage type="success" message={success} onClose={() => setSuccess(null)} />
            <AlertMessage type="error" message={error} onClose={() => setError(null)} />
        </>
    );
}