
import React, { useState, useMemo } from 'react';
import type { OrderItem, Split } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { PlusIcon, MinusIcon } from '../icons/Icons';

interface SplitCheckModalProps {
  orderItems: OrderItem[];
  orderTotal: number;
  taxRate: number;
  onClose: () => void;
  onConfirm: (splits: Split[]) => void;
}

const calculateSplitTotal = (items: OrderItem[], taxRate: number): number => {
    const subtotal = items.reduce((acc, item) => {
        const itemPrice = item.price + item.modifiers.reduce((modAcc, mod) => modAcc + mod.priceChange, 0);
        return acc + itemPrice * item.quantity;
    }, 0);
    const tax = subtotal * (taxRate / 100);
    return subtotal + tax;
};


const SplitCheckModal: React.FC<SplitCheckModalProps> = ({ orderItems, orderTotal, taxRate, onClose, onConfirm }) => {
  const [splitType, setSplitType] = useState<'evenly' | 'byItem'>('evenly');
  const [evenSplitCount, setEvenSplitCount] = useState(2);
  
  // For 'byItem' split
  const [itemSplits, setItemSplits] = useState<OrderItem[][]>([[]]);
  const [activeSplitIndex, setActiveSplitIndex] = useState(0);

  const unassignedItemsWithQuantities = useMemo(() => {
    const assignedCounts: Record<number, number> = {};
    itemSplits.flat().forEach(item => {
        assignedCounts[item.instanceId] = (assignedCounts[item.instanceId] || 0) + item.quantity;
    });

    return orderItems.map(originalItem => ({
        ...originalItem,
        unassignedQuantity: originalItem.quantity - (assignedCounts[originalItem.instanceId] || 0)
    })).filter(item => item.unassignedQuantity > 0);
  }, [orderItems, itemSplits]);

  const addSplit = () => {
    setItemSplits(prev => [...prev, []]);
    setActiveSplitIndex(itemSplits.length);
  };

  const assignItemToSplit = (item: OrderItem) => {
    setItemSplits(prev => {
        const newSplits = prev.map(split => [...split]);
        const currentSplit = newSplits[activeSplitIndex];
        
        const existingItemIndex = currentSplit.findIndex(i => i.instanceId === item.instanceId);
        if (existingItemIndex > -1) {
            // Avoid direct state mutation
            const updatedItem = { ...currentSplit[existingItemIndex], quantity: currentSplit[existingItemIndex].quantity + 1 };
            currentSplit[existingItemIndex] = updatedItem;
        } else {
            currentSplit.push({ ...item, quantity: 1 });
        }
        newSplits[activeSplitIndex] = currentSplit;
        return newSplits;
    });
  };

  const handleConfirm = () => {
    if (splitType === 'evenly') {
        const amountPerSplit = orderTotal / evenSplitCount;
        const newSplits: Split[] = Array.from({ length: evenSplitCount }, (_, i) => ({
            id: i + 1,
            items: [], // Items are not assigned in even split
            total: amountPerSplit,
            status: 'unpaid',
        }));
        onConfirm(newSplits);
    } else {
        const newSplits: Split[] = itemSplits
            .filter(splitItems => splitItems.length > 0)
            .map((splitItems, i) => ({
                id: i + 1,
                items: splitItems,
                total: calculateSplitTotal(splitItems, taxRate),
                status: 'unpaid',
        }));
        onConfirm(newSplits);
    }
  };
  
  const allItemsAssigned = unassignedItemsWithQuantities.length === 0;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <Card title="Split Check" className="w-full max-w-2xl bg-brand-dark max-h-[90vh] flex flex-col">
        <div className="flex border-b border-brand-primary mb-4">
          <button onClick={() => setSplitType('evenly')} className={`py-2 px-4 font-semibold ${splitType === 'evenly' ? 'text-brand-secondary border-b-2 border-brand-secondary' : 'text-gray-400'}`}>Split Evenly</button>
          <button onClick={() => setSplitType('byItem')} className={`py-2 px-4 font-semibold ${splitType === 'byItem' ? 'text-brand-secondary border-b-2 border-brand-secondary' : 'text-gray-400'}`}>Split by Item</button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
            {splitType === 'evenly' && (
                <div className="flex flex-col items-center justify-center p-8 space-y-4">
                    <p className="text-lg">Split total of <span className="font-bold text-brand-secondary">${orderTotal.toFixed(2)}</span> into how many ways?</p>
                    <div className="flex items-center gap-4">
                        <Button onClick={() => setEvenSplitCount(c => Math.max(2, c - 1))}><MinusIcon className="w-6 h-6"/></Button>
                        <span className="text-4xl font-bold w-16 text-center">{evenSplitCount}</span>
                        <Button onClick={() => setEvenSplitCount(c => c + 1)}><PlusIcon className="w-6 h-6"/></Button>
                    </div>
                    <p className="text-xl">
                        <span className="font-bold text-green-400">${(orderTotal / evenSplitCount).toFixed(2)}</span> per person
                    </p>
                </div>
            )}
            
            {splitType === 'byItem' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h4 className="font-bold mb-2">Unassigned Items</h4>
                        <div className="space-y-2 p-2 bg-brand-primary/20 rounded-lg max-h-80 overflow-y-auto">
                            {unassignedItemsWithQuantities.length > 0 ? (
                                unassignedItemsWithQuantities.flatMap(item => Array(item.unassignedQuantity).fill(item).map((singleItem, index) => (
                                    <div key={`${singleItem.instanceId}-${index}`} onClick={() => assignItemToSplit(singleItem)} className="p-2 bg-brand-primary/50 rounded flex justify-between items-center cursor-pointer hover:bg-brand-secondary/50">
                                        <span>{singleItem.name}</span>
                                        <span>${(singleItem.price + singleItem.modifiers.reduce((a,c)=>a+c.priceChange,0)).toFixed(2)}</span>
                                    </div>
                                )))
                            ) : (
                                <p className="text-gray-400 text-center p-4">All items assigned.</p>
                            )}
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-2">
                             <h4 className="font-bold">Current Splits</h4>
                             <Button onClick={addSplit} variant="secondary" className="text-xs px-2 py-1">+ New Split</Button>
                        </div>
                        <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                            {itemSplits.map((split, index) => (
                                <div key={index} onClick={() => setActiveSplitIndex(index)} className={`p-3 rounded-lg border-2 ${activeSplitIndex === index ? 'border-brand-secondary' : 'border-brand-primary'} cursor-pointer`}>
                                    <div className="flex justify-between font-bold mb-2">
                                        <span>Split {index + 1}</span>
                                        <span>${calculateSplitTotal(split, taxRate).toFixed(2)}</span>
                                    </div>
                                    {split.length > 0 ? (
                                        split.map(item => (
                                            <p key={item.instanceId} className="text-sm text-gray-300">{item.quantity}x {item.name}</p>
                                        ))
                                    ) : <p className="text-xs text-gray-500">Empty</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>

        <div className="mt-6 border-t border-brand-primary pt-4">
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
            <Button variant="primary" onClick={handleConfirm} className="flex-1" disabled={splitType === 'byItem' && !allItemsAssigned}>Confirm Splits</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SplitCheckModal;