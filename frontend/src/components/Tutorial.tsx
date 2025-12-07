import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, MessageSquarePlus } from 'lucide-react';

export interface TutorialStep {
    title: string;
    description: string;
    target?: string; // CSS selector for element to highlight
    position?: 'top' | 'bottom' | 'left' | 'right';
}

const DEFAULT_TUTORIAL_STEPS: TutorialStep[] = [
    {
        title: '¡Bienvenido a Toro Group Financial!',
        description: 'Tu hub central para la gestión de operaciones de remesas y cambio de divisas. Vamos a dar un recorrido rápido.',
    },
    {
        title: 'Panel de Control (Ticker)',
        description: 'Aquí verás las tasas de cambio en tiempo real (BCV, Binance, Global). Se actualizan automáticamente.',
        target: '.ticker-dashboard', // Need to add this class to the Ticker in App.tsx
        position: 'bottom'
    },
    {
        title: 'Estadísticas Rápidas',
        description: 'Visualiza el volumen total, ganancia neta y operaciones pendientes de un vistazo.',
        target: '.stats-cards', // Need to add this class to Stats container in App.tsx
        position: 'bottom'
    },
    {
        title: 'Scanner Inteligente',
        description: 'Usa esta herramienta para escanear recibos o documentos y extraer datos automáticamente con IA.',
        target: '.smart-scanner-section', // Need to add this class
        position: 'right'
    },
    {
        title: 'Navegación Vertical',
        description: 'Accede a Transacciones, Clientes, Operadores y Configuración desde este menú lateral.',
        target: '.sidebar-navigation', // Need to add this class
        position: 'right'
    },
    {
        title: '¡Todo listo!',
        description: 'Ya puedes empezar a registrar operaciones. Si necesitas volver a ver este tutorial, busca el botón en el menú.',
    },
];

interface TutorialProps {
    onComplete: () => void;
    steps?: TutorialStep[];
}

