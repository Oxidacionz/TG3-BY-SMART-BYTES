import React, { useState, useRef, useEffect } from 'react';

export const LogoTuner = () => {
    const [scale, setScale] = useState(2.1);
    const [posX, setPosX] = useState(0);
    const [posY, setPosY] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX - posX, y: e.clientY - posY });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging) {
            setPosX(e.clientX - dragStart.x);
            setPosY(e.clientY - dragStart.y);
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleWheel = (e: React.WheelEvent) => {
        // Zoom in/out
        const zoomIntensity = 0.05;
        const newScale = scale + (e.deltaY > 0 ? -zoomIntensity : zoomIntensity);
        setScale(Math.min(Math.max(1, newScale), 5));
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-4" onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
            <h1 className="text-2xl font-bold mb-8 text-amber-500">Logo Tuner Tool</h1>

            <div className="flex gap-8 items-start">
                {/* PREVIEW AREA (Exact Replica of Login) */}
                <div className="relative w-full max-w-xs bg-slate-900 rounded-2xl shadow-2xl border border-slate-700/50 p-6">
                    <div className="relative w-32 h-32 mb-4 mx-auto border-4 border-amber-500/50 rounded-full overflow-hidden flex items-center justify-center bg-slate-950 cursor-move"
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onWheel={handleWheel}
                        ref={containerRef}
                    >
                        <img
                            src="https://kkkwfimgkemxwgvqvaob.supabase.co/storage/v1/object/public/assets/toro_logo.png"
                            alt="Logo Tuning"
                            className="w-full h-full object-cover transition-transform duration-75 ease-linear pointer-events-none"
                            style={{
                                transform: `scale(${scale}) translate(${posX}px, ${posY}px)`
                            }}
                            onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = "https://tg3-by-smart-bytes.onrender.com/static/logo.jpg";
                            }}
                        />
                    </div>

                    <p className="text-center text-xs text-slate-500 mt-4">
                        Drag to Move • Scroll to Zoom
                    </p>
                </div>

                {/* CONTROLS AREA */}
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 w-64 space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 mb-2">Scale (Zoom): {scale.toFixed(2)}</label>
                        <input
                            type="range"
                            min="1"
                            max="5"
                            step="0.05"
                            value={scale}
                            onChange={(e) => setScale(parseFloat(e.target.value))}
                            className="w-full"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-400 mb-2">Position X: {posX}px</label>
                        <input
                            type="range"
                            min="-100"
                            max="100"
                            value={posX}
                            onChange={(e) => setPosX(parseInt(e.target.value))}
                            className="w-full"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-400 mb-2">Position Y: {posY}px</label>
                        <input
                            type="range"
                            min="-100"
                            max="100"
                            value={posY}
                            onChange={(e) => setPosY(parseInt(e.target.value))}
                            className="w-full"
                        />
                    </div>

                    <div className="pt-4 border-t border-slate-700">
                        <p className="text-xs font-mono text-green-400 bg-slate-950 p-2 rounded">
                            scale-[{scale.toFixed(2)}]<br />
                            translate-x-[{posX}px]<br />
                            translate-y-[{posY}px]
                        </p>
                        <p className="text-[10px] text-slate-500 mt-2">
                            *Note: Tailwind arbitrary values shown. Copy these numbers.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
