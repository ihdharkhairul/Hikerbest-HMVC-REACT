<?php

namespace Modules\Gunung\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GunungRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'nama_gunung' => ['required', 'string', 'max:255'],
            'lokasi' => ['required', 'string', 'max:255'],
            'ketinggian' => ['required', 'integer', 'min:1'],
            'tingkat_kesulitan' => ['required', 'in:Mudah,Sedang,Sulit'],
            'harga_tiket' => ['required', 'integer', 'min:0'],
            'deskripsi' => ['nullable', 'string'],
            'foto' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
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
            'nama_gunung.required' => 'Nama gunung wajib diisi.',
            'nama_gunung.max' => 'Nama gunung maksimal 255 karakter.',
            'lokasi.required' => 'Lokasi wajib diisi.',
            'lokasi.max' => 'Lokasi maksimal 255 karakter.',
            'ketinggian.required' => 'Ketinggian wajib diisi.',
            'ketinggian.integer' => 'Ketinggian harus berupa angka bulat.',
            'ketinggian.min' => 'Ketinggian minimal 1 mdpl.',
            'tingkat_kesulitan.required' => 'Tingkat kesulitan wajib dipilih.',
            'tingkat_kesulitan.in' => 'Tingkat kesulitan tidak valid.',
            'harga_tiket.required' => 'Harga tiket wajib diisi.',
            'harga_tiket.integer' => 'Harga tiket harus berupa angka bulat.',
            'harga_tiket.min' => 'Harga tiket tidak boleh negatif.',
            'foto.image' => 'File harus berupa gambar.',
            'foto.mimes' => 'Foto harus berformat jpg, jpeg, png, atau webp.',
            'foto.max' => 'Ukuran foto maksimal 2 MB.',
            'foto.uploaded' => 'Foto gagal diunggah. Pastikan ukurannya tidak lebih dari 2 MB.',
        ];
    }

    /**
     * Only admins may create or change mountains.
     */
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }
}