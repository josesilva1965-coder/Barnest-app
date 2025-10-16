import React, { useState, useMemo, useEffect } from 'react';
import { Table, MenuItem, OrderItem, Modifier } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { ShoppingCartIcon, PlusIcon, MinusIcon, CheckIcon } from '../icons/Icons';

// Minimal Modifier Modal for customer use
const CustomerModifierModal: React.FC<{
    item: MenuItem;
    onClose: () => void;
    onConfirm: (selectedModifiers: Modifier[]) => void;
}> = ({ item, onClose, onConfirm }) => {
    const [selectedModifiers, setSelectedModifiers] = useState<Modifier[]>([]);

    const toggleModifier = (modifier: Modifier) => {
        setSelectedModifiers(prev => {
            if (prev.some(m => m.name === modifier.name)) {
                return prev.filter(m => m.name !== modifier.name);
            }
            return [...prev, modifier];
        });
    };

    const currentPrice = item.price + selectedModifiers.reduce((acc, mod) => acc + mod.priceChange, 0);

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <Card title={`Customize ${item.name}`} className="w-full max-w-md bg-brand-dark">
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                    {item.availableModifiers?.map(mod => (
                        <label key={mod.name} className="flex items-center justify-between p-3 rounded-lg bg-brand-primary/50 cursor-pointer hover:bg-brand-primary">
                            <div>
                                <span className="font-semibold">{mod.name}</span>
                                <span className="text-sm text-gray-400 ml-2">
                                    {mod.priceChange > 0 ? `(+$${mod.priceChange.toFixed(2)})` : ''}
                                </span>
                            </div>
                            <input
                                type="checkbox"
                                className="h-5 w-5 rounded bg-gray-700 border-gray-600 text-brand-secondary focus:ring-brand-secondary shrink-0"
                                checked={selectedModifiers.some(m => m.name === mod.name)}
                                onChange={() => toggleModifier(mod)}
                            />
                        </label>
                    ))}
                </div>
                <div className="mt-6 border-t border-brand-primary pt-4">
                    <div className="flex justify-between items-center text-xl font-bold mb-4">
                        <span>Total Price:</span>
                        <span>${currentPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
                        <Button variant="primary" onClick={() => onConfirm(selectedModifiers)} className="flex-1">Add to Order</Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

interface CustomerOrderScreenProps {
    table: Table;
    menuItems: MenuItem[];
    onSendOrder: (items: OrderItem[]) => void;
}

const CustomerOrderScreen: React.FC<CustomerOrderScreenProps> = ({ table, menuItems, onSendOrder }) => {
    const [cart, setCart] = useState<OrderItem[]>([]);
    const [view, setView] = useState<'ordering' | 'confirmation'>('ordering');
    const [modifierModalItem, setModifierModalItem] = useState<MenuItem | null>(null);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [nextInstanceId, setNextInstanceId] = useState(Date.now());

    const categories = useMemo(() => Array.from(new Set(menuItems.map(item => item.category))), [menuItems]);
    const [activeTab, setActiveTab] = useState<string>(categories[0] || '');
    const [activeSubCategory, setActiveSubCategory] = useState<string>('All');

    const subCategories = useMemo(() => {
        if (!activeTab) return [];
        const subs = new Set(menuItems.filter(item => item.category === activeTab).map(item => item.subCategory));
        return ['All', ...Array.from(subs)];
    }, [menuItems, activeTab]);

    useEffect(() => {
        setActiveSubCategory('All');
    }, [activeTab]);


    const cartTotal = useMemo(() => {
        return cart.reduce((total, item) => {
            const itemPrice = item.price + item.modifiers.reduce((acc, mod) => acc + mod.priceChange, 0);
            return total + itemPrice * item.quantity;
        }, 0);
    }, [cart]);

    const addToCart = (item: MenuItem, modifiers: Modifier[] = []) => {
        const getModifiersKey = (mods: Modifier[]): string => {
            return [...mods].sort((a,b) => a.name.localeCompare(b.name)).map(m => m.name).join(',');
        }
        
        const modifiersKey = getModifiersKey(modifiers);
        const existingItem = cart.find(cartItem => 
            cartItem.id === item.id && getModifiersKey(cartItem.modifiers) === modifiersKey
        );

        if (existingItem) {
            updateCartQuantity(existingItem.instanceId, 1);
        } else {
            setCart(prev => [...prev, {
                ...item,
                quantity: 1,
                modifiers: modifiers,
                instanceId: nextInstanceId,
            }]);
            setNextInstanceId(prev => prev + 1);
        }
        setModifierModalItem(null);
    };
    
    const updateCartQuantity = (instanceId: number, delta: number) => {
        setCart(prevCart => {
            const itemToUpdate = prevCart.find(item => item.instanceId === instanceId);
            if (!itemToUpdate) return prevCart;

            const newQuantity = itemToUpdate.quantity + delta;
            if (newQuantity <= 0) {
                return prevCart.filter(item => item.instanceId !== instanceId);
            }
            return prevCart.map(item => item.instanceId === instanceId ? { ...item, quantity: newQuantity } : item);
        });
    };

    const handleMenuItemClick = (item: MenuItem) => {
        if (item.availableModifiers && item.availableModifiers.length > 0) {
            setModifierModalItem(item);
        } else {
            addToCart(item, []);
        }
    };

    const handleSendOrder = () => {
        if (cart.length === 0) return;
        onSendOrder(cart);
        setCart([]);
        setIsCartOpen(false);
        setView('confirmation');
    };

    if (view === 'confirmation') {
        return (
            <div className="flex items-center justify-center min-h-screen bg-brand-dark p-4">
                <Card className="text-center">
                    <CheckIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-white mb-2">Order Sent!</h1>
                    <p className="text-gray-300">Your order has been sent to the kitchen. A server will be with you shortly.</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-dark text-brand-light p-4 pb-24">
            <h1 className="text-3xl font-bold text-center">Welcome to <span className="text-brand-secondary">Table {table.name}</span></h1>
            <p className="text-center text-gray-400 mb-6">Browse our menu and order at your convenience.</p>

            <Card>
                <div className="flex border-b border-brand-primary mb-2">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setActiveTab(category)}
                            className={`py-2 px-4 font-semibold ${activeTab === category ? 'text-brand-secondary border-b-2 border-brand-secondary' : 'text-gray-400'}`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
                <div className="flex flex-wrap gap-2 mb-4 px-1">
                    {subCategories.map(sub => (
                        <button
                            key={sub}
                            onClick={() => setActiveSubCategory(sub)}
                            className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${
                                activeSubCategory === sub
                                ? 'bg-brand-secondary text-white'
                                : 'bg-brand-primary text-gray-300 hover:bg-brand-primary/80'
                            }`}
                        >
                            {sub}
                        </button>
                    ))}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[calc(100vh-300px)] overflow-y-auto">
                    {menuItems
                        .filter(item => item.category === activeTab && (activeSubCategory === 'All' || item.subCategory === activeSubCategory))
                        .map(item => (
                        <Card key={item.id} className="p-2 flex flex-col text-center" onClick={() => handleMenuItemClick(item)}>
                            <img src={item.image} alt={item.name} className="w-full h-24 object-cover rounded-md mb-2"/>
                            <p className="font-semibold text-sm flex-1">{item.name}</p>
                            <p className="text-brand-secondary font-bold text-sm mt-1">${item.price.toFixed(2)}</p>
                        </Card>
                    ))}
                </div>
            </Card>

            {cart.length > 0 && (
                <button
                    onClick={() => setIsCartOpen(true)}
                    className="fixed bottom-6 right-6 bg-brand-secondary text-white rounded-full p-4 shadow-lg flex items-center gap-2"
                >
                    <ShoppingCartIcon className="w-6 h-6" />
                    <span className="font-bold">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
                </button>
            )}

            {isCartOpen && (
                <div className="fixed inset-0 bg-black/70 z-40" onClick={() => setIsCartOpen(false)}>
                    <div className="fixed bottom-0 left-0 right-0 bg-brand-dark p-4 rounded-t-lg max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
                        <h2 className="text-2xl font-bold mb-4">Your Order</h2>
                        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                            {cart.map(item => (
                                <div key={item.instanceId} className="flex justify-between items-center bg-brand-primary/50 p-2 rounded">
                                    <div className="flex-1">
                                        <p className="font-semibold">{item.name}</p>
                                        <p className="text-sm text-gray-400">${(item.price + item.modifiers.reduce((a,c)=>a+c.priceChange,0)).toFixed(2)}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => updateCartQuantity(item.instanceId, -1)} className="p-1 rounded-full bg-brand-primary hover:bg-gray-600"><MinusIcon className="w-4 h-4" /></button>
                                        <span className="font-bold w-6 text-center">{item.quantity}</span>
                                        <button onClick={() => updateCartQuantity(item.instanceId, 1)} className="p-1 rounded-full bg-brand-primary hover:bg-gray-600"><PlusIcon className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-brand-primary pt-4 mt-4">
                            <div className="flex justify-between font-bold text-xl mb-4">
                                <span>Total:</span>
                                <span>${cartTotal.toFixed(2)}</span>
                            </div>
                            <Button onClick={handleSendOrder} className="w-full py-3">Send Order to Kitchen</Button>
                        </div>
                    </div>
                </div>
            )}
            
            {modifierModalItem && (
                <CustomerModifierModal 
                    item={modifierModalItem}
                    onClose={() => setModifierModalItem(null)}
                    onConfirm={(mods) => addToCart(modifierModalItem, mods)}
                />
            )}
        </div>
    );
};

export default CustomerOrderScreen;