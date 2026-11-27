<?php

namespace Modules\Peralatan\Models;

use Illuminate\Database\Eloquent\Model;

class Peralatan extends Model
{
    protected $table = 'peralatan';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'nama_peralatan',
        'kategori',
        'stok',
        'harga_sewa',
        'kondisi',
    ];
}