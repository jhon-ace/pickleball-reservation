<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\Time;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Carbon\Carbon;

class BookingController extends Controller
{
    // public function store(Request $request)
    // {
    //     $request->validate([
    //         'court_id' => 'required|exists:courts,id',
    //         'date' => 'required|date',
    //         'time' => 'required|string',
    //     ]);

    //     $booking = Booking::create([
    //         'reference_number' => 'PB-' . Carbon::parse($request->date)->format('Y-m-d') . '-' . strtoupper(Str::random(4)),
    //         'court_id' => $request->court_id,
    //         'user_id' => Auth::id(),
    //         'date' => $request->date,
    //         'time' => $request->time,
    //         'status' => 'available',
    //         'is_pending' => 1,
    //     ]);

    //     return response()->json([
    //         'success' => true,
    //         'booking' => $booking,
    //     ]);
    // }

    // public function store(Request $request)
    // {
    //     $request->validate([
    //         'court_id' => 'required|exists:courts,id',
    //         'date' => 'required|date',
    //         'mode' => 'required|in:day,night,open',
    //         'times' => 'required|array|min:1',
    //         'times.*' => 'required|string'
    //     ]);

    //     // $reference = 'AKW-' . Carbon::parse($request->date)->format('Y-m-d') . '-' . strtoupper(Str::random(4));
    //     $reference = 'AKW-' . strtoupper(Carbon::parse($request->date)->format('Y-M-d')) . '-' . strtoupper(Str::random(4));

    //     $booking = null;

    //     foreach ($request->times as $time) {

    //         $exists = Booking::where('court_id', $request->court_id)
    //             ->where('date', $request->date)
    //             ->where('time', $time)
    //             ->exists();

    //         if ($exists) {
    //             return response()->json([
    //                 'success' => false,
    //                 'message' => "Time slot $time already booked"
    //             ], 422);
    //         }

    //         $booking = Booking::create([
    //             'reference_number' => $reference,
    //             'court_id' => $request->court_id,
    //             'user_id' => Auth::id(),
    //             'date' => $request->date,
    //             'time' => $time,
    //             'mode' => $request->mode,
    //             'status' => 'available',
    //             'is_pending' => 1,
    //         ]);
    //     }

    //     return response()->json([
    //         'success' => true,
    //         'booking' => [
    //             'reference_number' => $reference,
    //             'is_pending' => true
    //         ]
    //     ]);
    // }


    public function store(Request $request)
    {
        $request->validate([
            'court_id' => 'required|exists:courts,id',
            'date' => 'required|date',
            'mode' => 'required|in:day,night,open',
            'time_id' => 'sometimes|required|exists:times,id',
            'time_ids' => 'sometimes|required|array|min:1',
            'time_ids.*' => 'required|exists:times,id',
        ]);

        $reference = 'AKW-' . strtoupper(Carbon::parse($request->date)->format('Y-M-d')) . '-' . strtoupper(Str::random(4));

        $timesToBook = [];

        if ($request->has('time_ids')) {
            $timesToBook = $request->time_ids;
        } elseif ($request->has('time_id')) {
            $timesToBook = [$request->time_id];
        } else {
            return response()->json([
                'success' => false,
                'message' => 'No times selected'
            ], 422);
        }

        foreach ($timesToBook as $timeId) {
            $timeLabel = \DB::table('times')->where('id', $timeId)->value('label');

            $exists = Booking::where('court_id', $request->court_id)
                ->where('date', $request->date)
                ->where('time_id', $timeId)
                ->exists();

            if ($exists) {
                return response()->json([
                    'success' => false,
                    'message' => "Time slot $timeLabel already booked"
                ], 422);
            }

            $timeRecord = \DB::table('times')->where('id', $timeId)->first();

            Booking::create([
                'reference_number' => $reference,
                'court_id' => $request->court_id,
                'user_id' => Auth::id(),
                'date' => $request->date,
                'time_id' => $timeId,
                'time' => $timeRecord->start_time, // <-- store HH:MM:SS
                'mode' => $request->mode,
                'status' => 'available',
                'is_pending' => 1,
            ]);
        }

        return response()->json([
            'success' => true,
            'booking' => [
                'reference_number' => $reference,
                'is_pending' => true
            ]
        ]);
    }

    // public function slots(Request $request)
    // {
    //     $request->validate([
    //         'court_id' => 'required|exists:courts,id',
    //         'date' => 'required|date',
    //     ]);

    //     $booked = Booking::where('court_id', $request->court_id)
    //         ->where('date', $request->date)
    //         ->pluck('time');

    //     return response()->json($booked);
    // }
    public function slots(Request $request)
    {
        $request->validate([
            'court_id' => 'required|exists:courts,id',
            'date' => 'required|date',
        ]);

        // Fetch all booked times for this court and date including the user who booked
        $booked = Booking::where('court_id', $request->court_id)
            ->where('date', $request->date)
            ->get(['time_id', 'is_pending', 'user_id']); // <-- add user_id

        return response()->json($booked);
    }
    // public function slots(Request $request)
    // {
    //     $request->validate([
    //         'court_id' => 'required|exists:courts,id',
    //         'date' => 'required|date',
    //     ]);

    //     // Fetch all booked times for this court and date
    //     $booked = Booking::where('court_id', $request->court_id)
    //         ->where('date', $request->date)
    //         ->get(['time_id', 'is_pending']); // include both time_id and is_pending

    //     return response()->json($booked);
    // }
    // public function slots(Request $request)
    // {
    //     $request->validate([
    //         'court_id' => 'required|exists:courts,id',
    //         'date' => 'required|date',
    //     ]);

    //     // Fetch all booked times for this court and date
    //     $booked = Booking::where('court_id', $request->court_id)
    //         ->where('date', $request->date)
    //         ->pluck('time'); // 05:00:00, 06:00:00 ...

    //     return response()->json($booked);
    // }

    public function myBookings()
    {
        $user = auth()->user();

        // Adjust per page as needed
        $perPage = 6;

        $bookings = Booking::where('user_id', $user->id)
            ->with('court')
            ->latest()
            ->paginate($perPage)
            ->through(function ($booking) {
                return [
                    'id' => $booking->id,
                    'court_name' => $booking->court->name,
                    'date' => $booking->date,
                    'time' => $booking->time,
                    'is_pending' => $booking->is_pending,
                ];
            });

        return response()->json($bookings);
    }

}