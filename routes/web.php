<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookingController;    

/*
|--------------------------------------------------------------------------
| Public Pages
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Inertia::render('Index');
});

Route::get('/court-admin', function () {
    return Inertia::render('Index');
});

//api routes
Route::get('/courts', [AuthController::class, 'court']);
Route::get('/courts/count', [AuthController::class, 'courtCount']);
Route::get('/bookings/time', [AuthController::class, 'times']);

//bookings
Route::post('/bookings', [BookingController::class, 'store'])->middleware('auth');
Route::get('/bookings/slots', [BookingController::class, 'slots']);
Route::get('/bookings/my-bookings', [BookingController::class, 'myBookings'])
    ->middleware('auth');
/*
|--------------------------------------------------------------------------
| Guest Routes (Only for non-authenticated users)
|--------------------------------------------------------------------------
*/

Route::middleware('guest')->group(function () {

    Route::get('/auth', function () {
        return Inertia::render('Auth');
    })->name('auth');

    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
});

/*
|--------------------------------------------------------------------------
| Password Reset
|--------------------------------------------------------------------------
*/

Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])->middleware('guest');

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/my-reservations', function () {
        return Inertia::render('MyReservations');
    });

});

/*
|--------------------------------------------------------------------------
| Verified User Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('/dashboard', 'dashboard')->name('dashboard');
});

require __DIR__ . '/settings.php';