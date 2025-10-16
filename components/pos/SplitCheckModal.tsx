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

  const unassignedItems = useMemo(() => {
    const assignedInstanceIds = new Set(itemSplits.flat().map(i => i.instanceId));
    return orderItems.filter(item => !assignedInstanceIds.has(item.instanceId));
  }, [orderItems, itemSplits]);

  const addSplit = () => {
    setItemSplits(prev => [...prev, []]);
    setActiveSplitIndex(itemSplits.length);
  };

  const assignItemToSplit = (item: OrderItem) => {
    // Create a single-quantity version of the item
    const itemToMove: OrderItem = { ...item, quantity: 1 };
    
    // Decrement from original order or remove if quantity is 1
    const originalItem = orderItems.find(i => i.instanceId === item.instanceId)!;
    originalItem.quantity -= 1; // This mutation is local to the modal's lifecycle logic.

    setItemSplits(prev => {
        const newSplits = [...prev];
        const currentSplit = [...newSplits[activeSplitIndex]];

        // Check if an identical item is already in the split
        const existingItemInSplit = currentSplit.find(i => i.instanceId === itemToMove.instanceId);
        if (existingItemInSplit) {
            existingItemInSplit.quantity += 1;
        } else {
            currentSplit.push(itemToMove);
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
  
  const allItemsAssigned = unassignedItems.flatMap(i => Array(i.quantity).fill(i)).length === 0;

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
                            {unassignedItems.flatMap(item => Array(item.quantity).fill(item)).length > 0 ? (
                                unassignedItems.flatMap(item => Array(item.quantity).fill(item).map((singleItem, index) => (
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
                             {/* FIX: Removed invalid 'size' prop and used className for styling instead. */}
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