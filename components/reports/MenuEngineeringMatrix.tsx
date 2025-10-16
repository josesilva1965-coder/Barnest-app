import React from 'react';
import Card from '../ui/Card';
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine, Label, Legend } from 'recharts';

interface MatrixData {
    name: string;
    profitability: number;
    popularity: number;
}

interface MenuEngineeringMatrixProps {
    data: MatrixData[];
    avgProfitability: number;
    avgPopularity: number;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="p-2 bg-brand-dark border border-brand-primary rounded-md shadow-lg text-sm">
        <p className="font-bold text-brand-accent">{data.name}</p>
        <p>Profitability: <span className="font-semibold">${data.profitability.toFixed(2)}</span></p>
        <p>Popularity: <span className="font-semibold">{data.popularity} sold</span></p>
      </div>
    );
  }
  return null;
};

const MenuEngineeringMatrix: React.FC<MenuEngineeringMatrixProps> = ({ data, avgProfitability, avgPopularity }) => {
    if (data.length === 0) {
        return (
            <Card title="Menu Engineering Matrix">
                <p className="text-gray-400 text-center p-8">Not enough sales data to generate the matrix.</p>
            </Card>
        );
    }

    const stars = data.filter(d => d.profitability >= avgProfitability && d.popularity >= avgPopularity);
    const puzzles = data.filter(d => d.profitability >= avgProfitability && d.popularity < avgPopularity);
    const plowhorses = data.filter(d => d.profitability < avgProfitability && d.popularity >= avgPopularity);
    const dogs = data.filter(d => d.profitability < avgProfitability && d.popularity < avgPopularity);
    
    return (
        <Card title="Menu Engineering Matrix">
            <div className="relative w-full h-[450px]">
                <div className="absolute top-0 right-0 p-2 text-center z-10">
                    <h4 className="font-bold text-lg text-green-400">STARS</h4>
                    <p className="text-xs text-gray-300">High Profit / High Pop</p>
                </div>
                <div className="absolute top-0 left-0 p-2 text-center z-10">
                    <h4 className="font-bold text-lg text-yellow-400">PUZZLES</h4>
                    <p className="text-xs text-gray-300">High Profit / Low Pop</p>
                </div>
                <div className="absolute bottom-10 right-0 p-2 text-center z-10">
                    <h4 className="font-bold text-lg text-blue-400">PLOWHORSES</h4>
                    <p className="text-xs text-gray-300">Low Profit / High Pop</p>
                </div>
                <div className="absolute bottom-10 left-0 p-2 text-center z-10">
                    <h4 className="font-bold text-lg text-red-400">DOGS</h4>
                    <p className="text-xs text-gray-300">Low Profit / Low Pop</p>
                </div>

                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 40, right: 40, bottom: 40, left: 40 }}>
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                        <XAxis 
                            type="number" 
                            dataKey="popularity" 
                            name="Popularity" 
                            label={{ value: 'Popularity (Units Sold)', position: 'insideBottom', offset: -15, fill: '#9ca3af' }}
                            stroke="#9ca3af"
                        />
                        <YAxis 
                            type="number" 
                            dataKey="profitability" 
                            name="Profitability" 
                            unit="$"
                            label={{ value: 'Profitability ($)', angle: -90, position: 'insideLeft', offset: -15, fill: '#9ca3af' }}
                            stroke="#9ca3af"
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }}/>
                        <Legend iconType="circle" />
                        
                        <Scatter name="Stars" data={stars} fill="#22c55e" />
                        <Scatter name="Puzzles" data={puzzles} fill="#eab308" />
                        <Scatter name="Plowhorses" data={plowhorses} fill="#3b82f6" />
                        <Scatter name="Dogs" data={dogs} fill="#ef4444" />
                        
                        <ReferenceLine y={avgProfitability} stroke="#eab308" strokeDasharray="4 4">
                             <Label value="Avg Profit" position="right" fill="#eab308" fontSize={12}/>
                        </ReferenceLine>
                        <ReferenceLine x={avgPopularity} stroke="#3b82f6" strokeDasharray="4 4">
                            <Label value="Avg Pop" position="top" fill="#3b82f6" fontSize={12} />
                        </ReferenceLine>
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
             <div className="mt-4 p-4 bg-brand-primary/20 rounded-lg text-sm text-gray-300 space-y-2">
                <h4 className="font-bold text-base text-brand-accent mb-2">Strategic Actions:</h4>
                <p><strong className="text-green-400">Stars:</strong> Your best items. Promote them and maintain quality.</p>
                <p><strong className="text-blue-400">Plowhorses:</strong> Popular but less profitable. Try to reduce ingredient costs or test slight price increases.</p>
                <p><strong className="text-yellow-400">Puzzles:</strong> Profitable but not popular. Needs better marketing, server upselling, or menu placement.</p>
                <p><strong className="text-red-400">Dogs:</strong> Unpopular and unprofitable. Consider removing them from the menu.</p>
            </div>
        </Card>
    );
};

export default MenuEngineeringMatrix;