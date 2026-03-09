<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Court;
use Inertia\Inertia;

class CourtController extends Controller
{
    public function index()
    {
        $courts = Court::all();

        return Inertia::render('Home', [
            'courts' => $courts
        ]);
    }
}