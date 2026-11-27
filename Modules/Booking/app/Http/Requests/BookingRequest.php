<?php

namespace Modules\Booking\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BookingRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'gunung_id' => ['required', 'exists:gunung,id'],
            'nama_pendaki' => ['required', 'string', 'max:255'],
            'no_hp' => ['required', 'string', 'max:20'],
            'tanggal_naik' => ['required', 'date'],
            'jumlah_pendaki' => ['required', 'integer', 'min:1', 'max:50'],
            'status' => ['required', 'in:Menunggu,Dikonfirmasi,Dibatalkan'],
            'bukti_bayar' => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:2048'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'gunung_id.required' => 'Gunung wajib dipilih.',
            'gunung_id.exists' => 'Gunung tidak valid.',
            'nama_pendaki.required' => 'Nama pendaki wajib diisi.',
            'no_hp.required' => 'No HP wajib diisi.',
            'tanggal_naik.required' => 'Tanggal naik wajib diisi.',
            'tanggal_naik.date' => 'Format tanggal tidak valid.',
            'jumlah_pendaki.required' => 'Jumlah pendaki wajib diisi.',
            'jumlah_pendaki.integer' => 'Jumlah pendaki harus berupa angka.',
            'jumlah_pendaki.min' => 'Jumlah pendaki minimal 1.',
            'jumlah_pendaki.max' => 'Jumlah pendaki maksimal 50.',
            'status.required' => 'Status wajib dipilih.',
            'status.in' => 'Status tidak valid.',
            'bukti_bayar.mimes' => 'Berkas harus berformat JPG, JPEG, PNG, atau PDF.',
            'bukti_bayar.max' => 'Ukuran berkas maksimal 2 MB.',
            'bukti_bayar.uploaded' => 'Berkas gagal diunggah. Pastikan ukurannya tidak lebih dari 2 MB.',
        ];
    }

    /**
     * Access is limited by the role middleware on the routes.
     */
    public function authorize(): bool
    {
        return true;
    }
}