export const Tutorial: React.FC<TutorialProps> = ({ onComplete, steps }) => {
    const finalSteps = steps || DEFAULT_TUTORIAL_STEPS;
    const [currentStep, setCurrentStep] = useState(0);
    const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
    const [showSuggestion, setShowSuggestion] = useState(false);
    const [suggestionText, setSuggestionText] = useState('');

    const step = finalSteps[currentStep];
    const isLastStep = currentStep === finalSteps.length - 1;
    const isFirstStep = currentStep === 0;

    useEffect(() => {
        if (step.target) {
            const element = document.querySelector(step.target) as HTMLElement;
            setTargetElement(element);

            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        } else {
            setTargetElement(null);
        }
    }, [currentStep, step.target]);

    const handleNext = () => {
        if (isLastStep) {
            onComplete();
        } else {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (!isFirstStep) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSkip = () => {
        onComplete();
    };

    // Calculate position for tooltip
    const getTooltipPosition = () => {
        if (!targetElement) {
            return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
        }

        const rect = targetElement.getBoundingClientRect();
        const position = step.position || 'bottom';

        switch (position) {
            case 'top':
                return { top: `${rect.top - 20}px`, left: `${rect.left + rect.width / 2}px`, transform: 'translate(-50%, -100%)' };
            case 'bottom':
                return { top: `${rect.bottom + 20}px`, left: `${rect.left + rect.width / 2}px`, transform: 'translate(-50%, 0)' };
            case 'left':
                return { top: `${rect.top + rect.height / 2}px`, left: `${rect.left - 20}px`, transform: 'translate(-100%, -50%)' };
            case 'right':
                return { top: `${rect.top + rect.height / 2}px`, left: `${rect.right + 20}px`, transform: 'translate(0, -50%)' };
            default:
                return { top: `${rect.bottom + 20}px`, left: `${rect.left + rect.width / 2}px`, transform: 'translate(-50%, 0)' };
        }
    };

    const tooltipStyle = getTooltipPosition();

    return (
        <div className="fixed inset-0 z-[9990]">
            {/* Spotlight Effect Layer */}
            {targetElement ? (
                <div
                    className="absolute border-2 border-amber-400/70 rounded-lg shadow-[0_0_30px_rgba(251,191,36,0.5)] pointer-events-none transition-all duration-300 z-[9995]"
                    style={{
                        top: `${targetElement.getBoundingClientRect().top - 8}px`,
                        left: `${targetElement.getBoundingClientRect().left - 8}px`,
                        width: `${targetElement.getBoundingClientRect().width + 16}px`,
                        height: `${targetElement.getBoundingClientRect().height + 16}px`,
                        // The huge box shadow dims the rest of the screen while keeping the inside clear
                        boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.8)',
                    }}
                />
            ) : (
                <div className="absolute inset-0 bg-black/60 z-[9995]" />
            )}

            {/* Tutorial Card */}
            <div
                className="absolute bg-slate-800 border border-slate-600 rounded-2xl shadow-2xl p-6 max-w-md w-full transition-all duration-300 ring-1 ring-white/10 z-[10000]"
                style={{
                    ...tooltipStyle,
                    position: 'fixed' // Ensure it's fixed relative to viewport, not parent
                }}
            >
                {/* Decorative Elements */}
                <div className="absolute -top-1 -right-1 w-20 h-20 bg-gradient-to-bl from-purple-500/20 to-transparent rounded-tr-2xl -z-10"></div>
                <div className="absolute -bottom-1 -left-1 w-20 h-20 bg-gradient-to-tr from-blue-500/20 to-transparent rounded-bl-2xl -z-10"></div>

                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-amber-200 bg-clip-text text-transparent mb-1">
                            {showSuggestion ? 'Tu Opinión Importa' : step.title}
                        </h3>
                        {!showSuggestion && (
                            <p className="text-xs text-slate-400">
                                Paso {currentStep + 1} de {finalSteps.length}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={handleSkip}
                        className="text-slate-500 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                {showSuggestion ? (
                    <div className="mb-4">
                        <p className="text-slate-300 mb-3 text-sm">¿Tienes alguna idea para mejorar esta sección? Cuéntanos:</p>
                        <textarea
                            className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 mb-3 resize-none h-24"
                            placeholder="Escribe tu sugerencia aquí..."
                            value={suggestionText}
                            onChange={(e) => setSuggestionText(e.target.value)}
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowSuggestion(false)}
                                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => {
                                    alert('¡Gracias! Tu sugerencia ha sido guardada (simulación).');
                                    setSuggestionText('');
                                    setShowSuggestion(false);
                                }}
                                className="px-4 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-purple-900/40"
                            >
                                Enviar
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <p className="text-slate-300 mb-6 leading-relaxed text-sm">
                            {step.description}
                        </p>

                        {/* Progress Bar */}
                        <div className="mb-6 relative">
                            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-300 relative"
                                    style={{ width: `${((currentStep + 1) / finalSteps.length) * 100}%` }}
                                >
                                    <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/50 blur-[2px]"></div>
                                </div>
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="flex justify-between items-center">
                            <div className="flex gap-2">
                                <button
                                    onClick={handlePrevious}
                                    disabled={isFirstStep}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors border border-transparent ${isFirstStep
                                        ? 'text-slate-600 cursor-not-allowed'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800 hover:border-slate-700'
                                        }`}
                                >
                                    <ChevronLeft size={16} />
                                </button>

                                <button
                                    onClick={() => setShowSuggestion(true)}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors text-amber-500/80 hover:text-amber-300 hover:bg-amber-900/20 border border-transparent hover:border-amber-500/30"
                                >
                                    <MessageSquarePlus size={14} />
                                    Buzón de Sugerencias
                                </button>
                            </div>

                            {!isLastStep ? (
                                <button
                                    onClick={handleNext}
                                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-lg transition-all shadow-lg shadow-blue-900/40 text-sm font-medium"
                                >
                                    Siguiente
                                    <ChevronRight size={16} />
                                </button>
                            ) : (
                                <button
                                    onClick={handleSkip}
                                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white rounded-lg transition-all shadow-lg shadow-orange-900/40 text-sm font-medium"
                                >
                                    ¡Empezar!
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
