
import React, { useState, useEffect } from 'react';
import { OrderItem, MenuItem } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { getPairingSuggestions, PairingSuggestion } from '../../services/geminiService';
import { SparklesIcon } from '../icons/Icons';

interface AIPairingModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderItems: OrderItem[];
  allMenuItems: MenuItem[];
  onAddToOrder: (item: MenuItem) => void;
}

const AIPairingModal: React.FC<AIPairingModalProps> = ({
  isOpen,
  onClose,
  orderItems,
  allMenuItems,
  onAddToOrder,
}) => {
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [pairingType, setPairingType] = useState<'Wine' | 'Cocktail' | 'Appetizer'>('Wine');
  const [suggestions, setSuggestions] = useState<PairingSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Pre-select the first item in the order when the modal opens
    if (isOpen && orderItems.length > 0) {
      setSelectedItemId(orderItems[0].instanceId.toString());
    }
     // Reset state on close
    if (!isOpen) {
        setSelectedItemId('');
        setSuggestions([]);
        setError(null);
    }
  }, [isOpen, orderItems]);
  
  const handleGetSuggestions = async () => {
    if (!selectedItemId) {
      setError('Please select an item from the order to get pairings for.');
      return;
    }
    const selectedItem = orderItems.find(item => item.instanceId.toString() === selectedItemId);
    if (!selectedItem) {
        setError('Could not find the selected item.');
        return;
    }

    setIsLoading(true);
    setError(null);
    setSuggestions([]);
    
    try {
        const result = await getPairingSuggestions(orderItems, selectedItem, pairingType, allMenuItems);
        setSuggestions(result);
    } catch (e: any) {
        setError(e.message || 'An unknown error occurred.');
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleAddToOrder = (itemName: string) => {
    const menuItem = allMenuItems.find(item => item.name === itemName);
    if (menuItem) {
        onAddToOrder(menuItem);
        onClose();
    } else {
        alert(`Error: Could not find "${itemName}" on the menu.`);
    }
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <Card title="AI Pairing Suggestions" className="w-full max-w-lg bg-brand-dark">
        <div className="space-y-4">
          <p className="text-sm text-gray-400">Get intelligent food and drink pairing ideas to upsell and enhance the guest experience.</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="item-select" className="block text-sm font-medium text-gray-300 mb-1">Pair with this item:</label>
              <select
                id="item-select"
                value={selectedItemId}
                onChange={(e) => setSelectedItemId(e.target.value)}
                className="w-full p-2 rounded bg-brand-primary border border-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-secondary"
              >
                <option value="" disabled>Select an item</option>
                {orderItems.map(item => (
                  <option key={item.instanceId} value={item.instanceId}>{item.name}</option>
                ))}
              </select>
            </div>
            <div>
                <label htmlFor="pairing-type" className="block text-sm font-medium text-gray-300 mb-1">Suggest a:</label>
                <select
                    id="pairing-type"
                    value={pairingType}
                    onChange={(e) => setPairingType(e.target.value as any)}
                    className="w-full p-2 rounded bg-brand-primary border border-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                >
                    <option>Wine</option>
                    <option>Cocktail</option>
                    <option>Appetizer</option>
                </select>
            </div>
          </div>
          <Button onClick={handleGetSuggestions} disabled={isLoading || !selectedItemId} className="w-full flex items-center justify-center gap-2">
            {isLoading ? 'Thinking...' : 'Get Suggestions'}
            <SparklesIcon className="w-5 h-5"/>
          </Button>
        </div>

        <div className="mt-6">
            {isLoading && (
                 <div className="flex items-center justify-center h-24">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-secondary"></div>
                 </div>
            )}
             {error && <p className="text-red-500 text-center">{error}</p>}
             {suggestions.length > 0 && (
                <div className="space-y-3">
                    <h3 className="font-bold text-brand-accent">Here are some ideas:</h3>
                    {suggestions.map((suggestion, index) => (
                        <div key={index} className="p-3 bg-brand-primary/50 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-white">{suggestion.itemName}</p>
                                <p className="text-sm text-gray-300 italic">"{suggestion.reason}"</p>
                            </div>
                            <Button onClick={() => handleAddToOrder(suggestion.itemName)} variant="secondary" className="text-xs px-2 py-1 shrink-0 ml-2">Add to Order</Button>
                        </div>
                    ))}
                </div>
             )}
        </div>

        <div className="mt-6 border-t border-brand-primary pt-4">
          <Button variant="secondary" onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AIPairingModal;
