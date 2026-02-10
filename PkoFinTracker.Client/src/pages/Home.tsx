import * as React from "react";
import type {Transaction} from "../types/Transaction.ts";
import {useEffect} from "react";
import axios from "axios";


export const Home: React.FC = () => {
    const [transactions, setTransactions] = React.useState<Transaction[]>([]);
    useEffect(() => {
        axios.get('http://localhost:5093/api/Transaction/transactions')
            .then(res => {
                setTransactions(res.data);
            }).catch(err => console.log(err));
    }, []);
    return (
        <div className="overflow-x-auto rounded-xl border border-gray-800 bg-bank-comp text-white">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
                <h1 className="text-xl font-semibold">Recent Transaction</h1>
                {/*<div className="flex items-center gap-3">*/}
                {/*    <button className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-lg hover:bg-gray-700 transition text-sm">*/}
                {/*        <span>Recent</span>*/}
                {/*        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">*/}
                {/*            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>*/}
                {/*        </svg>*/}
                {/*    </button>*/}
                {/*</div>*/}
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                    <tr className="border-b border-gray-800">
                        <th>ID</th>
                        <th>Transaction</th>
                        <th>Category</th>
                        <th>Date Time</th>
                        <th>Cost</th>
                    </tr>
                    </thead>
                    <tbody>
                    {transactions.map((t, index) => (
                        <tr
                            key={t.id}
                            className={`hover:bg-gray-800/50 transition ${
                                index !== transactions.length - 1 ? 'border-b border-gray-800' : ''
                            }`}
                        >
                            <td className="">
                                #{t.id.substring(0, 8)}
                            </td>
                            <td className="">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-light"
                                        style={{
                                            backgroundColor: `hsl(${(index * 137) % 360}, 65%, 55%)`
                                        }}
                                    >
                                        {t.description?.charAt(0).toUpperCase() || 'T'}
                                    </div>
                                    <span className="font-medium truncate max-w-xs">
                                    {t.description}
                                    </span>
                                </div>
                            </td>
                            <td>
                                {t.categoryName}
                            </td>
                            <td className="whitespace-nowrap">
                                {new Date(t.bookingDate).toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    day: 'numeric',
                                    month: 'short',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </td>
                            <td className="whitespace-nowrap">
                                {t.amount} {t.currency}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            
            {transactions.length === 0 && (
                <div className="py-12 text-center text-gray-400">
                    <p>Немає транзакцій для відображення</p>
                </div>
            )}
        </div>
    )
}