<?php

namespace Modules\Booking\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Modules\Booking\Http\Requests\BookingRequest;
use Modules\Booking\Models\Booking;
use Modules\Gunung\Models\Gunung;

class BookingController extends Controller
{
    /**
     * Display the React page. Booking data is loaded via AJAX.
     */
    public function index(): Response
    {
        return Inertia::render('Booking::index', [
            'gunung' => Gunung::orderBy('nama_gunung')->get(['id', 'nama_gunung']),
        ]);
    }

    /**
     * Return all bookings as JSON.
     */
    public function getData(): JsonResponse
    {
        $data = Booking::with('gunung')->latest()->get()->map(fn (Booking $booking) => [
            'id' => $booking->id,
            'nama_gunung' => $booking->gunung?->nama_gunung,
            'nama_pendaki' => $booking->nama_pendaki,
            'no_hp' => $booking->no_hp,
            'tanggal_naik' => $booking->tanggal_naik->format('d-m-Y'),
            'jumlah_pendaki' => $booking->jumlah_pendaki,
            'status' => $booking->status,
            'nama_bukti' => $booking->nama_bukti,
            'bukti_url' => $booking->bukti_bayar ? asset('storage/'.$booking->bukti_bayar) : null,
        ]);

        return response()->json($data);
    }

    /**
     * Store a newly created booking together with its uploaded proof.
     */
    public function store(BookingRequest $request): JsonResponse
    {
        $data = $request->safe()->except('bukti_bayar');

        if ($request->hasFile('bukti_bayar')) {
            $file = $request->file('bukti_bayar');
            $data['nama_bukti'] = $file->getClientOriginalName();
            $data['bukti_bayar'] = $file->store('bukti_booking', 'public');
        }

        Booking::create($data);

        return response()->json(['message' => 'Booking berhasil ditambahkan.']);
    }

    /**
     * Return a single booking for the edit form.
     */
    public function edit(Booking $booking): JsonResponse
    {
        return response()->json([
            'id' => $booking->id,
            'gunung_id' => $booking->gunung_id,
            'nama_pendaki' => $booking->nama_pendaki,
            'no_hp' => $booking->no_hp,
            'tanggal_naik' => $booking->tanggal_naik->format('Y-m-d'),
            'jumlah_pendaki' => $booking->jumlah_pendaki,
            'status' => $booking->status,
            'nama_bukti' => $booking->nama_bukti,
            'bukti_url' => $booking->bukti_bayar ? asset('storage/'.$booking->bukti_bayar) : null,
        ]);
    }

    /**
     * Update the specified booking. The old proof is replaced only when a new one is uploaded.
     */
    public function update(BookingRequest $request, Booking $booking): JsonResponse
    {
        $data = $request->safe()->except('bukti_bayar');

        if ($request->hasFile('bukti_bayar')) {
            if ($booking->bukti_bayar) {
                Storage::disk('public')->delete($booking->bukti_bayar);
            }

            $file = $request->file('bukti_bayar');
            $data['nama_bukti'] = $file->getClientOriginalName();
            $data['bukti_bayar'] = $file->store('bukti_booking', 'public');
        }

        $booking->update($data);

        return response()->json(['message' => 'Booking berhasil diperbarui.']);
    }

    /**
     * Remove the specified booking and its uploaded proof.
     */
    public function destroy(Booking $booking): JsonResponse
    {
        if ($booking->bukti_bayar) {
            Storage::disk('public')->delete($booking->bukti_bayar);
        }

        $booking->delete();

        return response()->json(['message' => 'Booking berhasil dihapus.']);
    }
}