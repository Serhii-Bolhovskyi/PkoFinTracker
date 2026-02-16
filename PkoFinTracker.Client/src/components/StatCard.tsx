import * as React from "react";

export interface StatCardProps {
    title: string,
    amount?: number,
    qty?: number,
    diff?: number,
    currency: string,
    type: 'income' | 'expense' | 'info',
    icon?: React.ReactNode,

}

const CURRENCY_SYMBOLS: Record<string, string> = {
    'EUR': '€',
    'USD': '$',
    'UAH': '₴',
    'GBP': '£',
    'PLN': 'zł'
};

const StatCard: React.FC<StatCardProps> = ({title, amount, diff, currency, type}) => {
    const isIncome = type === 'income';
    const isPositive = (diff ?? 0) > 0;
    const currencySymbol = CURRENCY_SYMBOLS[currency] || currency;
    return (
        <div className="bg-bank-comp p-5 rounded-2xl flex flex-col">
            <span className="text-white text-xl font-normal">
                {title}
            </span>

            <div className="flex items-baseline mt-1">
                <h3 className="text-2xl font-semibold text-white">
                    {currencySymbol}{amount?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </h3>
            </div>

            <div className="mt-3 flex items-center start flex-wrap gap-1 ">
                <div className={`flex font-bold text-lg space-x-1 ${isIncome ? 'text-emerald-500' : 'text-red-600'}`}>
                    <span>{isPositive ? '↑' : '↓'} </span>
                    <span>{diff?.toFixed(1)}%</span>
                </div>
                <span className="text-white opacity-60"> From last month</span>
            </div>
        </div>
    )
}

export default StatCard;