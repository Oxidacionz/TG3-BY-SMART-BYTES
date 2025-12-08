import React from 'react';

// 4. Badge
export const Badge: React.FC<{ status: string }> = ({ status }) => {
    let colorClass = "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300";
    if (status === 'Completado' || status === 'Recibido' || status === 'Pagado') colorClass = "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800";
    if (status === 'Pendiente' || status === 'Pendiente Recepción' || status === 'En Revisión') colorClass = "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800";
    if (status === 'Cancelado') colorClass = "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800";

    const getIcon = () => {
        if (status === 'Pendiente Recepción') return <span className="mr-1">📥</span>;
        if (status === 'En Revisión') return <span className="mr-1">👀</span>;
        if (status === 'Pagado') return <span className="mr-1">💸</span>;
        if (status === 'Recibido') return <span className="mr-1">✅</span>;
        return null;
    };

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center w-fit ${colorClass}`}>
            {getIcon()}{status}
        </span>
    );
};
