import type {BankAccount} from "../types/BankAccount.ts";
import * as React from "react";
import {Eye, EyeOff} from "lucide-react";

export interface AccountCardProps {
    accounts: BankAccount[];
}

const AccountCard: React.FC<AccountCardProps> = ({accounts}) => {
    const account = accounts[0];
    const [showNumber, setShowNumber] = React.useState(false);
    const [showBalance] = React.useState(true);

    const formatIBAN = (iban: string) => {
        if (showNumber) {
            return iban.match(/.{1,4}/g)?.join(' ') || iban;
        }
        return `•• •••• •••• ${iban.slice(-4)}`;
    };

    const formatBalance = (balance: number, currency: string) => {
        const currencySymbols: Record<string, string> = {
            'EUR': '€',
            'USD': '$',
            'UAH': '₴',
            'GBP': '£',
            'PLN': 'zł'
        };

        const symbol = currencySymbols[currency] || currency;

        if (showBalance) {
            return `${symbol}${balance.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}`;
        }
        return '••••••';
    };
    return (
        <div className="col-span-4 rounded-2xl bg-bank-comp p-5">
            <h1 className="text-white text-xl mb-3">MyCard</h1>
            <div className="relative w-full h-52 bg-gradient-to-br from-bank-purple via-bank-purple to-pink-200 rounded-2xl p-5 text-white shadow-xl overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-white rounded-full"></div>
                    <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-white rounded-full"></div>
                </div>

                <div className="relative z-10 h-full flex flex-col justify-between">
                    <div className="text-3xl font-bold italic">VISA</div>

                    <div>
                        <p className="text-2xl">Balance</p>
                        <h2 className="text-2xl font-semibold">
                            {formatBalance(account.balance, account.currency)}
                        </h2>
                    </div>

                    <div className="flex items-center justify-end space-x-5">
                        <button
                            onClick={() => setShowNumber(!showNumber)}
                            className="p-1.5 hover:bg-white/20 rounded-lg transition"
                        >
                            {showNumber ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                        <div className="text-right font-mono text-base tracking-wider">
                            {formatIBAN(account.iban)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AccountCard;