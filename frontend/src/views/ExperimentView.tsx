import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Icons } from '../components/atoms/Icons';

export const ExperimentView: React.FC = () => {
    const [activeTab, setActiveTab] = useState('COBRAR');
    const [isModalOpen, setModalOpen] = useState(false);

    // Mock Data
    const data = [
        { name: 'Cobros', value: 4000, color: '#00D4AA' },
        { name: 'Pagos', value: 2400, color: '#FF6B6B' },
    ];

    const movements = [
        { id: 1, date: '28/12/25', concept: 'Venta Cliente A', debit: 500, credit: 0, balance: 500, status: 'Completado' },
        { id: 2, date: '28/12/25', concept: 'Pago Proveedor X', debit: 0, credit: 200, balance: 300, status: 'Pendiente' },
        { id: 3, date: '27/12/25', concept: 'Cobro Factura #003', debit: 1200, credit: 0, balance: 1500, status: 'Completado' },
    ];

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-gray-200 p-6 font-sans">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-wide">Toro Group Account Book</h1>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Experimental Nano Banana View</p>
                </div>
                <div className="flex bg-[#1E1E1E] rounded-full p-1 border border-gray-800">
                    {['COBRAR', 'PAGAR', 'TESORERIA'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${activeTab === tab
                                ? 'bg-[#00D4AA] text-black shadow-[0_0_15px_rgba(0,212,170,0.4)]'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-[#1E1E1E] p-6 rounded-2xl border border-gray-800 shadow-xl hover:border-[#00D4AA] transition-colors group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-gray-900 rounded-xl text-[#00D4AA] group-hover:bg-[#00D4AA] group-hover:text-black transition-colors">
                            <Icons.Wallet />
                        </div>
                        <span className="text-[10px] uppercase font-bold text-gray-500">Total Pendiente</span>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-1">Bs 125,400</h3>
                    <p className="text-sm text-gray-400">$ 3,250.00 USD</p>
                </div>

                <div className="bg-[#1E1E1E] p-6 rounded-2xl border border-gray-800 shadow-xl hover:border-red-500 transition-colors group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-gray-900 rounded-xl text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors">
                            <Icons.Clock />
                        </div>
                        <span className="text-[10px] uppercase font-bold text-gray-500">Vencen Hoy</span>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-1">3 Facturas</h3>
                    <p className="text-sm text-gray-400">Acción requerida</p>
                </div>

                <div className="bg-[#1E1E1E] p-6 rounded-2xl border border-gray-800 shadow-xl flex items-center justify-between">
                    <div>
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-gray-900 rounded-xl text-amber-500">
                                <Icons.Reports />
                            </div>
                            <span className="text-[10px] uppercase font-bold text-gray-500 ml-4">Flujo Mes</span>
                        </div>
                        <h3 className="text-2xl font-bold text-white">+ 12%</h3>
                    </div>
                    <div className="w-24 h-24">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={data} innerRadius={25} outerRadius={35} paddingAngle={5} dataKey="value">
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1E1E1E', borderColor: '#333', borderRadius: '8px', fontSize: '10px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Action Bar */}
            <div className="flex justify-end mb-6">
                <button
                    onClick={() => setModalOpen(true)}
                    className="bg-[#00D4AA] hover:bg-[#00bda0] text-black px-6 py-3 rounded-xl font-bold shadow-[0_0_20px_rgba(0,212,170,0.3)] hover:shadow-[0_0_30px_rgba(0,212,170,0.5)] transition-all flex items-center gap-2"
                >
                    <Icons.Plus /> Registrar Transacción
                </button>
            </div>

            {/* Table */}
            <div className="bg-[#1E1E1E] rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
                <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
                    <h3 className="font-bold text-white">Movimientos Recientes</h3>
                    <button className="text-xs text-[#00D4AA] hover:underline">Ver Todo</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-400">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-900/50">
                            <tr>
                                <th className="px-6 py-4 font-bold">Fecha</th>
                                <th className="px-6 py-4 font-bold">Concepto</th>
                                <th className="px-6 py-4 font-bold text-green-500">Débito</th>
                                <th className="px-6 py-4 font-bold text-red-500">Crédito</th>
                                <th className="px-6 py-4 font-bold text-white">Saldo</th>
                                <th className="px-6 py-4 font-bold">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {movements.map((move) => (
                                <tr key={move.id} className="hover:bg-gray-800/50 transition-colors">
                                    <td className="px-6 py-4 font-mono">{move.date}</td>
                                    <td className="px-6 py-4 text-white font-medium">{move.concept}</td>
                                    <td className="px-6 py-4 text-[#00D4AA]">{move.debit > 0 ? `+${move.debit}` : '-'}</td>
                                    <td className="px-6 py-4 text-red-400">{move.credit > 0 ? `-${move.credit}` : '-'}</td>
                                    <td className="px-6 py-4 font-bold text-white">{move.balance}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${move.status === 'Completado' ? 'bg-green-900/30 text-[#00D4AA]' : 'bg-yellow-900/30 text-yellow-500'
                                            }`}>
                                            {move.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Mock */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#1E1E1E] rounded-3xl w-full max-w-lg border border-gray-700 shadow-[0_0_50px_rgba(0,0,0,0.5)] p-6 relative animate-in fade-in zoom-in duration-300">
                        <button
                            onClick={() => setModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                        >
                            ✕
                        </button>

                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            Registrar Transacción
                        </h2>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase font-bold text-gray-500">Tipo Operación</label>
                                    <select className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-[#00D4AA] outline-none appearance-none font-medium">
                                        <option>💰 Venta</option>
                                        <option>📉 Gasto</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase font-bold text-gray-500">Categoría</label>
                                    <select className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-[#00D4AA] outline-none appearance-none font-medium">
                                        <option>Capital</option>
                                        <option>Operativo</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] uppercase font-bold text-gray-500">Cliente</label>
                                <select className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-[#00D4AA] outline-none appearance-none font-medium">
                                    <option>-- Seleccionar --</option>
                                    <option>Cliente A</option>
                                    <option>Cliente B</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-2 space-y-1">
                                    <label className="text-[10px] uppercase font-bold text-gray-500">Monto</label>
                                    <div className="relative">
                                        <input type="number" placeholder="500.00" className="w-full bg-black border border-gray-700 rounded-xl pl-4 pr-16 py-3 text-white font-mono font-bold focus:border-[#00D4AA] outline-none" />
                                        <div className="absolute right-2 top-2 bottom-2">
                                            <select className="h-full bg-gray-900 border-none text-xs rounded-lg px-2 text-gray-300 font-bold outline-none cursor-pointer hover:text-white">
                                                <option>Bs</option>
                                                <option>USD</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase font-bold text-gray-500">Ref</label>
                                    <input type="text" placeholder="#001" className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white font-mono focus:border-[#00D4AA] outline-none" />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-800">
                                <button className="w-full bg-[#2A2A2A] hover:bg-[#333] border-2 border-dashed border-gray-700 hover:border-[#00D4AA] text-gray-400 hover:text-white py-4 rounded-xl transition-all flex flex-col items-center gap-2 group">
                                    <Icons.Upload />
                                    <span className="text-xs font-bold uppercase">Subir Comprobante</span>
                                </button>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => setModalOpen(false)}
                                    className="flex-1 py-3 rounded-xl font-bold text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button className="flex-1 bg-[#00D4AA] hover:bg-[#00bda0] text-black py-3 rounded-xl font-bold shadow-lg shadow-[#00D4AA]/20 transition-all transform hover:scale-[1.02]">
                                    Guardar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
