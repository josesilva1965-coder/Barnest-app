import React, { useState, useMemo } from 'react';
import type { Order } from '../../types';
import { OrderStatus } from '../../types';
import OrderCard from './OrderCard';
import Card from '../ui/Card';

interface ThrottlingConfig {
    kitchen: { enabled: boolean; capacity: number; };
    bar: { enabled: boolean; capacity: number; };
}

interface KdsScreenProps {
  orders: Order[];
  onUpdateStatus: (orderId: number, status: OrderStatus) => void;
  heldOrdersCount: { kitchen: number; bar: number };
  throttlingConfig: ThrottlingConfig;
  onThrottlingChange: (station: 'kitchen' | 'bar', newConfig: { enabled?: boolean, capacity?: number }) => void;
}

const KdsColumn: React.FC<{ title: string; orders: Order[]; onUpdateStatus: KdsScreenProps['onUpdateStatus']; alertThreshold: number; }> = ({ title, orders, onUpdateStatus, alertThreshold }) => (
    <div className="bg-brand-dark/50 rounded-lg p-3 flex flex-col">
        <h2 className="text-xl font-bold text-brand-accent mb-4 px-1 capitalize">{title} ({orders.length})</h2>
        <div className="flex-1 space-y-4 overflow-y-auto pr-1">
            {orders.length > 0 ? (
                orders.map(order => (
                    <OrderCard 
                        key={order.id} 
                        order={order} 
                        onUpdateStatus={onUpdateStatus} 
                        alertThreshold={alertThreshold * 60 * 1000} // Convert minutes to ms
                    />
                ))
            ) : (
                <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">No orders</p>
                </div>
            )}
        </div>
    </div>
);


