import * as React from "react";

export interface StatCardProps {
    title: string,
    amount?: number,
    qty?: number,
    diff?: number,
    currency: string,
    type: 'income' | 'expense' | 'info',
    page?: 'dashboard' | 'transaction',
    icon?: React.ReactNode,

}

const CURRENCY_SYMBOLS: Record<string, string> = {
    'EUR': '€',
    'USD': '$',
    'UAH': '₴',
    'GBP': '£',
    'PLN': 'zł'
};

const StatCard: React.FC<StatCardProps> = ({title, amount, qty, diff, currency, type, page, icon}) => {
    const isIncome = type === 'income';
    const isPositive = (diff ?? 0) > 0;
    const currencySymbol = CURRENCY_SYMBOLS[currency] || currency;
    return (
        <div className={`${page === 'transaction' ? 'space-y-2' : ''} h-full bg-bank-comp p-5 rounded-2xl flex flex-col justify-between`}>
            <div className={`${icon ? 'flex items-center' : ''} text-white text-xl font-normal`}>
                {icon && 
                    <div className="mr-4 p-2 rounded-full 
                              bg-gradient-to-br from-white/10 via-gray-700/40 to-black/40
                              border border-white/10
                              shadow-inner shadow-white/10
                              backdrop-blur-sm">
                        {icon}
                    </div>}
                <p>{title}</p>
            </div>

            <div className="flex items-baseline">
                <h3 className="text-2xl font-semibold text-white">
                    {type === 'info' 
                        ?  <span>{qty}</span> 
                        : <span>{currencySymbol}{amount?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>}
                </h3>
            </div>

            <div className={`${page === 'transaction' ? 'flex-row-reverse justify-between' : ''} flex items-center start flex-wrap gap-1`}>
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