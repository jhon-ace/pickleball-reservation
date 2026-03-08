<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Index');
});

// Route::inertia('/', 'welcome')->name('home');

// Route::inertia('/', 'welcome', [
//     'canRegister' => Features::enabled(Features::registration()),
// ])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';
