import type {BankAccount} from "../types/BankAccount.ts";
import * as React from "react";
import {Eye, EyeOff} from "lucide-react";
import CountUp from "react-countup";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';

export interface AccountCardProps {
    accounts: BankAccount[];
    isLoading?: boolean;
}

const AccountCard: React.FC<AccountCardProps> = ({accounts, isLoading}) => {
    const account = accounts[0];
    const [showNumber, setShowNumber] = React.useState(false);
    const currency = accounts?.[0]?.currency;

    const formatIBAN = (iban: string) => {
        if (showNumber) {
            return iban.match(/.{1,4}/g)?.join(' ') || iban;
        }
        return `•••• ${iban.slice(-4)}`;
    };
    
    const currencySymbols: Record<string, string> = {
            'EUR': '€',
            'USD': '$',
            'UAH': '₴',
            'GBP': '£',
            'PLN': 'zł'
        };

    const symbol = currencySymbols[currency] || currency;
        
    return (
        <div className="justify-center col-span-4 rounded-2xl bg-bank-comp p-5 ">
            <div className="flex items-center mb-3 space-x-4">
                <h1 className="text-white text-xl">MyCard</h1>
                <button
                    onClick={() => setShowNumber(!showNumber)}
                    className="p-1.5 hover:bg-white/20 rounded-lg transition"
                >
                    {showNumber ? <EyeOff className="w-6 h-6 text-white " /> : <Eye className="w-6 h-6  text-white" />}
                </button>
            </div>
            <div className="relative max-w-90 h-52 bg-gradient-to-br from-bank-purple via-bank-purple to-pink-200 rounded-2xl p-5 text-white shadow-xl overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-white rounded-full"></div>
                    <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-white rounded-full"></div>
                </div>
                
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div className="text-3xl font-bold italic">
                            {isLoading ? <Skeleton width={80} height={35} /> : "VISA"}
                        </div>
                        <div>
                            <p className="text-2xl opacity-80">Balance</p>
                            {isLoading ? (
                                ""
                                // <Skeleton baseColor="rgba(255,255,255,0.1)" width={150} height={40} />
                            ) : (
                                <CountUp
                                    end={account?.balance ?? 0}
                                    duration={1.5}
                                    separator=","
                                    decimals={2}
                                    prefix={symbol}
                                    className="text-3xl font-semibold tabular-nums text-white"
                                />
                            )}
                        </div>

                        <div className="flex items-center justify-end">
                            <div className="text-right font-mono text-base tracking-wider">
                                {isLoading ? (
                                    <Skeleton width={180} height={20} />
                                ) : (
                                    formatIBAN(account?.iban ?? "")
                                )}
                            </div>
                        </div>
                    </div>
            </div>
        </div>
    )
}

export default AccountCard;