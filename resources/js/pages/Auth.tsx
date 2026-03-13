import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import { Mail, Lock, User, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { safeFetch } from '../utils/safeFetch';

type AuthMode = 'signin' | 'signup' | 'forgot';

const Auth = () => {
    const [mode, setMode] = useState<AuthMode>('signin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    // const handleSignIn = (e: React.FormEvent) => {
    //     e.preventDefault();
    //     setLoading(true);
    //     setFormError(null);

    //     router.post(
    //         '/login',
    //         { email, password },
    //         {
    //             onSuccess: () => {
    //                 toast.success('Signed in successfully!');
    //             },
    //             onError: (errors: any) => {
    //                 if (errors.email) {
    //                     setFormError(
    //                         Array.isArray(errors.email)
    //                             ? errors.email[0]
    //                             : errors.email,
    //                     );
    //                 } else {
    //                     setFormError('Sign in failed.');
    //                 }
    //             },
    //             onFinish: () => setLoading(false),
    //         },
    //     );
    // };

    // const handleSignUp = (e: React.FormEvent) => {
    //     e.preventDefault();
    //     setLoading(true);
    //     setFormError(null);

    //     router.post(
    //         '/register',
    //         { name: fullName, email, password },
    //         {
    //             onSuccess: () => {
    //                 toast.success('Account created successfully!');
    //             },
    //             onError: (errors: any) => {
    //                 if (errors.name) {
    //                     setFormError(
    //                         Array.isArray(errors.name)
    //                             ? errors.name[0]
    //                             : errors.name,
    //                     );
    //                 } else if (errors.email) {
    //                     setFormError(
    //                         Array.isArray(errors.email)
    //                             ? errors.email[0]
    //                             : errors.email,
    //                     );
    //                 } else if (errors.password) {
    //                     setFormError(
    //                         Array.isArray(errors.password)
    //                             ? errors.password[0]
    //                             : errors.password,
    //                     );
    //                 } else {
    //                     setFormError('Sign up failed.');
    //                 }
    //             },
    //             onFinish: () => setLoading(false),
    //         },
    //     );
    // };

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setFormError(null);

        try {
            // Step 1: Refresh CSRF before login
            await safeFetch('/sanctum/csrf-cookie');

            // Step 2: Login via Inertia
            router.post(
                '/login',
                { email, password },
                {
                    onSuccess: async () => {
                        // Step 3: Refresh CSRF after login
                        await safeFetch('/sanctum/csrf-cookie');

                        // Step 4: Force page reload to update CSRF meta tag
                        window.location.reload();
                    },
                    onError: (errors: any) => {
                        if (errors.email) {
                            setFormError(
                                Array.isArray(errors.email)
                                    ? errors.email[0]
                                    : errors.email,
                            );
                        } else {
                            setFormError('Sign in failed.');
                        }
                    },
                    onFinish: () => {
                        // toast.success('Signed in successfully!');
                        setLoading(false);
                    },
                },
            );
        } catch (err) {
            console.error(err);
            setFormError('Sign in failed.');
            setLoading(false);
        }
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setFormError(null);

        try {
            // Step 1: Refresh CSRF before registration
            await safeFetch('/sanctum/csrf-cookie');

            // Step 2: Register via Inertia
            router.post(
                '/register',
                { name: fullName, email, password },
                {
                    onSuccess: async () => {
                        toast.success('Account created successfully!');

                        // Step 3: Refresh CSRF after signup
                        await safeFetch('/sanctum/csrf-cookie');

                        // Step 4: Force page reload to update CSRF meta tag
                        window.location.reload();
                    },
                    onError: (errors: any) => {
                        if (errors.name) {
                            setFormError(
                                Array.isArray(errors.name)
                                    ? errors.name[0]
                                    : errors.name,
                            );
                        } else if (errors.email) {
                            setFormError(
                                Array.isArray(errors.email)
                                    ? errors.email[0]
                                    : errors.email,
                            );
                        } else if (errors.password) {
                            setFormError(
                                Array.isArray(errors.password)
                                    ? errors.password[0]
                                    : errors.password,
                            );
                        } else setFormError('Sign up failed.');
                    },
                    onFinish: () => setLoading(false),
                },
            );
        } catch (err) {
            console.error(err);
            setFormError('Sign up failed.');
            setLoading(false);
        }
    };

    const handleForgotPassword = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        router.post(
            '/forgot-password',
            { email },
            {
                onSuccess: () =>
                    toast.success('Reset link sent! Check your email.'),
                onError: () => toast.error('Failed to send reset link.'),
                onFinish: () => setLoading(false),
            },
        );
    };

    const switchMode = (newMode: AuthMode) => {
        setMode(newMode);
        setEmail('');
        setPassword('');
        setFullName('');
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#f5f0e6] to-[#e8dfd0] p-4">
            <motion.div
                className="w-full max-w-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="mb-8 text-center">
                    <a
                        href="/"
                        className="inline-block text-2xl font-bold text-black"
                    >
                        🏓 Picklora
                    </a>
                    <p className="text-sm text-gray-500">
                        {mode === 'signin' &&
                            'Sign in to manage your reservations'}
                        {mode === 'signup' &&
                            'Create an account to start booking'}
                        {mode === 'forgot' && "We'll send you a reset link"}
                    </p>
                </div>

                <div className="rounded-xl bg-white p-8 shadow-lg">
                    {mode === 'forgot' ? (
                        <form
                            onSubmit={handleForgotPassword}
                            className="space-y-4"
                        >
                            <button
                                type="button"
                                onClick={() => switchMode('signin')}
                                className="mb-2 flex items-center gap-1 text-sm text-gray-500"
                            >
                                <ArrowLeft className="h-4 w-4" /> Back
                            </button>
                            <h2 className="text-xl font-bold text-black">
                                Forgot Password
                            </h2>

                            <div className="relative">
                                <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-black" />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full rounded-lg border px-10 py-2.5 text-sm text-black"
                                />
                            </div>

                            <Button className="w-full bg-gradient-to-r from-[#0e96b8] to-[#5acde7] text-white">
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </Button>
                        </form>
                    ) : (
                        <form
                            onSubmit={
                                mode === 'signin' ? handleSignIn : handleSignUp
                            }
                            className="space-y-4"
                        >
                            <h2 className="text-xl font-bold text-black">
                                {mode === 'signin'
                                    ? 'Welcome Back!'
                                    : 'Create Account'}
                            </h2>

                            {mode === 'signin' && formError && (
                                <div className="rounded bg-red-100 px-4 py-2 text-sm text-red-700">
                                    {formError}
                                </div>
                            )}

                            {mode === 'signup' && (
                                <div className="relative">
                                    <User className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-black" />
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        value={fullName}
                                        onChange={(e) =>
                                            setFullName(e.target.value)
                                        }
                                        required
                                        className="w-full rounded-lg border px-10 py-2.5 text-sm text-black"
                                    />
                                </div>
                            )}

                            <div className="relative">
                                <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-black" />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (formError) setFormError(null);
                                    }}
                                    required
                                    className="w-full rounded-lg border border-gray-300 bg-white px-10 py-2.5 text-sm text-black focus:ring-2 focus:ring-[#0e96b8] focus:outline-none"
                                    autoFocus
                                />
                            </div>

                            <div className="relative">
                                <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-black" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (formError) setFormError(null);
                                    }}
                                    required
                                    className="w-full rounded-lg border border-gray-300 bg-white px-10 py-2.5 text-sm text-black focus:ring-2 focus:ring-[#0e96b8] focus:outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute top-1/2 right-3 -translate-y-1/2 text-black"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>

                            {mode === 'signin' && (
                                <button
                                    type="button"
                                    onClick={() => switchMode('forgot')}
                                    className="text-sm text-blue-500 hover:underline"
                                >
                                    Forgot password?
                                </button>
                            )}

                            <Button className="w-full cursor-pointer bg-gradient-to-r from-[#0e96b8] to-[#5acde7] text-white">
                                {loading
                                    ? 'Please wait...'
                                    : mode === 'signin'
                                      ? 'Sign In'
                                      : 'Sign Up'}
                            </Button>

                            <p className="text-center text-sm text-gray-500">
                                {mode === 'signin'
                                    ? "Don't have an account?"
                                    : 'Already have an account?'}{' '}
                                <button
                                    type="button"
                                    onClick={() =>
                                        switchMode(
                                            mode === 'signin'
                                                ? 'signup'
                                                : 'signin',
                                        )
                                    }
                                    className="cursor-pointer font-medium text-blue-500 hover:underline"
                                >
                                    {mode === 'signin' ? 'Sign Up' : 'Sign In'}
                                </button>
                            </p>
                        </form>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default Auth;
