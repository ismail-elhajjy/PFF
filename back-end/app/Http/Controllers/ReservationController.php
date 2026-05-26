<?php

namespace App\Http\Controllers;

use App\Models\Billboard;
use App\Models\Reservation;
use App\Models\User;
use App\Notifications\ReservationConfirmed;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReservationController extends Controller
{
    // This Method is used to create a new reservation
    public function store(Request $request)
    {
        // validation
        $request->validate([
            'billboard_id' => 'required|exists:billboards,id',
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after:start_date',
            'phone' => 'required|string',
            'company_name' => 'nullable|string',
            'creative_file' => 'required|file|max:51200',
        ]);
        // get the billboard with the given id
        $billboard = Billboard::findOrFail($request->billboard_id);

        // check if the type of the billboard is allowed
        $allowedMimes = '';
        if ($billboard->type === 'Classic') {
            $allowedMimes = 'mimes:jpg,jpeg,png';
        } elseif ($billboard->type === 'LED') {
            $allowedMimes = 'mimes:mp4,mov,avi';
        } elseif ($billboard->type === 'Digital') {
            $allowedMimes = 'mimes:jpg,jpeg,png,mp4,mov,avi';
        }

        $request->validate([
            'creative_file' => $allowedMimes,
        ]);

        // check if the billboard is already reserved
        $startDate = $request->start_date;
        $endDate = $request->end_date;
        $isAlreadyBooked = Reservation::where('billboard_id', $billboard->id)
            ->where('status', 'confirmed')
            ->where(function ($query) use ($startDate, $endDate) {
                $query->whereBetween('start_date', [$startDate, $endDate])
                    ->orWhereBetween('end_date', [$startDate, $endDate])
                    ->orWhere(function ($q) use ($startDate, $endDate) {
                        $q->where('start_date', '<=', $startDate)
                            ->where('end_date', '>=', $endDate);
                    });
            })->exists();

        if ($isAlreadyBooked) {
            return response()->json([
                'message' => 'Unfortunately, this panel is already reserved on this date.',
            ], 422);
        }
        $filePath = $request->file('creative_file')->store('creatives', 'public');

        // calculate the total price with carbon library
        $start = Carbon::parse($request->start_date);
        $end = Carbon::parse($request->end_date);
        $daysCount = $start->diffInDays($end) + 1;
        $billboardPrice = (float) $billboard->price;
        $totalPrice = ($billboardPrice * $daysCount) / 30;
        $finalPrice = ceil($totalPrice / 100) * 100;

        // create the reservation with the given data
        $reservation = Reservation::create([
            'user_id' => Auth::id(),
            'billboard_id' => $billboard->id,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'total_price' => $finalPrice,
            'phone' => $request->phone,
            'company_name' => $request->company_name,
            'creative_path' => $filePath,
            'status' => 'pending',
        ]);

        // send a notification to the user
        $user = Auth::user();
        $user->notify(new ReservationConfirmed($reservation));

        // send a notification to every admin dashboard
        $reservation->loadMissing(['user', 'billboard']);
        User::where('role', 'admin')->get()->each(function ($admin) use ($reservation) {
            $admin->notify(new ReservationConfirmed($reservation));
        });

        return response()->json([
            'message' => 'Your reservation request has been sent successfully.',
            'reservation' => $reservation,
        ], 201);
    }

    // This Method is used to get the user's reservations
    public function myReservations()
    {
        $userReservations = Reservation::with('billboard')
            ->where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($userReservations);
    }

    // This Method is used to get user his reservations by getting pdf
    public function generatePDF($id)
    {
        $reservation = Reservation::with('billboard', 'user')->findOrFail($id);
        $data = [
            'title' => 'Reservation Receipt - AtlasAds',
            'date' => now()->format('d/m/Y'),
            'reservation' => $reservation,
        ];
        $pdf = Pdf::loadView('reservation_pdf', $data);
        return $pdf->download('reservation_'.$id.'.pdf', [
            'Content-Type' => 'application/pdf',
            'Access-Control-Expose-Headers' => 'Content-Disposition',
        ]);
    }

    // This Method is used to cancel a reservation
    public function cancel($id)
    {
        $reservation = Reservation::where('id', $id)
            ->where('user_id', auth()->id())
            ->first();

        if (! $reservation) {
            return response()->json([
                'message' => 'Reservation not found or unauthorized.',
            ], 404);
        }
        if (strtolower($reservation->status) !== 'pending') {
            return response()->json([
                'message' => 'Only pending reservations can be cancelled.',
            ], 403);
        }

        $reservation->update([
            'status' => 'cancelled',
        ]);

        return response()->json([
            'message' => 'Reservation cancelled successfully.',
        ], 200);
    }

    public function index()
    {
        $reservations = Reservation::with(['user:id,name,email', 'billboard:id,title,city,zone,type'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($reservations);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,confirmed,cancelled,rejected',
        ]);

        $reservation = Reservation::findOrFail($id);
        $reservation->update([
            'status' => $request->status
        ]);

        return response()->json([
            'message' => 'Reservation status updated to ' . $request->status,
            'reservation' => $reservation
        ]);
    }
}
