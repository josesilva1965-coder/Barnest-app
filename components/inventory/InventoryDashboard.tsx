
import React, { useState, useMemo, useEffect, useRef } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import type { InventoryItem, WastageLog, PurchaseOrder } from '../../types';
import { ShoppingCartIcon, PlusIcon, MinusIcon } from '../icons/Icons';

interface InventoryDashboardProps {
  inventory: InventoryItem[];
  wastageLog: WastageLog[];
  purchaseOrders: PurchaseOrder[];
  onLogWastage: (itemId: string, amount: number, reason?: string) => void;
  onCreatePurchaseOrder: (itemId: string, quantity: number) => void;
  onReceivePurchaseOrder: (poId: number) => void;
}

const ReorderModal: React.FC<{
    item: InventoryItem;
    onClose: () => void;
    onConfirm: (itemId: string, quantity: number) => void;
}> = ({ item, onClose, onConfirm }) => {
    const suggestedQuantity = Math.max(1, Math.ceil((item.threshold * 2) - item.stock));
    const [quantity, setQuantity] = useState(suggestedQuantity);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onConfirm(item.id, quantity);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <Card title={`Reorder ${item.name}`} className="w-full max-w-md">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <p className="text-gray-400">Current Stock: <span className="font-bold">{item.stock} {item.unit}</span></p>
                    <div>
                        <label htmlFor="reorder-quantity" className="block text-sm font-medium text-gray-300 mb-1">Reorder Quantity</label>
                        <div className="flex items-center">
                            <input
                                type="number"
                                id="reorder-quantity"
                                value={quantity}
                                onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 0)}
                                className="w-full p-2 rounded-l bg-brand-primary border border-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                                min="1"
                                required
                            />
                            <span className="inline-flex items-center px-3 text-sm text-gray-300 bg-brand-primary/50 border border-l-0 border-gray-600 rounded-r-md h-full">
                                {item.unit}
                            </span>
                        </div>
                         <p className="text-xs text-gray-500 mt-1">Suggested: {suggestedQuantity} (to meet 2x safety stock)</p>
                    </div>
                    <div className="flex gap-2 pt-4 border-t border-brand-primary">
                        <Button variant="secondary" type="button" onClick={onClose} className="flex-1">Cancel</Button>
                        <Button variant="primary" type="submit" className="flex-1">Confirm Order</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};


