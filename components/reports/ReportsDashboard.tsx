import React, { useMemo } from 'react';
import Card from '../ui/Card';
import { DAILY_SALES, TOP_SELLING_ITEMS, INVENTORY_DATA, SALES_DATA, STAFF_DATA, SHIFTS_DATA } from '../../constants';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';
import MenuEngineeringMatrix from './MenuEngineeringMatrix';
import { MenuItem } from '../../types';
import PandLStatement from './PandLStatement';

interface ReportsDashboardProps {
    menuItems: MenuItem[];
    operatingExpenses: { rent: number; insurance: number; utilities: number };
    onUpdateOperatingExpenses: (newExpenses: Partial<{ rent: number; insurance: number; utilities: number }>) => void;
}

const ReportsDashboard: React.FC<ReportsDashboardProps> = ({ menuItems, operatingExpenses, onUpdateOperatingExpenses }) => {

    const menuEngineeringData = useMemo(() => {
        const matrixData = menuItems.map(menuItem => {
            let costOfGoodsSold = 0;
            if (menuItem.recipe) {
                costOfGoodsSold = menuItem.recipe.reduce((total, recipeItem) => {
                    const inventoryItem = INVENTORY_DATA.find(i => i.id === recipeItem.inventoryItemId);
                    return total + (inventoryItem ? inventoryItem.cost * recipeItem.amount : 0);
                }, 0);
            }

            const profitability = menuItem.price - costOfGoodsSold;

            const sale = SALES_DATA.find(s => s.menuItemId === menuItem.id);
            const popularity = sale ? sale.quantitySold : 0;

            return {
                name: menuItem.name,
                profitability,
                popularity
            };
        }).filter(item => item.popularity > 0);

        if (matrixData.length === 0) {
            return { matrixData: [], avgProfitability: 0, avgPopularity: 0 };
        }
        
        const totalItemsSold = matrixData.reduce((sum, item) => sum + item.popularity, 0);
        const totalProfitContribution = matrixData.reduce((sum, item) => sum + (item.profitability * item.popularity), 0);
        
        const avgProfitability = totalItemsSold > 0 ? totalProfitContribution / totalItemsSold : 0;
        const avgPopularity = totalItemsSold > 0 ? totalItemsSold / matrixData.length : 0;
        
        return { matrixData, avgProfitability, avgPopularity };
    }, [menuItems]);

    const statementData = useMemo(() => {
        const totalRevenue = SALES_DATA.reduce((acc, sale) => {
            const menuItem = menuItems.find(item => item.id === sale.menuItemId);
            return acc + (menuItem ? menuItem.price * sale.quantitySold : 0);
        }, 0);

        const totalCogs = SALES_DATA.reduce((acc, sale) => {
            const menuItem = menuItems.find(item => item.id === sale.menuItemId);
            if (!menuItem || !menuItem.recipe) return acc;

            const itemCost = menuItem.recipe.reduce((cost, recipeItem) => {
                const inventoryItem = INVENTORY_DATA.find(i => i.id === recipeItem.inventoryItemId);
                return cost + (inventoryItem ? inventoryItem.cost * recipeItem.amount : 0);
            }, 0);

            return acc + (itemCost * sale.quantitySold);
        }, 0);

        const calculateShiftHours = (startTime: string, endTime: string): number => {
            const [startHours, startMinutes] = startTime.split(':').map(Number);
            let [endHours, endMinutes] = endTime.split(':').map(Number);
        
            if (endHours === 0 && endMinutes === 0 && (startHours > 0 || startMinutes > 0)) {
                endHours = 24;
            }
        
            const startTotalMinutes = startHours * 60 + startMinutes;
            let endTotalMinutes = endHours * 60 + endMinutes;
        
            let durationInMinutes;
            if (endTotalMinutes < startTotalMinutes) {
                durationInMinutes = (24 * 60 - startTotalMinutes) + endTotalMinutes;
            } else {
                durationInMinutes = endTotalMinutes - startTotalMinutes;
            }
        
            return durationInMinutes / 60;
        };
        
        const totalPayroll = SHIFTS_DATA.reduce((acc, shift) => {
            const staffMember = STAFF_DATA.find(s => s.id === shift.staffId);
            if (!staffMember) return acc;
            
            const hours = calculateShiftHours(shift.startTime, shift.endTime);
            return acc + (hours * staffMember.hourlyRate);
        }, 0);

        const grossProfit = totalRevenue - totalCogs;
        const totalOperatingExpenses = operatingExpenses.rent + operatingExpenses.insurance + operatingExpenses.utilities + totalPayroll;
        const netProfit = grossProfit - totalOperatingExpenses;
        
        return {
            totalRevenue,
            totalCogs,
            grossProfit,
            totalPayroll,
            totalOperatingExpenses,
            netProfit
        };

    }, [menuItems, operatingExpenses]);


    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Reports Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card title="Today's Revenue">
                    <p className="text-4xl font-bold text-green-400">$8,940</p>
                    <p className="text-gray-400">+12% from yesterday</p>
                </Card>
                <Card title="Total Orders">
                     <p className="text-4xl font-bold text-blue-400">215</p>
                     <p className="text-gray-400">Peak hour: 8-9 PM</p>
                </Card>
                <Card title="Average Check Size">
                    <p className="text-4xl font-bold text-purple-400">$41.58</p>
                    <p className="text-gray-400">Up from $38.90 last week</p>
                </Card>
            </div>

            <PandLStatement
                data={statementData}
                expenses={operatingExpenses}
                onUpdateExpenses={onUpdateOperatingExpenses}
            />

            <MenuEngineeringMatrix 
                data={menuEngineeringData.matrixData}
                avgProfitability={menuEngineeringData.avgProfitability}
                avgPopularity={menuEngineeringData.avgPopularity}
            />

            <Card title="Daily Sales Performance (This Week)">
                <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={DAILY_SALES}>
                        <defs>
                            <linearGradient id="colorFood" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorDrinks" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2}/>
                        <XAxis dataKey="day" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #4a4a4a' }}/>
                        <Legend />
                        <Area type="monotone" dataKey="food" stroke="#82ca9d" fillOpacity={1} fill="url(#colorFood)" />
                        <Area type="monotone" dataKey="drinks" stroke="#f97316" fillOpacity={1} fill="url(#colorDrinks)" />
                    </AreaChart>
                </ResponsiveContainer>
            </Card>

            <Card title="Top Selling Items by Revenue">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={TOP_SELLING_ITEMS}>
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2}/>
                        <XAxis dataKey="name" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip cursor={{fill: 'rgba(249, 115, 22, 0.1)'}} contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #4a4a4a' }}/>
                        <Legend />
                        <Bar dataKey="revenue" fill="#f97316" name="Revenue ($)" />
                    </BarChart>
                </ResponsiveContainer>
            </Card>
        </div>
    );
};

export default ReportsDashboard;