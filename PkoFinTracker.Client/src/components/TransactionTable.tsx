import * as React from "react";
import type {Transaction} from "../types/Transaction.ts";

export interface TransactionProps {
    transactions: Transaction[];
}
const TransactionTable:React.FC<TransactionProps> = ({transactions}) => {
    return(
        <div className="col-span-8 row-span-2 col-start-1 overflow-x-auto rounded-xl border border-gray-800 bg-bank-comp text-white">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
                <h1 className="text-xl font-normal">Recent Transaction</h1>
            </div>

            <div className="overflow-x-auto max-h-60">
                <table className="w-full">
                    <thead className="">
                    <tr className="border-b border-gray-800">
                        <th>ID</th>
                        <th>Transaction</th>
                        <th>Category</th>
                        <th>Date Time</th>
                        <th className="pr-0">Cost</th>
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
                            <td className="pl-5">
                                #{t.id.substring(0, 8)}...
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
                                    <span className="max-w-40 truncate">
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
                            <td className={`whitespace-nowrap ${t.indicator === "DBIT" ? 'text-red-600' : 'text-emerald-600'} pr-2`}>
                                {t.indicator === 'DBIT' ? '-' : '+'}{t.amount} {t.currency}
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
export default TransactionTable