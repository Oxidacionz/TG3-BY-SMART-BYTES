import React from 'react';
import { User as UserIcon, Eye as EyeIcon, Sparkles, LifeBuoy } from 'lucide-react';

interface LoginTemplateProps {
    onLogin: (e: React.FormEvent) => void;
    onDemoLogin: () => void;
}

export const LoginTemplate: React.FC<LoginTemplateProps> = ({ onLogin, onDemoLogin }) => {
    return (
        <div
            className="min-h-screen w-full flex items-center justify-center relative overflow-hidden font-sans bg-cover bg-center"
            style={{ backgroundImage: "url('/TG3-BY-SMART-BYTES/final_fused_bg.png')" }}
        >
            {/* Capa oscura encima para asegurar que el texto se lea bien. */}
            <div className="absolute inset-0 bg-[#050b14] opacity-70 z-0"></div>

            {/* --- MAIN CARD --- */}
            <div className="relative z-10 w-full max-w-md p-[1px] rounded-3xl bg-gradient-to-b from-yellow-600/40 via-transparent to-yellow-600/40 shadow-2xl mt-12">
                <div className="bg-[#0f172a]/90 backdrop-blur-xl rounded-3xl w-full h-full p-8 pt-16 border border-white/5 relative flex flex-col items-center">

                    {/* --- LOGO (Overlapping Top) --- */}
                    <div className="absolute -top-20 z-20 p-1 rounded-full bg-gradient-to-b from-yellow-500/50 to-transparent">
                        <div className="w-36 h-36 rounded-full bg-slate-800 border-4 border-slate-900 overflow-hidden flex items-center justify-center shadow-[0_0_30px_rgba(234,179,8,0.4)]">
                            <img
                                src="/TG3-BY-SMART-BYTES/gold_bull.png"
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = "https://kkkwfimgkemxwgvqvaob.supabase.co/storage/v1/object/public/assets/toro_logo.png";
                                }}
                                alt="Toro Logo"
                                className="w-full h-full object-cover scale-[1.15]"
                            />
                        </div>
                    </div>

                    {/* Title Section */}
                    <div className="mt-10 mb-6 text-center">
                        <h1 className="text-3xl font-bold text-white tracking-wide drop-shadow-lg">TORO GROUP</h1>
                        <h2 className="text-yellow-500 text-sm font-semibold tracking-[0.2em] mt-2 border-b border-yellow-500/20 pb-2 inline-block">FINANCIAL SERVICES</h2>
                    </div>

                    {/* --- FORM --- */}
                    <form onSubmit={onLogin} className="w-full space-y-5">

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-wider">Usuario</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-yellow-500 transition-colors">
                                    <UserIcon size={20} />
                                </div>
                                <input
                                    type="text"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/50 border border-slate-800 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-transparent transition-all font-medium"
                                    placeholder="Ingrese su usuario"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-wider">Contraseña</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-yellow-500 transition-colors">
                                    <EyeIcon size={20} />
                                </div>
                                <input
                                    type="password"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/50 border border-slate-800 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-transparent transition-all font-bold tracking-widest"
                                    placeholder="........"
                                />
                            </div>
                        </div>

                        <button type="submit" className="w-full py-3.5 mt-4 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-900/40 transition-all transform hover:scale-[1.02] active:scale-[0.98] border border-blue-500/30">
                            Iniciar Sesión
                        </button>

                        <div className="relative flex items-center py-2">
                            <div className="flex-grow border-t border-slate-700/50"></div>
                            <span className="flex-shrink-0 mx-4 text-[10px] text-slate-500 uppercase tracking-widest">O explora</span>
                            <div className="flex-grow border-t border-slate-700/50"></div>
                        </div>

                        <button
                            type="button"
                            onClick={onDemoLogin}
                            className="w-full py-3 border border-yellow-500/20 hover:bg-yellow-500/10 text-yellow-500 font-semibold rounded-xl flex items-center justify-center gap-2 transition-all group backdrop-blur-sm"
                        >
                            Modo Demo Interactivo
                            <Sparkles size={16} className="text-yellow-400 group-hover:animate-pulse" />
                        </button>

                    </form>

                    {/* --- FOOTER --- */}
                    <div className="mt-8 w-full border-t border-slate-800/50 pt-4 flex flex-col items-center">
                        <div className="w-full flex justify-between items-center text-[10px] text-slate-500 mb-2 px-2">
                            <span>v2.5.0 Stable</span>
                            <div className="flex items-center gap-1 opacity-70 hover:opacity-100 cursor-pointer transition-opacity">
                                <LifeBuoy size={10} />
                                <span>Soporte 24/7</span>
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-center opacity-60 hover:opacity-90 transition-opacity duration-500">
                            <span className="text-[9px] text-slate-600 uppercase tracking-[0.2em] mb-1">Developed By</span>
                            <span className="font-serif italic text-yellow-500/80 text-lg tracking-wide" style={{ fontFamily: 'serif' }}>
                                SmartBytes.PF
                            </span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
