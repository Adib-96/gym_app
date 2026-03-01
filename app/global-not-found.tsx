import './globals.css'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: '404 - Rep Not Found',
    description: 'Looks like you lifted too heavy and got lost.',
}

export default function GlobalNotFound() {
    return (
        <html lang="en" className={inter.className}>
            <head>
                <style dangerouslySetInnerHTML={{
                    __html: `
                    @keyframes blob {
                        0% { transform: translate(0px, 0px) scale(1); }
                        33% { transform: translate(40px, -60px) scale(1.1); }
                        66% { transform: translate(-30px, 30px) scale(0.9); }
                        100% { transform: translate(0px, 0px) scale(1); }
                    }
                    @keyframes float {
                        0% { transform: translateY(0px); }
                        50% { transform: translateY(-15px); }
                        100% { transform: translateY(0px); }
                    }
                    .animate-blob {
                        animation: blob 8s infinite ease-in-out;
                    }
                    .animation-delay-2000 {
                        animation-delay: 2s;
                    }
                    .animation-delay-4000 {
                        animation-delay: 4s;
                    }
                    .animate-float {
                        animation: float 6s ease-in-out infinite;
                    }
                `}} />
            </head>
            <body className="bg-slate-950 text-white min-h-screen flex items-center justify-center overflow-hidden selection:bg-indigo-500/30">
                {/* Background effects */}
                <div className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)]" />
                    <div className="absolute top-1/4 left-1/4 w-72 h-72 md:w-96 md:h-96 bg-indigo-600/30 rounded-full blur-[100px] mix-blend-screen animate-blob" />
                    <div className="absolute bottom-1/4 right-1/4 w-72 h-72 md:w-96 md:h-96 bg-fuchsia-600/30 rounded-full blur-[100px] mix-blend-screen animate-blob animation-delay-2000" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 md:w-96 md:h-96 bg-blue-600/30 rounded-full blur-[100px] mix-blend-screen animate-blob animation-delay-4000" />
                </div>

                <div className="relative z-10 text-center px-6 w-full max-w-4xl mx-auto flex flex-col items-center">
                    {/* The 404 Glitch/Glow effect */}
                    <div className="relative mb-6 group cursor-default animate-float">
                        <h1 className="text-[9.5rem] sm:text-[14rem] md:text-[18rem] font-black leading-none text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 via-fuchsia-500 to-blue-500 drop-shadow-[0_0_40px_rgba(99,102,241,0.4)] transition-all duration-500 group-hover:scale-105 group-hover:drop-shadow-[0_0_80px_rgba(168,85,247,0.6)]">
                            404
                        </h1>
                    </div>

                    <div className="space-y-6 w-full max-w-2xl backdrop-blur-sm bg-slate-900/40 p-10 md:p-12 rounded-[2.5rem] border border-slate-800/80 shadow-[0_0_60px_-15px_rgba(0,0,0,0.8)] mx-auto">
                        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent pb-1">
                            Looks like you skipped leg day.
                        </h2>

                        <p className="text-slate-400 text-lg md:text-xl leading-relaxed">
                            The page you&apos;re looking for has been lifted away, or it&apos;s currently taking a rest day between sets. Let&apos;s get you back to your routine.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-6 w-full">
                            <a
                                href="/"
                                className="w-full sm:w-auto group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-300 bg-indigo-600 rounded-2xl hover:bg-indigo-500 hover:shadow-[0_0_30px_rgba(79,70,229,0.4)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 focus:ring-offset-slate-900 active:scale-95 overflow-hidden"
                            >
                                <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
                                <span className="relative flex items-center gap-3">
                                    Return to Base
                                    <svg className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                                    </svg>
                                </span>
                            </a>

                            <a
                                href="/auth/signin"
                                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 font-bold text-slate-300 transition-all duration-300 border-2 border-slate-700/50 hover:border-slate-500 bg-slate-800/30 rounded-2xl hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-700 focus:ring-offset-slate-900 active:scale-95"
                            >
                                Switch Account
                            </a>
                        </div>
                    </div>

                    {/* Decorative bottom elements */}
                    <div className="mt-16 flex items-center justify-center gap-3 opacity-40 px-6 py-3 rounded-full border border-slate-800/80 bg-slate-900/50 backdrop-blur-md">
                        <div className="h-2 w-2 bg-rose-500 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
                        <span className="text-xs font-semibold tracking-widest uppercase text-slate-400">System Offline</span>
                    </div>
                </div>
            </body>
        </html>
    )
}