const KdsScreen: React.FC<KdsScreenProps> = ({ orders, onUpdateStatus, heldOrdersCount, throttlingConfig, onThrottlingChange }) => {
  const [activeStation, setActiveStation] = useState<'Kitchen' | 'Bar'>('Kitchen');
  const [alertThreshold, setAlertThreshold] = useState(10); // in minutes

  const activeKitchenOrdersCount = useMemo(() => orders.filter(o => o.station === 'Kitchen' && (o.status === OrderStatus.QUEUED || o.status === OrderStatus.COOKING)).length, [orders]);
  const activeBarOrdersCount = useMemo(() => orders.filter(o => o.station === 'Bar' && (o.status === OrderStatus.QUEUED || o.status === OrderStatus.COOKING)).length, [orders]);

  const stationOrders = useMemo(() => orders.filter(o => o.station === activeStation), [orders, activeStation]);

  const queuedOrders = useMemo(() => stationOrders.filter(o => o.status === OrderStatus.QUEUED).sort((a,b) => a.createdAt - b.createdAt), [stationOrders]);
  const cookingOrders = useMemo(() => stationOrders.filter(o => o.status === OrderStatus.COOKING).sort((a,b) => a.createdAt - b.createdAt), [stationOrders]);
  const readyOrders = useMemo(() => stationOrders.filter(o => o.status === OrderStatus.READY).sort((a,b) => a.createdAt - b.createdAt), [stationOrders]);

  const consolidatedItems = useMemo(() => {
    const itemMap = new Map<number, { name: string; quantity: number }>();
    orders
      .filter(o => o.status === OrderStatus.QUEUED || o.status === OrderStatus.COOKING)
      .forEach(order => {
        order.items.forEach(item => {
          const existing = itemMap.get(item.id);
          if (existing) {
            existing.quantity += item.quantity;
          } else {
            itemMap.set(item.id, { name: item.name, quantity: item.quantity });
          }
        });
      });
    return Array.from(itemMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [orders]);

  return (
    <div className="h-full flex flex-col space-y-4">
      <h1 className="text-3xl font-bold text-white">Kitchen Display System</h1>
      
      <Card title="Controls & Overview">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
                <h3 className="font-bold text-lg text-brand-accent mb-2">All Day Consolidation</h3>
                <div className="bg-brand-primary/20 rounded-lg p-3 max-h-48 overflow-y-auto space-y-1">
                    {consolidatedItems.length > 0 ? (
                        consolidatedItems.map(item => (
                            <div key={item.name} className="flex justify-between text-sm">
                                <span>{item.name}</span>
                                <span className="font-bold">{item.quantity}x</span>
                            </div>
                        ))
                    ) : <p className="text-gray-400 text-sm text-center py-4">No active items.</p>}
                </div>
            </div>
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div className="space-y-3 p-3 bg-brand-primary/20 rounded-lg md:col-span-1">
                    <h3 className="font-bold text-lg text-brand-accent">Kitchen Station</h3>
                    <div className="flex items-center justify-between">
                        <label htmlFor="kitchen-throttle-toggle" className="font-semibold text-sm">Enable Pacing</label>
                        <input type="checkbox" id="kitchen-throttle-toggle" className="h-5 w-5 rounded bg-gray-700 border-gray-600 text-brand-secondary focus:ring-brand-secondary" checked={throttlingConfig.kitchen.enabled} onChange={(e) => onThrottlingChange('kitchen', { enabled: e.target.checked })}/>
                    </div>
                    {throttlingConfig.kitchen.enabled && (
                        <div className="flex items-center justify-between">
                             <label htmlFor="kitchen-capacity" className="font-semibold text-sm">Max Orders</label>
                             <input type="number" id="kitchen-capacity" value={throttlingConfig.kitchen.capacity} onChange={(e) => onThrottlingChange('kitchen', { capacity: parseInt(e.target.value, 10) || 1 })} className="w-20 p-1 rounded bg-brand-primary border border-gray-600 text-center"/>
                        </div>
                    )}
                    <p className="text-sm text-gray-300">Load: <span className="font-bold">{activeKitchenOrdersCount}/{throttlingConfig.kitchen.capacity}</span> | <span className="font-bold text-yellow-400">{heldOrdersCount.kitchen} Held</span></p>
                </div>
                 <div className="space-y-3 p-3 bg-brand-primary/20 rounded-lg md:col-span-1">
                    <h3 className="font-bold text-lg text-brand-accent">Bar Station</h3>
                     <div className="flex items-center justify-between">
                        <label htmlFor="bar-throttle-toggle" className="font-semibold text-sm">Enable Pacing</label>
                        <input type="checkbox" id="bar-throttle-toggle" className="h-5 w-5 rounded bg-gray-700 border-gray-600 text-brand-secondary focus:ring-brand-secondary" checked={throttlingConfig.bar.enabled} onChange={(e) => onThrottlingChange('bar', { enabled: e.target.checked })} />
                    </div>
                    {throttlingConfig.bar.enabled && (
                         <div className="flex items-center justify-between">
                             <label htmlFor="bar-capacity" className="font-semibold text-sm">Max Orders</label>
                             <input type="number" id="bar-capacity" value={throttlingConfig.bar.capacity} onChange={(e) => onThrottlingChange('bar', { capacity: parseInt(e.target.value, 10) || 1 })} className="w-20 p-1 rounded bg-brand-primary border border-gray-600 text-center" />
                        </div>
                    )}
                     <p className="text-sm text-gray-300">Load: <span className="font-bold">{activeBarOrdersCount}/{throttlingConfig.bar.capacity}</span> | <span className="font-bold text-yellow-400">{heldOrdersCount.bar} Held</span></p>
                </div>
                 <div className="space-y-3 p-3 bg-brand-primary/20 rounded-lg md:col-span-1">
                    <h3 className="font-bold text-lg text-brand-accent">Alert Settings</h3>
                    <div className="flex items-center justify-between">
                        <label htmlFor="alert-threshold" className="font-semibold text-sm">Urgent After</label>
                        <div className="flex items-center gap-2">
                            <input type="number" id="alert-threshold" value={alertThreshold} onChange={(e) => setAlertThreshold(parseInt(e.target.value, 10) || 1)} className="w-20 p-1 rounded bg-brand-primary border border-gray-600 text-center"/>
                            <span>min</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </Card>
      
      <div className="flex-1 flex flex-col min-h-0 bg-brand-primary/20 p-4 rounded-lg overflow-x-auto">
        <div className="flex border-b border-brand-primary">
          <button onClick={() => setActiveStation('Kitchen')} className={`py-2 px-6 font-semibold text-lg transition-colors duration-200 ${activeStation === 'Kitchen' ? 'text-brand-secondary border-b-2 border-brand-secondary' : 'text-gray-400 hover:text-white'}`}>Kitchen</button>
          <button onClick={() => setActiveStation('Bar')} className={`py-2 px-6 font-semibold text-lg transition-colors duration-200 ${activeStation === 'Bar' ? 'text-brand-secondary border-b-2 border-brand-secondary' : 'text-gray-400 hover:text-white'}`}>Bar</button>
        </div>
        
        <div className="grid grid-cols-3 gap-4 flex-1 min-h-0 pt-4 min-w-[900px]">
            <KdsColumn title="Queued" orders={queuedOrders} onUpdateStatus={onUpdateStatus} alertThreshold={alertThreshold} />
            <KdsColumn title="Cooking" orders={cookingOrders} onUpdateStatus={onUpdateStatus} alertThreshold={alertThreshold} />
            <KdsColumn title="Ready" orders={readyOrders} onUpdateStatus={onUpdateStatus} alertThreshold={alertThreshold} />
        </div>
      </div>
    </div>
  );
};

export default KdsScreen;