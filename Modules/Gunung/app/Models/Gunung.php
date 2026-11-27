<?php

namespace Modules\Gunung\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class Gunung extends Model
{
    protected $table = 'gunung';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'nama_gunung',
        'lokasi',
        'ketinggian',
        'tingkat_kesulitan',
        'harga_tiket',
        'deskripsi',
        'foto',
    ];

    /**
     * The accessors to append to the model's array and JSON form.
     *
     * @var list<string>
     */
    protected $appends = [
        'foto_url',
    ];

    /**
     * Public URL of the uploaded photo, or null when there is no photo.
     */
    protected function fotoUrl(): Attribute
    {
        return Attribute::get(fn (): ?string => $this->foto ? asset('storage/'.$this->foto) : null);
    }
}