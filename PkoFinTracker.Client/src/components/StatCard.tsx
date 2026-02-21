import * as React from "react";
import CountUp from "react-countup";
import { TrendingUp,TrendingDown  } from 'lucide-react';
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';

export interface StatCardProps {
    title: string,
    amount?: number,
    qty?: number,
    diff?: number,
    currency: string,
    type: 'income' | 'expense' | 'info',
    page?: 'dashboard' | 'transaction',
    icon?: React.ReactNode,
    isLoading?: boolean,
}

export const CURRENCY_SYMBOLS: Record<string, string> = {
    'EUR': '€',
    'USD': '$',
    'UAH': '₴',
    'GBP': '£',
    'PLN': 'zł'
};

const StatCard: React.FC<StatCardProps> = ({title, amount, qty, diff, currency, type, page, icon, isLoading}) => {
    const isIncome = type === 'income';
    const isPositive = (diff ?? 0) > 0;
    const currencySymbol = CURRENCY_SYMBOLS[currency] || currency;
    return (
        <div className={`${page === 'transaction' ? 'space-y-2' : 'space-y-3'} h-full bg-bank-comp p-5 rounded-2xl flex flex-col justify-between`}>
            <div 
                className={` ${icon ? 'flex items-center' : ''}
                            ${page === 'transaction' ? "h-12" : ""} text-white text-xl font-normal`}>
                {page === 'transaction' && (
                    <div className="mr-4 flex-shrink-0">
                        {isLoading ? (
                            <Skeleton circle width={40} height={40} />
                        ) : (
                            icon && (
                                <div className="p-2 rounded-full 
                                  bg-gradient-to-br from-white/10 via-gray-700/40 to-black/40
                                  border border-white/10
                                  shadow-inner shadow-white/10
                                  backdrop-blur-sm flex items-center justify-center">
                                    {icon}
                                </div>
                            )
                        )}
                    </div>
                )}
                <div className="flex-1 leading-none">
                    {isLoading ? (
                        <Skeleton width={120} height={20}/>
                    ) : (
                        <p className="truncate">{title}</p>
                    )}
                </div>
            </div>

            <div className="flex h-8 items-baseline">
                {isLoading ? (
                    <Skeleton width={100} height={23}/>
                ) : (
                        <CountUp
                            end={type === 'info' ? Number(qty) : amount ?? 0}
                            duration={1.5}
                            separator=","
                            decimals={type === 'info' ? 0 : 1}
                            prefix={type === 'info' ? "" : currencySymbol }
                            className="text-2xl font-semibold tabular-nums text-white"
                        />
                )}
            </div>
            
            {page === 'dashboard' && (
                <div className="flex items-center start flex-wrap h-12">
                    <div className={`flex m-0 font-bold text-lg space-x-1 ${isIncome ? 'text-emerald-500' : 'text-red-600'}`}>
                        {isLoading ? (<Skeleton width={80} height={15} />) : (
                            <div className="flex space-x-1">
                                <span>{isPositive ? <TrendingUp className='w-6 h-6'/> : <TrendingDown className='w-6 h-6'/>} </span>
                                <CountUp
                                    end={diff ?? 0}
                                    duration={1}
                                    separator=","
                                    decimals={1}
                                    suffix="%"
                                    className="tabular-nums"
                                />
                            </div>
                        )}
                    </div>
                    {isLoading ? <Skeleton width={115} height={15}/> : <span className="text-white opacity-60"> From last month</span>}
                </div>
            )}
        </div>
    )
}

export default StatCard;