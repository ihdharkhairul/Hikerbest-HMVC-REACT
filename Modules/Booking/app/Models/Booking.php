<?php

namespace Modules\Booking\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Modules\Gunung\Models\Gunung;

class Booking extends Model
{
    protected $table = 'booking';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'gunung_id',
        'nama_pendaki',
        'no_hp',
        'tanggal_naik',
        'jumlah_pendaki',
        'status',
        'bukti_bayar',
        'nama_bukti',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'tanggal_naik' => 'date',
        ];
    }

    public function gunung(): BelongsTo
    {
        return $this->belongsTo(Gunung::class, 'gunung_id');
    }
}