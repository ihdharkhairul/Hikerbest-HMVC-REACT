<?php

namespace Modules\Peralatan\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PeralatanRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'nama_peralatan' => ['required', 'string', 'max:255'],
            'kategori' => ['required', 'string', 'max:100'],
            'stok' => ['required', 'integer', 'min:0'],
            'harga_sewa' => ['required', 'integer', 'min:0'],
            'kondisi' => ['required', 'in:Baik,Rusak Ringan,Perlu Perawatan'],
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
            'nama_peralatan.required' => 'Nama peralatan wajib diisi.',
            'kategori.required' => 'Kategori wajib diisi.',
            'stok.required' => 'Stok wajib diisi.',
            'stok.integer' => 'Stok harus berupa angka.',
            'harga_sewa.required' => 'Harga sewa wajib diisi.',
            'harga_sewa.integer' => 'Harga sewa harus berupa angka.',
            'kondisi.required' => 'Kondisi wajib dipilih.',
            'kondisi.in' => 'Kondisi tidak valid.',
        ];
    }

    /**
     * Only admins may manage equipment.
     */
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }
}