const WastageLogger: React.FC<{ inventory: InventoryItem[], onLogWastage: InventoryDashboardProps['onLogWastage'] }> = ({ inventory, onLogWastage }) => {
    const [selectedItem, setSelectedItem] = useState('');
    const [amount, setAmount] = useState('');
    const [reason, setReason] = useState('');
    const [error, setError] = useState('');

    const groupedInventory = useMemo(() => {
        return inventory.reduce((acc, item) => {
            const category = item.category;
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(item);
            return acc;
        }, {} as Record<string, InventoryItem[]>);
    }, [inventory]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const numAmount = parseFloat(amount);
        if (!selectedItem || !amount || isNaN(numAmount) || numAmount <= 0) {
            setError('Please select an item and enter a valid positive amount.');
            return;
        }

        onLogWastage(selectedItem, numAmount, reason);
        setSelectedItem('');
        setAmount('');
        setReason('');
    };

    return (
        <Card title="Log Wastage" className="h-full">
        <form onSubmit={handleSubmit} className="space-y-4 flex flex-col h-full">
            <div className="flex-grow">
                <div>
                    <label htmlFor="item-select" className="block text-sm font-medium text-gray-300 mb-1">Item</label>
                    <select 
                        id="item-select"
                        value={selectedItem}
                        onChange={(e) => setSelectedItem(e.target.value)}
                        className="w-full p-2 rounded bg-brand-primary border border-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                    >
                        <option value="" disabled>Select an item...</option>
                        {Object.keys(groupedInventory).sort((catA, catB) => catA.localeCompare(catB)).map((category) => (
                            <optgroup key={category} label={category}>
                                {[...groupedInventory[category]].sort((a,b) => a.name.localeCompare(b.name)).map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                            </optgroup>
                        ))}
                    </select>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                     <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">Amount Wasted</label>
                        <input 
                            type="number"
                            id="amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="e.g., 1.5"
                            step="any"
                            min="0"
                            className="w-full p-2 rounded bg-brand-primary border border-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                        />
                    </div>
                     <div>
                        <label htmlFor="unit" className="block text-sm font-medium text-gray-300 mb-1">Unit</label>
                        <input 
                            type="text"
                            id="unit"
                            disabled
                            value={inventory.find(i => i.id === selectedItem)?.unit || ''}
                            className="w-full p-2 rounded bg-brand-dark border border-gray-700 text-gray-400"
                        />
                    </div>
                </div>
                <div className="mt-4">
                    <label htmlFor="reason" className="block text-sm font-medium text-gray-300 mb-1">Reason (Optional)</label>
                    <input 
                        type="text"
                        id="reason"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="e.g., Spoiled"
                        className="w-full p-2 rounded bg-brand-primary border border-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                    />
                </div>
            </div>
            <div className="mt-auto">
                <Button type="submit" variant="danger" className="w-full">Log Wastage</Button>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
        </form>
        </Card>
    );
};


const InventoryDashboard: React.FC<InventoryDashboardProps> = ({ inventory, wastageLog, purchaseOrders, onLogWastage, onCreatePurchaseOrder, onReceivePurchaseOrder }) => {
  const criticalStockItems = inventory.filter(item => item.stock <= item.threshold);
  const totalStockValue = inventory.reduce((acc, item) => acc + item.stock * item.cost, 0);
  const [reorderModalItem, setReorderModalItem] = useState<InventoryItem | null>(null);

  const groupedInventory = useMemo(() => {
    return inventory.reduce((acc, item) => {
        const category = item.category;
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(item);
        return acc;
    }, {} as Record<string, InventoryItem[]>);
  }, [inventory]);

  const [openCategories, setOpenCategories] = useState<string[]>([]);
  const listContainerRef = useRef<HTMLDivElement | null>(null);
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    setOpenCategories(Object.keys(groupedInventory));
  }, [groupedInventory]);

  const toggleCategory = (category: string) => {
    setOpenCategories(prev =>
        prev.includes(category)
            ? prev.filter(c => c !== category)
            : [...prev, category]
    );
  };
  
  const handleCategoryLinkClick = (category: string) => {
    if (!openCategories.includes(category)) {
        setOpenCategories(prev => [...prev, category]);
    }
    setTimeout(() => {
        const container = listContainerRef.current;
        const element = categoryRefs.current[category];
        if (container && element) {
            container.scrollTo({
                top: element.offsetTop - container.offsetTop,
                behavior: 'smooth',
            });
        }
    }, 50);
  };


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Inventory Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Total Stock Value">
          <p className="text-4xl font-bold text-brand-secondary">${totalStockValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
          <p className="text-gray-400">Updated in real-time</p>
        </Card>
        <Card title="Critical Stock Items" className="md:col-span-2">
            {criticalStockItems.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {criticalStockItems.map(item => (
                        <div key={item.id} className="bg-red-900/50 p-3 rounded-lg flex flex-col justify-between">
                            <div>
                                <p className="font-bold text-lg">{item.name}</p>
                                <p className="text-red-400">{item.stock.toFixed(2)} {item.unit} left</p>
                            </div>
                            <Button onClick={() => setReorderModalItem(item)} variant="secondary" className="w-full mt-3 text-sm py-1 flex items-center justify-center gap-1">
                                <ShoppingCartIcon className="w-4 h-4" /> Reorder
                            </Button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-400">All stock levels are healthy.</p>
            )}
        </Card>
      </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Pending Purchase Orders">
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                {purchaseOrders.length > 0 ? (
                    purchaseOrders.map(po => (
                        <div key={po.id} className="bg-brand-primary/50 p-3 rounded-lg flex items-center justify-between">
                            <div>
                                <p className="font-bold">{po.itemName}</p>
                                <p className="text-sm text-gray-300">Qty: {po.quantity} | Ordered: {po.createdAt.toLocaleDateString()}</p>
                            </div>
                            <Button onClick={() => onReceivePurchaseOrder(po.id)} variant="primary" className="text-sm px-3 py-1 bg-green-600 hover:bg-green-700">Mark Received</Button>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-400 text-center py-12">No pending orders.</p>
                )}
            </div>
        </Card>
        <WastageLogger inventory={inventory} onLogWastage={onLogWastage} />
      </div>

       <Card title="Full Inventory List">
            <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b border-brand-primary">
                <span className="text-sm font-semibold text-gray-300 self-center mr-2">Go to:</span>
                {Object.keys(groupedInventory).sort((catA, catB) => catA.localeCompare(catB)).map((category) => (
                    <button
                        key={category}
                        onClick={() => handleCategoryLinkClick(category)}
                        className="px-3 py-1 text-xs font-semibold rounded-full bg-brand-primary hover:bg-brand-secondary/80 text-brand-light transition-colors focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                    >
                        {category}
                    </button>
                ))}
            </div>
            <div ref={listContainerRef} className="space-y-2 max-h-[26rem] overflow-y-auto pr-2">
                {Object.keys(groupedInventory).sort((catA, catB) => catA.localeCompare(catB)).map((category) => {
                    const items = groupedInventory[category];
                    return (
                    <div 
                        key={category}
                        ref={(el): void => { categoryRefs.current[category] = el; }}
                        className="bg-brand-primary/30 rounded-lg overflow-hidden scroll-mt-2"
                    >
                        <button
                            onClick={() => toggleCategory(category)}
                            className="w-full text-left p-3 flex justify-between items-center font-bold text-lg text-brand-accent bg-brand-primary/50 hover:bg-brand-primary/80 transition-colors"
                            aria-expanded={openCategories.includes(category)}
                            aria-controls={`category-panel-${category}`}
                        >
                            <span>{category} ({items.length})</span>
                            {openCategories.includes(category) ? <MinusIcon className="w-5 h-5" /> : <PlusIcon className="w-5 h-5" />}
                        </button>
                        {openCategories.includes(category) && (
                            <div id={`category-panel-${category}`} className="p-2">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-brand-primary">
                                                <th className="p-2">Name</th>
                                                <th className="p-2">Stock</th>
                                                <th className="p-2">Threshold</th>
                                                <th className="p-2">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {[...items].sort((a,b) => a.name.localeCompare(b.name)).map(item => (
                                                <tr key={item.id} className="border-b border-brand-primary/50 hover:bg-brand-primary/30">
                                                    <td className="p-2">{item.name}</td>
                                                    <td className="p-2">{item.stock.toFixed(2)} {item.unit}</td>
                                                    <td className="p-2">{item.threshold} {item.unit}</td>
                                                    <td className="p-2">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.stock <= item.threshold ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                                                            {item.stock <= item.threshold ? 'Low' : 'OK'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                )})}
            </div>
        </Card>

        {reorderModalItem && (
            <ReorderModal 
                item={reorderModalItem}
                onClose={() => setReorderModalItem(null)}
                onConfirm={onCreatePurchaseOrder}
            />
        )}
    </div>
  );
};

export default InventoryDashboard;
