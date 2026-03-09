<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use App\Models\User;
use Inertia\Inertia;

class AuthController extends Controller
{

    public function login(Request $request)
    {
        $request->validate([
            'email' => ['required','email'],
            'password' => ['required'],
        ]);

        if (method_exists(Auth::class, 'hasTooManyLoginAttempts') && Auth::hasTooManyLoginAttempts($request)) {
            throw ValidationException::withMessages([
                'email' => 'Too many login attempts. Please try again later.'
            ]);
        }

        if (!Auth::attempt($request->only('email','password'), true)) {
            throw ValidationException::withMessages([
                'email' => 'Invalid email or password.',
            ]);
        }

        $request->session()->regenerate();

        return redirect('/')->with('success', 'Logged in successfully.');
    }
    public function register(Request $request)
    {
        $validatedData = $request->validate(
            [
                'name' => ['required', 'string', 'max:255'],
                'email' => ['required', 'email', 'unique:users,email'],
                'password' => ['required', 'min:6'],
            ],
            [
                'name.required' => 'Full name is required.',
                'email.required' => 'Email is required.',
                'email.email' => 'Please enter a valid email.',
                'email.unique' => 'Email already exists. Please use another.',
                'password.required' => 'Password is required.',
                'password.min' => 'Password must be at least 6 characters.',
            ]
        );

        if (strlen($validatedData['password']) < 6) {
            throw ValidationException::withMessages([
                'password' => 'Password must be at least 6 characters.',
            ]);
        }

        $user = User::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'password' => Hash::make($validatedData['password']),
        ]);

        Auth::login($user);

        return redirect('/')->with('success', 'Account created successfully.');
    }


    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => ['required','email'],
        ]);

        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status === Password::RESET_LINK_SENT) {
            return response()->json([
                'success' => true,
                'message' => 'Password reset link sent to your email.'
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Unable to send password reset link.'
        ], 422);
    }


    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/')->with('success', 'Logged out successfully.');
    }
}