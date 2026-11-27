<?php

namespace Modules\Peralatan\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Modules\Peralatan\Http\Requests\PeralatanRequest;
use Modules\Peralatan\Models\Peralatan;

class PeralatanController extends Controller
{
    /**
     * Display a paginated list of equipment, optionally filtered by keyword.
     */
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim()->toString();

        $peralatan = Peralatan::query()
            ->when($search !== '', function (Builder $query) use ($search) {
                $query->where(function (Builder $query) use ($search) {
                    $query->where('nama_peralatan', 'like', "%{$search}%")
                        ->orWhere('kategori', 'like', "%{$search}%")
                        ->orWhere('kondisi', 'like', "%{$search}%");
                });
            })
            ->orderBy('nama_peralatan')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Peralatan::index', [
            'peralatan' => $peralatan,
            'filters' => ['search' => $search],
        ]);
    }

    /**
     * Show the form for creating new equipment.
     */
    public function create(): Response
    {
        return Inertia::render('Peralatan::create');
    }

    /**
     * Store newly created equipment.
     */
    public function store(PeralatanRequest $request): RedirectResponse
    {
        Peralatan::create($request->validated());

        return redirect()->route('peralatan.index')->with('success', 'Peralatan berhasil ditambahkan.');
    }

    /**
     * Show the form for editing the specified equipment.
     */
    public function edit(Peralatan $peralatan): Response
    {
        return Inertia::render('Peralatan::edit', [
            'peralatan' => $peralatan->only(['id', 'nama_peralatan', 'kategori', 'stok', 'harga_sewa', 'kondisi']),
        ]);
    }

    /**
     * Update the specified equipment.
     */
    public function update(PeralatanRequest $request, Peralatan $peralatan): RedirectResponse
    {
        $peralatan->update($request->validated());

        return redirect()->route('peralatan.index')->with('success', 'Peralatan berhasil diperbarui.');
    }

    /**
     * Remove the specified equipment.
     */
    public function destroy(Peralatan $peralatan): RedirectResponse
    {
        $peralatan->delete();

        return redirect()->route('peralatan.index')->with('success', 'Peralatan berhasil dihapus.');
    }
}