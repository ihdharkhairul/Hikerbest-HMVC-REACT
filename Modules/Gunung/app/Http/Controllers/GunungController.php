<?php

namespace Modules\Gunung\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Modules\Gunung\Http\Requests\GunungRequest;
use Modules\Gunung\Models\Gunung;

class GunungController extends Controller
{
    /**
     * Display a paginated list of mountains, optionally filtered by keyword.
     */
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim()->toString();

        $gunung = Gunung::query()
            ->when($search !== '', function (Builder $query) use ($search) {
                $query->where(function (Builder $query) use ($search) {
                    $query->where('nama_gunung', 'like', "%{$search}%")
                        ->orWhere('lokasi', 'like', "%{$search}%")
                        ->orWhere('tingkat_kesulitan', 'like', "%{$search}%");
                });
            })
            ->orderBy('nama_gunung')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Gunung::index', [
            'gunung' => $gunung,
            'filters' => ['search' => $search],
        ]);
    }

    /**
     * Show the form for creating a new mountain.
     */
    public function create(): Response
    {
        return Inertia::render('Gunung::create');
    }

    /**
     * Store a newly created mountain together with its photo.
     */
    public function store(GunungRequest $request): RedirectResponse
    {
        $data = $request->safe()->except('foto');

        if ($request->hasFile('foto')) {
            $data['foto'] = $request->file('foto')->store('gunung', 'public');
        }

        Gunung::create($data);

        return redirect()->route('gunung.index')->with('success', 'Data gunung berhasil ditambahkan.');
    }

    /**
     * Show the form for editing the specified mountain.
     */
    public function edit(Gunung $gunung): Response
    {
        return Inertia::render('Gunung::edit', [
            'gunung' => $gunung,
        ]);
    }

    /**
     * Update the specified mountain. The old photo is replaced only when a new one is uploaded.
     */
    public function update(GunungRequest $request, Gunung $gunung): RedirectResponse
    {
        $data = $request->safe()->except('foto');

        if ($request->hasFile('foto')) {
            if ($gunung->foto) {
                Storage::disk('public')->delete($gunung->foto);
            }

            $data['foto'] = $request->file('foto')->store('gunung', 'public');
        }

        $gunung->update($data);

        return redirect()->route('gunung.index')->with('success', 'Data gunung berhasil diperbarui.');
    }

    /**
     * Remove the specified mountain and its photo.
     */
    public function destroy(Gunung $gunung): RedirectResponse
    {
        if ($gunung->foto) {
            Storage::disk('public')->delete($gunung->foto);
        }

        $gunung->delete();

        return redirect()->route('gunung.index')->with('success', 'Data gunung berhasil dihapus.');
    }
}