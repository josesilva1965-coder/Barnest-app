
import React, { useState, useMemo, useEffect } from 'react';
import { View } from '../../types';
import type { OrderItem, MenuItem, Modifier, Split, Table, Customer, Reward, StaffMember } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { PlusIcon, MinusIcon, TrashIcon, SplitIcon, SparklesIcon, StarIcon, QrCodeIcon } from '../icons/Icons';
import SplitCheckModal from './SplitCheckModal';
import AIPairingModal from './AIPairingModal';
import { REWARDS_DATA } from '../../constants';
import RedeemPointsModal from './RedeemPointsModal';
import QRCodePaymentModal from './QRCodePaymentModal';

const MenuItemCard: React.FC<{
    item: MenuItem;
    onSelect: (item: MenuItem) => void;
}> = ({ item, onSelect }) => {
    return (
        <Card 
            className="flex flex-col text-center items-center p-2 cursor-pointer hover:border-brand-secondary transition-all duration-200" 
            onClick={() => onSelect(item)}
        >
            <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-md mb-2"/>
            <p className="font-semibold text-sm">{item.name}</p>
            <p className="text-brand-secondary font-bold text-sm">${item.price.toFixed(2)}</p>
        </Card>
    );
};

const ModifierModal: React.FC<{
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
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <Card title={`Customize ${item.name}`} className="w-full max-w-md bg-brand-dark">
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                    {item.availableModifiers?.map(mod => (
                        <label key={mod.name} className="flex items-center justify-between p-3 rounded-lg bg-brand-primary/50 cursor-pointer hover:bg-brand-primary">
                            <div>
                                <span className="font-semibold">{mod.name}</span>
                                <span className="text-sm text-gray-400 ml-2">
                                    {mod.priceChange > 0 ? `(+$${mod.priceChange.toFixed(2)})` : mod.priceChange < 0 ? `(-$${Math.abs(mod.priceChange).toFixed(2)})` : ''}
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

const calculateItemPrice = (item: OrderItem) => {
    const modifiersPrice = item.modifiers.reduce((acc, mod) => acc + mod.priceChange, 0);
    return item.price + modifiersPrice;
};

const calculateTotal = (items: OrderItem[], taxRate: number) => {
    const subtotal = items.reduce((acc, item) => acc + calculateItemPrice(item) * item.quantity, 0);
    const tax = subtotal * (taxRate / 100);
    return { subtotal, tax, total: subtotal + tax };
};

interface CustomerProfileCardProps {
    customer: Customer;
    onAddToOrder: (item: OrderItem) => void;
    onRedeemClick: () => void;
    canRedeem: boolean;
}

const CustomerProfileCard: React.FC<CustomerProfileCardProps> = ({ customer, onAddToOrder, onRedeemClick, canRedeem }) => (
    <Card title={`Customer: ${customer.name}`} className="mb-4 bg-brand-primary/40 border-l-4 border-brand-secondary">
        <div className="space-y-3">
            <div>
                <h4 className="font-semibold text-sm text-gray-300">Preferences</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                    {customer.preferences.map((pref, i) => <span key={i} className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded">{pref}</span>)}
                </div>
            </div>
             <div>
                <h4 className="font-semibold text-sm text-red-400">Allergies</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                    {customer.allergies.map((allergy, i) => <span key={i} className="bg-red-500/20 text-red-300 text-xs px-2 py-1 rounded font-bold">{allergy}</span>)}
                </div>
            </div>
             <div>
                <h4 className="font-semibold text-sm text-gray-300">Past Favorites</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                    {customer.orderHistory.slice(-3).map((item) => (
                        <button 
                            key={item.instanceId}
                            onClick={() => onAddToOrder(item)} 
                            className="bg-brand-primary hover:bg-gray-600 text-xs px-2 py-1 rounded"
                        >
                            + {item.name}
                        </button>
                    ))}
                </div>
            </div>
            <div>
                <h4 className="font-semibold text-sm text-gray-300">Loyalty</h4>
                <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center gap-2">
                        <StarIcon className="w-5 h-5 text-yellow-400" />
                        <span className="font-bold text-lg text-white">{customer.loyaltyPoints} Points</span>
                    </div>
                     <Button 
                        onClick={onRedeemClick} 
                        disabled={!canRedeem} 
                        className="text-xs px-2 py-1 bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500 disabled:bg-gray-500 disabled:hover:bg-gray-500"
                        title={!canRedeem ? "A reward is already applied or no items in order" : "Redeem points"}
                    >
                        Redeem
                    </Button>
                </div>
            </div>
        </div>
    </Card>
);

interface PosScreenProps {
    selectedTable: Table | null;
    selectedCustomer: Customer | null;
    tableOrder: OrderItem[];
    onSendOrder: (items: OrderItem[], table: Table) => Promise<{ status: string; message: string }>;
    onProcessPayment: (items: OrderItem[]) => void;
    onCloseTable: (tableId: number, currentOrderItems: OrderItem[], discountAmount: number) => void;
    taxRate: number;
    menuItems: MenuItem[];
    onRedeemPoints: (customerId: number, pointsToDeduct: number) => void;
    currentUser: StaffMember | null;
    setActiveView: (view: View) => void;
}

const PosScreen: React.FC<PosScreenProps> = ({ selectedTable, selectedCustomer, tableOrder, onSendOrder, onProcessPayment, onCloseTable, taxRate, menuItems, onRedeemPoints, currentUser, setActiveView }) => {
  const [currentOrder, setCurrentOrder] = useState<OrderItem[]>([]);
  const [modifierModalItem, setModifierModalItem] = useState<MenuItem | null>(null);
  const [isSplitModalOpen, setIsSplitModalOpen] = useState(false);
  const [isAIPairingModalOpen, setIsAIPairingModalOpen] = useState(false);
  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [splits, setSplits] = useState<Split[]>([]);
  const [nextInstanceId, setNextInstanceId] = useState(Date.now());
  const [appliedReward, setAppliedReward] = useState<Reward | null>(null);
  
  const categories = useMemo(() => Array.from(new Set(menuItems.map(item => item.category))), [menuItems]);
  const [activeTab, setActiveTab] = useState<string>(categories[0] || '');
  const [activeSubCategory, setActiveSubCategory] = useState<string>('All');

  const subCategories = useMemo(() => {
    if (!activeTab) return [];
    const subs = new Set(menuItems.filter(item => item.category === activeTab).map(item => item.subCategory));
    return ['All', ...Array.from(subs)];
  }, [menuItems, activeTab]);

  useEffect(() => {
    setCurrentOrder(tableOrder);
    setSplits([]);
    setAppliedReward(null);
  }, [tableOrder, selectedTable]);
  
  useEffect(() => {
    if (categories.length > 0 && !categories.includes(activeTab)) {
        setActiveTab(categories[0]);
    } else if (categories.length === 0) {
        setActiveTab('');
    }
  }, [categories, activeTab]);

  useEffect(() => {
    setActiveSubCategory('All');
  }, [activeTab]);

  const discountAmount = appliedReward ? appliedReward.value : 0;
  const orderTotals = useMemo(() => {
    const { subtotal, tax, total } = calculateTotal(currentOrder, taxRate);
    const totalAfterDiscount = Math.max(0, total - discountAmount);
    return { subtotal, tax, total, totalAfterDiscount, discountAmount };
  }, [currentOrder, taxRate, discountAmount]);

  const isBartenderAtBar = useMemo(() => {
    if (!currentUser || !selectedTable) return false;
    return currentUser.role === 'Bartender' && selectedTable.floorPlanId === 'bar';
  }, [currentUser, selectedTable]);

  const handleMenuItemClick = (item: MenuItem) => {
    if (!selectedTable) return;
    if (splits.length > 0) return;
    if (item.availableModifiers && item.availableModifiers.length > 0) {
        setModifierModalItem(item);
    } else {
        addToOrder(item, []);
    }
  };
  
  const getModifiersKey = (modifiers: Modifier[]): string => {
    return [...modifiers].sort((a,b) => a.name.localeCompare(b.name)).map(m => m.name).join(',');
  }

  const addToOrder = (item: MenuItem | OrderItem, modifiers: Modifier[] = []) => {
    const isFromHistory = 'instanceId' in item;
    const itemToAdd = isFromHistory ? { ...item } : { ...item };
    const modifiersForThisItem = isFromHistory ? item.modifiers : modifiers;
    
    const modifiersKey = getModifiersKey(modifiersForThisItem);
    const existingItem = currentOrder.find(orderItem => {
        if (orderItem.id !== item.id) return false;
        return getModifiersKey(orderItem.modifiers) === modifiersKey;
    });

    if (existingItem) {
        updateQuantity(existingItem.instanceId, 1);
    } else {
        setCurrentOrder(prev => [...prev, {
            ...itemToAdd,
            quantity: 1,
            modifiers: modifiersForThisItem,
            instanceId: nextInstanceId
        }]);
        setNextInstanceId(prev => prev + 1);
    }
    setModifierModalItem(null);
  };

  const updateQuantity = (instanceId: number, delta: number) => {
    if (splits.length > 0) return;
    setCurrentOrder((prevOrder) => {
        const itemToUpdate = prevOrder.find(item => item.instanceId === instanceId);
        if (!itemToUpdate) return prevOrder;

        const newQuantity = itemToUpdate.quantity + delta;
        if (newQuantity <= 0) {
            return prevOrder.filter(item => item.instanceId !== instanceId);
        }
        return prevOrder.map(item => item.instanceId === instanceId ? { ...item, quantity: newQuantity } : item);
    });
  };
  
  const handleConfirmModifiers = (selectedModifiers: Modifier[]) => {
    if (modifierModalItem) {
        addToOrder(modifierModalItem, selectedModifiers);
    }
  };
  
  const handleConfirmSplits = (newSplits: Split[]) => {
      setSplits(newSplits);
      setIsSplitModalOpen(false);
  };
  
  const payForSplit = (splitId: number) => {
    const splitToPay = splits.find(s => s.id === splitId);
    if (splitToPay) {
        onProcessPayment(splitToPay.items);
        setSplits(prev => prev.map(split => split.id === splitId ? {...split, status: 'paid'} : split));
    }
  };
  
  const clearOrderAndCloseTable = () => {
    if (!selectedTable) return;
    onProcessPayment(currentOrder);
    onCloseTable(selectedTable.id, currentOrder, orderTotals.discountAmount);
  };

  const handleSendOrder = async () => {
    if (!selectedTable || currentOrder.length === 0) return;
    const result = await onSendOrder(currentOrder, selectedTable);
    alert(result.message);
    // The 'processed' status is unique to the bartender direct-to-tab workflow
    if (result.status === 'processed') {
      setActiveView(View.Tables);
    }
  };

  const handleRedeemReward = (reward: Reward) => {
    if (selectedCustomer && selectedCustomer.loyaltyPoints >= reward.pointsCost) {
        onRedeemPoints(selectedCustomer.id, reward.pointsCost);
        setAppliedReward(reward);
        setIsRedeemModalOpen(false);
    }
  };

  const allSplitsPaid = splits.length > 0 && splits.every(s => s.status === 'paid');

  if (!selectedTable) {
    return (
        <div className="flex items-center justify-center h-full">
            <Card title="Point of Sale">
                <p className="text-gray-400 text-center p-8">
                    Please select a table from the Floor Plan to start an order.
                </p>
            </Card>
        </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      <div className="lg:col-span-2 h-full flex flex-col">
        <Card 
            title="Menu" 
            className="flex-1 flex flex-col"
        >
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 overflow-y-auto">
            {menuItems
              .filter((item) => item.category === activeTab && (activeSubCategory === 'All' || item.subCategory === activeSubCategory))
              .map((item) => (
              <MenuItemCard 
                key={item.id} 
                item={item} 
                onSelect={handleMenuItemClick}
              />
            ))}
          </div>
        </Card>
      </div>

      <div className="h-full flex flex-col">
        <Card title={`Order for ${selectedTable.name}`} className="flex-1 flex flex-col justify-between">
          <div>
            {selectedCustomer && (
                <CustomerProfileCard 
                    customer={selectedCustomer} 
                    onAddToOrder={item => addToOrder(item)} 
                    onRedeemClick={() => setIsRedeemModalOpen(true)}
                    canRedeem={appliedReward === null && currentOrder.length > 0}
                />
            )}
            <div className="overflow-y-auto flex-1 mb-4 max-h-[calc(100vh-450px)]">
              {currentOrder.length === 0 ? (
                <p className="text-gray-400 text-center mt-8">No items in order.</p>
              ) : splits.length > 0 ? (
                  <div className="space-y-4">
                      {splits.map(split => (
                          <Card key={split.id} className={`p-3 ${split.status === 'paid' ? 'bg-green-500/10' : 'bg-brand-primary/30'}`}>
                              <div className="flex justify-between items-center mb-2">
                                  <h4 className="font-bold text-lg">Split {split.id}</h4>
                                  {split.status === 'paid' ? 
                                      <span className="font-bold text-green-400">PAID</span> : 
                                      <span className="font-bold text-brand-secondary">${split.total.toFixed(2)}</span>
                                  }
                              </div>
                              {split.items.length > 0 && (
                                  <ul className="text-sm space-y-1 mb-2">
                                      {split.items.map(item => (
                                          <li key={item.instanceId}>{item.quantity}x {item.name}</li>
                                      ))}
                                  </ul>
                              )}
                              {split.status === 'unpaid' && (
                                  <Button onClick={() => payForSplit(split.id)} variant="primary" className="w-full text-sm py-1">Pay ${split.total.toFixed(2)}</Button>
                              )}
                          </Card>
                      ))}
                      {allSplitsPaid && (
                          <div className="text-center p-4">
                              <p className="text-green-400 font-bold text-lg mb-2">All bills paid!</p>
                              <Button onClick={clearOrderAndCloseTable} variant="secondary">Close Table</Button>
                          </div>
                      )}
                  </div>
              ) : (
                <ul className="divide-y divide-brand-primary">
                  {currentOrder.map((item) => (
                    <li key={item.instanceId} className="py-3 flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-semibold">{item.name}</p>
                        {item.modifiers.length > 0 && (
                            <div className="text-xs text-gray-400 pl-2 mt-1 space-y-0.5">
                                {item.modifiers.map(mod => (
                                    <div key={mod.name}>+ {mod.name}</div>
                                ))}
                            </div>
                        )}
                        <p className="text-sm text-gray-400 mt-1">${calculateItemPrice(item).toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                          <button onClick={() => updateQuantity(item.instanceId, -1)} className="p-1 rounded-full bg-brand-primary hover:bg-gray-600"><MinusIcon className="w-4 h-4" /></button>
                          <span className="font-bold w-6 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.instanceId, 1)} className="p-1 rounded-full bg-brand-primary hover:bg-gray-600"><PlusIcon className="w-4 h-4" /></button>
                          <button onClick={() => updateQuantity(item.instanceId, -item.quantity)} className="text-red-500 hover:text-red-400 p-1"><TrashIcon className="w-4 h-4" /></button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          
          {currentOrder.length > 0 && splits.length === 0 && (
            <div className="border-t border-brand-primary pt-4">
                <div className="space-y-2 mb-4">
                <div className="flex justify-between text-gray-300"><span>Subtotal</span><span>${orderTotals.subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-gray-300"><span>Tax ({taxRate.toFixed(2)}%)</span><span>${orderTotals.tax.toFixed(2)}</span></div>
                {appliedReward && (
                    <div className="flex justify-between text-green-400">
                        <span>Discount ({appliedReward.name})</span>
                        <span>-${orderTotals.discountAmount.toFixed(2)}</span>
                    </div>
                )}
                <div className="flex justify-between font-bold text-xl"><span>Total</span><span>${orderTotals.totalAfterDiscount.toFixed(2)}</span></div>
                </div>
                <div className="space-y-2">
                    <Button variant="primary" className="w-full bg-blue-600 hover:bg-blue-700 focus:ring-blue-500" onClick={handleSendOrder}>
                        {isBartenderAtBar ? 'Update Tab & Return' : 'Send Order to Kitchen/Bar'}
                    </Button>
                     <div className="grid grid-cols-2 gap-2">
                        <Button variant="secondary" className="w-full" onClick={clearOrderAndCloseTable}>
                            Pay at Terminal
                        </Button>
                        <Button onClick={() => setIsQrModalOpen(true)} className="bg-gray-700 hover:bg-gray-600 focus:ring-gray-500 flex items-center justify-center gap-2">
                           <QrCodeIcon className="w-5 h-5"/> Pay with QR
                        </Button>
                     </div>
                    <div className="grid grid-cols-2 gap-2">
                        <Button variant="danger" onClick={() => {setCurrentOrder([]); setAppliedReward(null);}}>Clear Order</Button>
                        <Button variant="secondary" onClick={() => setIsSplitModalOpen(true)} className="flex items-center justify-center gap-2">
                            <SplitIcon className="w-5 h-5"/> Split Check
                        </Button>
                    </div>
                    <Button onClick={() => setIsAIPairingModalOpen(true)} className="w-full bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 flex items-center justify-center gap-2">
                       <SparklesIcon className="w-5 h-5"/> AI Pairing Suggestions
                    </Button>
                </div>
            </div>
           )}
        </Card>
      </div>

      {modifierModalItem && (
        <ModifierModal
            item={modifierModalItem}
            onClose={() => setModifierModalItem(null)}
            onConfirm={handleConfirmModifiers}
        />
      )}
      {isSplitModalOpen && (
        <SplitCheckModal
            orderItems={[...currentOrder.map(i => ({...i}))]}
            orderTotal={orderTotals.total}
            taxRate={taxRate}
            onClose={() => setIsSplitModalOpen(false)}
            onConfirm={handleConfirmSplits}
        />
      )}
       {isAIPairingModalOpen && (
        <AIPairingModal
            isOpen={isAIPairingModalOpen}
            onClose={() => setIsAIPairingModalOpen(false)}
            orderItems={currentOrder}
            onAddToOrder={(item) => addToOrder(item, [])}
            allMenuItems={menuItems}
        />
      )}
      {isRedeemModalOpen && selectedCustomer && (
        <RedeemPointsModal
            isOpen={isRedeemModalOpen}
            onClose={() => setIsRedeemModalOpen(false)}
            customer={selectedCustomer}
            rewards={REWARDS_DATA}
            onRedeem={handleRedeemReward}
        />
      )}
      {isQrModalOpen && selectedTable && (
        <QRCodePaymentModal
          isOpen={isQrModalOpen}
          onClose={() => setIsQrModalOpen(false)}
          totalAmount={orderTotals.totalAfterDiscount}
          onConfirmPayment={() => {
            clearOrderAndCloseTable();
            setIsQrModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default PosScreen;
