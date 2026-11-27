<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Http\File as HttpFile;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Modules\Gunung\Models\Gunung;

class PasangFotoGunung extends Command
{
    protected $signature = 'gunung:pasang-foto {folder=storage/app/foto_gunung}';

    protected $description = 'Memasang foto gunung dari sebuah folder (nama file = nama gunung tanpa kata "Gunung", misalnya gede.jpg)';

    public function handle(): int
    {
        $folder = base_path($this->argument('folder'));

        if (! File::isDirectory($folder)) {
            $this->error("Folder tidak ditemukan: {$folder}");

            return self::FAILURE;
        }

        $files = collect(File::files($folder))->filter(
            fn ($file) => in_array(strtolower($file->getExtension()), ['jpg', 'jpeg', 'png', 'webp'])
        );

        $terpasang = 0;

        foreach (Gunung::all() as $gunung) {
            $slug = Str::slug(Str::after($gunung->nama_gunung, 'Gunung '));
            $file = $files->first(fn ($item) => Str::slug($item->getFilenameWithoutExtension()) === $slug);

            if (! $file) {
                $this->warn("Tidak ada foto untuk {$gunung->nama_gunung} (cari file bernama {$slug}.jpg)");

                continue;
            }

            if ($gunung->foto) {
                Storage::disk('public')->delete($gunung->foto);
            }

            $path = Storage::disk('public')->putFileAs(
                'gunung',
                new HttpFile($file->getPathname()),
                $slug.'-'.Str::random(6).'.'.strtolower($file->getExtension())
            );

            $gunung->update(['foto' => $path]);
            $this->info("OK: {$gunung->nama_gunung} -> {$path}");
            $terpasang++;
        }

        $this->info("Selesai: {$terpasang} foto terpasang.");

        return self::SUCCESS;
    }
}