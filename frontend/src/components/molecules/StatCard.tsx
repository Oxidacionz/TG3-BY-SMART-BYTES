import React from 'react';
import { Card } from './Card';
import { Tooltip } from '../atoms/Tooltip';

/**
 * StatCard Component (Molecule)
 * Card for displaying statistics with icon and trend
 */

export interface StatCardProps {
    title: string;
    value: string | number;
    icon?: React.ReactNode;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    subtitle?: string;
    subtext?: string;
    color?: 'blue' | 'green' | 'yellow' | 'purple' | 'red';
    className?: string;
    tooltipText?: string;
    onClick?: () => void;
    reverseLayout?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    icon,
    trend,
    subtitle,
    subtext,
    color = 'blue',
    className = '',
    tooltipText,
    onClick,
    reverseLayout = false
}) => {
    const displaySubtitle = subtitle || subtext;

    const colorClasses = {
        blue: 'bg-blue-600/20 text-blue-400',
        green: 'bg-green-600/20 text-green-400',
        yellow: 'bg-yellow-600/20 text-yellow-400',
        purple: 'bg-purple-600/20 text-purple-400',
        red: 'bg-red-600/20 text-red-400'
    };

    const iconClass = colorClasses[color] || colorClasses.blue;

    return (
        <Card
            variant="glass"
            className={`!bg-gray-950 !border-gray-800 shadow-2xl ${className} ${onClick ? 'cursor-pointer hover:bg-slate-900/50 transition-colors' : ''}`}
            onClick={onClick}
        >
            <div className={`flex items-start justify-between ${reverseLayout ? 'flex-row-reverse' : ''}`}>
                <div className={`flex-1 ${reverseLayout ? 'text-right' : 'text-left'}`}>
                    <div className={`flex items-center gap-2 mb-1 ${reverseLayout ? 'justify-end' : ''}`}>
                        <p className="text-sm text-slate-400 font-medium">{title}</p>
                        {tooltipText && (
                            <Tooltip content={tooltipText} position="top">
                                <svg
                                    className="w-4 h-4 text-slate-500 hover:text-slate-300 cursor-help transition-colors"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </Tooltip>
                        )}
                    </div>
                    <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500 mb-1 tracking-wide">
                        {value}
                    </p>
                    {displaySubtitle && <p className="text-xs text-slate-500">{displaySubtitle}</p>}
                    {trend && (
                        <div className={`flex items-center gap-1 mt-2 text-sm font-semibold ${trend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                {trend.isPositive ? (
                                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                ) : (
                                    <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                )}
                            </svg>
                            {Math.abs(trend.value)}%
                        </div>
                    )}
                </div>
                {icon && (
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${iconClass} ${reverseLayout ? 'mr-4' : ''}`}>
                        {icon}
                    </div>
                )}
            </div>
        </Card>
    );
};
