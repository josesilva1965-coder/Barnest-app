import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface PandLData {
    totalRevenue: number;
    totalCogs: number;
    grossProfit: number;
    totalPayroll: number;
    totalOperatingExpenses: number;
    netProfit: number;
}

interface Expenses {
    rent: number;
    insurance: number;
    utilities: number;
}

interface PandLStatementProps {
    data: PandLData;
    expenses: Expenses;
    onUpdateExpenses: (newExpenses: Partial<Expenses>) => void;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(value);
};

const NumberInput: React.FC<{ label: string, value: number, onChange: (value: number) => void }> = ({ label, value, onChange }) => (
    <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        <div className="flex items-center">
            <span className="inline-flex items-center px-3 text-sm text-gray-300 bg-brand-primary/50 border border-r-0 border-gray-600 rounded-l-md h-full">$</span>
            <input
                type="number"
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                className="w-full p-2 rounded-r bg-brand-primary border border-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                step="100"
                min="0"
            />
        </div>
    </div>
);

const PandLStatement: React.FC<PandLStatementProps> = ({ data, expenses, onUpdateExpenses }) => {
    const [localExpenses, setLocalExpenses] = useState(expenses);
    const [isSaved, setIsSaved] = useState(true);

    useEffect(() => {
        setLocalExpenses(expenses);
    }, [expenses]);
    
    const handleExpenseChange = (field: keyof Expenses, value: number) => {
        setLocalExpenses(prev => ({ ...prev, [field]: value }));
        setIsSaved(false);
    };
    
    const handleSave = () => {
        onUpdateExpenses(localExpenses);
        setIsSaved(true);
    };

    const profitColor = (value: number) => value >= 0 ? 'text-green-400' : 'text-red-400';

    return (
        <Card title="Profit & Loss Statement">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 space-y-4">
                    <h3 className="text-lg font-bold text-brand-accent">Operating Expenses</h3>
                    <p className="text-xs text-gray-400 -mt-2">Enter your monthly fixed and variable costs. Payroll is calculated automatically from staff schedules.</p>
                    <NumberInput label="Rent / Mortgage" value={localExpenses.rent} onChange={v => handleExpenseChange('rent', v)} />
                    <NumberInput label="Insurance" value={localExpenses.insurance} onChange={v => handleExpenseChange('insurance', v)} />
                    <NumberInput label="Utilities" value={localExpenses.utilities} onChange={v => handleExpenseChange('utilities', v)} />
                    <Button onClick={handleSave} disabled={isSaved} className="w-full">
                        {isSaved ? 'Saved' : 'Save Expenses'}
                    </Button>
                </div>
                <div className="md:col-span-2 space-y-3 p-4 bg-brand-primary/20 rounded-lg">
                    <div className="flex justify-between items-center text-lg border-b border-brand-primary pb-2">
                        <span>Total Revenue</span>
                        <span className="font-bold">{formatCurrency(data.totalRevenue)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>- Cost of Goods Sold (COGS)</span>
                        <span className="text-gray-300">({formatCurrency(data.totalCogs)})</span>
                    </div>
                     <div className="flex justify-between items-center text-xl font-bold border-b-2 border-brand-primary pb-2">
                        <span>Gross Profit</span>
                        <span className={profitColor(data.grossProfit)}>{formatCurrency(data.grossProfit)}</span>
                    </div>
                    <div className="pt-2">
                        <p className="font-semibold text-gray-300 mb-1">Operating Expenses</p>
                         <div className="flex justify-between items-center pl-4">
                            <span>Payroll</span>
                            <span className="text-gray-300">({formatCurrency(data.totalPayroll)})</span>
                        </div>
                         <div className="flex justify-between items-center pl-4">
                            <span>Rent / Mortgage</span>
                            <span className="text-gray-300">({formatCurrency(localExpenses.rent)})</span>
                        </div>
                         <div className="flex justify-between items-center pl-4">
                            <span>Insurance</span>
                            <span className="text-gray-300">({formatCurrency(localExpenses.insurance)})</span>
                        </div>
                         <div className="flex justify-between items-center pl-4 pb-2 border-b border-brand-primary">
                            <span>Utilities</span>
                            <span className="text-gray-300">({formatCurrency(localExpenses.utilities)})</span>
                        </div>
                         <div className="flex justify-between items-center font-bold pt-1">
                            <span>Total Operating Expenses</span>
                            <span>({formatCurrency(data.totalOperatingExpenses)})</span>
                        </div>
                    </div>
                     <div className="flex justify-between items-center text-2xl font-bold border-t-2 border-brand-primary pt-2 mt-2">
                        <span>Net Profit / Loss</span>
                        <span className={profitColor(data.netProfit)}>{formatCurrency(data.netProfit)}</span>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default PandLStatement;