
import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import PosScreen from './components/pos/PosScreen';
import KdsScreen from './components/kds/KdsScreen';
import InventoryDashboard from './components/inventory/InventoryDashboard';
// FIX: Changed import to be a named import as the error indicates FloorPlan is not a default export.
import { FloorPlan } from './components/tables/FloorPlan';
import ReportsDashboard from './components/reports/ReportsDashboard';
import StaffSchedule from './components/staff/StaffSchedule';
import FeedbackAnalysis from './components/feedback/FeedbackAnalysis';
import ReservationsScreen from './components/reservations/ReservationsScreen';
import LoginScreen from './components/login/LoginScreen';
import SettingsScreen from './components/settings/SettingsScreen';
import CustomerOrderScreen from './components/customer/CustomerOrderScreen';
import CustomerReservationScreen from './components/reservations/CustomerReservationScreen';
import { View, OrderStatus } from './types';
import type { InventoryItem, OrderItem, WastageLog, Order, Table, Customer, Reservation, StaffMember, Shift, ShiftSwapRequest, StaffAvailability, AppSettings, PurchaseOrder, MenuItem, TimeClockEntry, FloorPlanArea, Modifier } from './types';
import { ROLE_PERMISSIONS, STAFF_DATA, FLOOR_PLAN_AREAS as initialFloorPlanAreas } from './constants';
import * as db from './services/dbService';
import { LocalizationProvider } from './contexts/LocalizationContext';

// Define the type for the BeforeInstallPromptEvent as it's not standard in TypeScript
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentUser, setCurrentUser] = useState<StaffMember | null>(null);
  const [activeView, _setActiveView] = useState<View>(View.Tables);

  // Data states, initialized empty
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [wastageLog, setWastageLog] = useState<WastageLog[]>([]);
  const [kdsOrders, setKdsOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [tableOrders, setTableOrders] = useState<Record<number, OrderItem[]>>({});
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [settings, setSettings] = useState<AppSettings>({ taxRate: 8.0, language: 'en', theme: 'dark', baseUrl: '' });
  const [throttlingConfig, setThrottlingConfig] = useState({ kitchen: { enabled: false, capacity: 5 }, bar: { enabled: false, capacity: 8 }});
  const [heldOrders, setHeldOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [readyTables, setReadyTables] = useState<Set<string>>(new Set());
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [shiftSwapRequests, setShiftSwapRequests] = useState<ShiftSwapRequest[]>([]);
  const [staffAvailability, setStaffAvailability] = useState<StaffAvailability[]>([]);
  const [timeClockEntries, setTimeClockEntries] = useState<TimeClockEntry[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [operatingExpenses, setOperatingExpenses] = useState({ rent: 5000, insurance: 500, utilities: 800 });
  const [floorPlanAreas, setFloorPlanAreas] = useState<FloorPlanArea[]>([]);
  
  const [customerView, setCustomerView] = useState<'ordering' | 'booking' | null>(null);
  const [customerTableId, setCustomerTableId] = useState<number | null>(null);
  const [notificationPermission, setNotificationPermission] = useState(Notification.permission);
  const [installPromptEvent, setInstallPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [syncIndicator, setSyncIndicator] = useState(false);
  const [backendMessage, setBackendMessage] = useState('');

  // PWA Install Prompt Effect
  useEffect(() => {
    fetch('/api/hello')
      .then(res => res.json())
      .then(data => setBackendMessage(data.message));
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPromptEvent(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // URL Routing Effect for Customer Views
  useEffect(() => {
    const parseUrlAndSetView = () => {
      const hash = window.location.hash;

      if (hash) {
          const paramsString = hash.startsWith('#?') ? hash.substring(2) : hash.substring(1);
          const params = new URLSearchParams(paramsString);
          const view = params.get('view');
          const tableIdParam = params.get('table');
          const isCustomerView = view === 'customer';
          const hasTableId = tableIdParam && !isNaN(parseInt(tableIdParam, 10));

          // If we have a table ID but no explicit view, assume it's a customer trying to order.
          // This provides a fallback for older QR codes or caching issues.
          if ((isCustomerView && hasTableId) || (!view && hasTableId)) {
              setCustomerView('ordering');
              setCustomerTableId(parseInt(tableIdParam!, 10));
              return;
          } else if (view === 'reserve') {
              setCustomerView('booking');
              setCustomerTableId(null);
              return;
          }
      }
      
      // If no valid customer view is found, default to staff view
      setCustomerView(null);
      setCustomerTableId(null);
    };

    parseUrlAndSetView(); // Run on initial load

    window.addEventListener('hashchange', parseUrlAndSetView);
    return () => {
        window.removeEventListener('hashchange', parseUrlAndSetView);
    };
  }, []);

  const handleInstallClick = () => {
    if (!installPromptEvent) {
      return;
    }
    installPromptEvent.prompt();
    installPromptEvent.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      setInstallPromptEvent(null);
    });
  };

  const loadData = useCallback(async () => {
    try {
      await db.initDB();
      const [
        dbMenuItems, dbInventory, dbTables, dbCustomers, dbReservations,
        dbShifts, dbStaffAvailability, dbShiftSwapRequests, dbWastageLog,
        dbPurchaseOrders, dbTimeClockEntries, dbSettings, dbOperatingExpenses,
        dbTableOrders, dbKdsOrders, dbHeldOrders, dbFloorPlanAreas
      ] = await Promise.all([
        db.getAllMenuItems(), db.getAllInventory(), db.getAllTables(), db.getAllCustomers(),
        db.getAllReservations(), db.getAllShifts(), db.getAllStaffAvailability(),
        db.getAllShiftSwapRequests(), db.getAllWastageLog(), db.getAllPurchaseOrders(),
        db.getAllTimeClockEntries(), db.getSettings(), db.getOperatingExpenses(),
        db.getAllTableOrders(), db.getAllKdsOrders(), db.getAllHeldOrders(), db.getAllFloorPlanAreas()
      ]);
      
      setMenuItems(dbMenuItems);
      setInventory(dbInventory);
      setTables(dbTables);
      setCustomers(dbCustomers);
      setReservations(dbReservations.sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime()));
      setShifts(dbShifts);
      setStaffAvailability(dbStaffAvailability);
      setShiftSwapRequests(dbShiftSwapRequests);
      setWastageLog(dbWastageLog.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
      setPurchaseOrders(dbPurchaseOrders.sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime()));
      setTimeClockEntries(dbTimeClockEntries);
      if (dbSettings) setSettings(dbSettings);
      if (dbOperatingExpenses) setOperatingExpenses(dbOperatingExpenses);
      
      const tableOrdersRecord = dbTableOrders.reduce((acc, to) => ({ ...acc, [to.tableId]: to.items }), {});
      setTableOrders(tableOrdersRecord);
      setKdsOrders(dbKdsOrders);
      setHeldOrders(dbHeldOrders);
      setFloorPlanAreas(dbFloorPlanAreas.length > 0 ? dbFloorPlanAreas : initialFloorPlanAreas);

    } catch (e) {
      console.error("Failed to load data from DB:", e);
      setError("Could not load application data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Data Loading Effect
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Live Sync Simulation Effect
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
        if (event.key === 'barnest-db-change' && event.newValue) {
            console.log('Live Sync: Detected database change from another tab. Reloading data.');
            setSyncIndicator(true);
            setTimeout(() => setSyncIndicator(false), 1000); // Visual indicator for 1 second
            loadData();
        }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
        window.removeEventListener('storage', handleStorageChange);
    };
  }, [loadData]);


  const handleGoToCustomerReservations = () => {
    window.location.hash = '#?view=reserve';
  };
  const handleGoHome = () => {
    window.location.hash = '';
  };

  const handleUpdateOperatingExpenses = async (newExpenses: Partial<typeof operatingExpenses>) => {
      const updated = { ...operatingExpenses, ...newExpenses };
      setOperatingExpenses(updated);
      await db.updateOperatingExpenses(updated);
  };

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (settings.theme === 'light') {
        root.style.setProperty('--color-brand-primary', '#e5e7eb');
        root.style.setProperty('--color-brand-secondary', '#f97316');
        root.style.setProperty('--color-brand-light', '#1f2937');
        root.style.setProperty('--color-brand-dark', '#ffffff');
        root.style.setProperty('--color-brand-accent', '#fed7aa');
        body.classList.remove('bg-brand-dark', 'text-brand-light');
        body.classList.add('bg-brand-dark', 'text-brand-light');
    } else {
        root.style.setProperty('--color-brand-primary', '#4a4a4a');
        root.style.setProperty('--color-brand-secondary', '#f97316');
        root.style.setProperty('--color-brand-light', '#f8f9fa');
        root.style.setProperty('--color-brand-dark', '#1a1a1a');
        root.style.setProperty('--color-brand-accent', '#ffedd5');
        body.classList.remove('bg-brand-dark', 'text-brand-light');
        body.classList.add('bg-brand-dark', 'text-brand-light');
    }
  }, [settings.theme]);
  
  const handleUpdateSettings = async (newSettings: Partial<AppSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    await db.updateSettings(updated);
  };

  const setActiveView = (view: View) => {
    if (currentUser) {
      const permittedViews = ROLE_PERMISSIONS[currentUser.role];
      if (permittedViews.includes(view)) {
        _setActiveView(view);
      } else {
        console.warn(`User ${currentUser.name} (role: ${currentUser.role}) tried to access forbidden view: ${view}`);
      }
    }
  };

  const handleLogin = (staff: StaffMember) => {
    setCurrentUser(staff);
    const permittedViews = ROLE_PERMISSIONS[staff.role];
    const defaultView = permittedViews.includes(View.Tables) ? View.Tables : permittedViews[0];
    _setActiveView(defaultView || View.Tables);

    if (Notification.permission === 'default') {
      Notification.requestPermission().then(setNotificationPermission);
    }
  };
  
  const handleLogout = () => setCurrentUser(null);

  useEffect(() => {
    if (!currentUser) return;
    const days: Shift['day'][] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const currentDay = days[today.getDay()];
    const userShift = shifts.find(shift => shift.staffId === currentUser.id && shift.day === currentDay);
    if (userShift) {
        const [endHours, endMinutes] = userShift.endTime.split(':').map(Number);
        const shiftEndDate = new Date();
        const [startHours] = userShift.startTime.split(':').map(Number);
        if (endHours < startHours && today.getHours() >= startHours) {
            shiftEndDate.setDate(shiftEndDate.getDate() + 1);
        }
        shiftEndDate.setHours(endHours, endMinutes, 0, 0);
        const timeoutDuration = shiftEndDate.getTime() - today.getTime();
        if (timeoutDuration > 0) {
            const timeoutId = setTimeout(() => {
                alert('Your shift has ended. You have been automatically logged out.');
                handleLogout();
            }, timeoutDuration);
            return () => clearTimeout(timeoutId);
        }
    }
  }, [currentUser, shifts]);

  const depleteFromInventory = async (orderItems: OrderItem[]) => {
    const inventoryUpdates: Record<string, number> = {};
    for (const orderItem of orderItems) {
        if (orderItem.recipe) {
          for (const recipeItem of orderItem.recipe) {
            inventoryUpdates[recipeItem.inventoryItemId] = (inventoryUpdates[recipeItem.inventoryItemId] || 0) + (recipeItem.amount * orderItem.quantity);
          }
        }
        for (const modifier of orderItem.modifiers) {
            if (modifier.inventoryMapping) {
                const { inventoryItemId, amount } = modifier.inventoryMapping;
                inventoryUpdates[inventoryItemId] = (inventoryUpdates[inventoryItemId] || 0) + (amount * orderItem.quantity);
            }
        }
    }

    const updatedInventoryItems: InventoryItem[] = [];
    const newInventory = inventory.map(item => {
        if (inventoryUpdates[item.id]) {
            const updatedItem = { ...item, stock: item.stock - inventoryUpdates[item.id] };
            updatedInventoryItems.push(updatedItem);
            return updatedItem;
        }
        return item;
    });
    setInventory(newInventory);
    await db.updateInventoryBatch(updatedInventoryItems);
  };

  const handleLogWastage = async (itemId: string, amount: number, reason?: string) => {
    const wastedItem = inventory.find(i => i.id === itemId);
    if (wastedItem) {
        const updatedItem = { ...wastedItem, stock: wastedItem.stock - amount };
        setInventory(prev => prev.map(item => item.id === itemId ? updatedItem : item));
        await db.updateInventoryItem(updatedItem);

        const newLogEntry = await db.addWastageLog({
            timestamp: new Date(),
            itemName: wastedItem.name,
            amount,
            unit: wastedItem.unit,
            reason
        });
        setWastageLog(prev => [newLogEntry, ...prev]);
    }
  };

  const handleSendOrder = async (items: OrderItem[], table: Table) => {
    const floorPlanArea = floorPlanAreas.find(area => area.id === table.floorPlanId);
    if (currentUser?.role === 'Bartender' && floorPlanArea?.id === 'bar') {
        const updatedOrders = { ...tableOrders, [table.id]: items };
        setTableOrders(updatedOrders);
        await db.updateTableOrder(table.id, items);
        if (table.status === 'available') {
            const updatedTable = { ...table, status: 'occupied' as const };
            setTables(prev => prev.map(t => t.id === table.id ? updatedTable : t));
            await db.updateTable(updatedTable);
        }
        return { status: 'processed', message: 'Bar order processed directly.' };
    }

    setTableOrders(prev => ({...prev, [table.id]: items}));
    await db.updateTableOrder(table.id, items);
    
    if (table.status === 'available') {
        const updatedTable = { ...table, status: 'occupied' as const };
        setTables(prev => prev.map(t => (t.id === table.id ? updatedTable : t)));
        await db.updateTable(updatedTable);
    }

    const kitchenItems = items.filter(item => item.category === 'Food');
    const barItems = items.filter(item => item.category === 'Drink');
    const newOrdersForTable: Omit<Order, 'id'>[] = [];
    
    const customerId = tables.find(t => t.id === table.id)?.customerId;
    const server = tables.find(t => t.id === table.id)?.server;

    if (kitchenItems.length > 0) newOrdersForTable.push({ station: 'Kitchen', items: kitchenItems, status: OrderStatus.QUEUED, createdAt: Date.now(), table: table.name, customerId, server });
    if (barItems.length > 0) newOrdersForTable.push({ station: 'Bar', items: barItems, status: OrderStatus.QUEUED, createdAt: Date.now(), table: table.name, customerId, server });

    const ordersToSend: Omit<Order, 'id'>[] = [];
    const ordersToHold: Omit<Order, 'id'>[] = [];

    const activeKitchenOrders = kdsOrders.filter(o => o.station === 'Kitchen' && (o.status === OrderStatus.QUEUED || o.status === OrderStatus.COOKING)).length;
    const activeBarOrders = kdsOrders.filter(o => o.station === 'Bar' && (o.status === OrderStatus.QUEUED || o.status === OrderStatus.COOKING)).length;

    for (const order of newOrdersForTable) {
        if (order.station === 'Kitchen' && throttlingConfig.kitchen.enabled && activeKitchenOrders + ordersToSend.filter(o => o.station === 'Kitchen').length >= throttlingConfig.kitchen.capacity) {
            ordersToHold.push(order);
        } else if (order.station === 'Bar' && throttlingConfig.bar.enabled && activeBarOrders + ordersToSend.filter(o => o.station === 'Bar').length >= throttlingConfig.bar.capacity) {
            ordersToHold.push(order);
        } else {
            ordersToSend.push(order);
        }
    }
    
    const sentDbOrders = await Promise.all(ordersToSend.map(o => db.addKdsOrder(o)));
    const heldDbOrders = await Promise.all(ordersToHold.map(o => db.addHeldOrder(o)));

    setKdsOrders(prev => [...prev, ...sentDbOrders]);
    setHeldOrders(prev => [...prev, ...heldDbOrders]);

    if (heldDbOrders.length > 0) {
      const heldStations = [...new Set(heldDbOrders.map(o => o.station))].join(' & ');
      return { status: 'held', message: `${heldStations} is busy. Order is on hold.` };
    }
    return { status: 'sent', message: 'Order sent successfully!' };
  };

  const handleCustomerOrder = async (tableId: number, newItems: OrderItem[]) => {
    const table = tables.find(t => t.id === tableId);
    if (!table) return;

    const existingOrder = tableOrders[tableId] || [];
    const mergedOrder = [...existingOrder];
    const getModifiersKey = (modifiers: Modifier[]): string => [...modifiers].sort((a,b) => a.name.localeCompare(b.name)).map(m => m.name).join(',');

    newItems.forEach(newItem => {
        const existingItemIndex = mergedOrder.findIndex(oi => oi.id === newItem.id && getModifiersKey(oi.modifiers) === getModifiersKey(newItem.modifiers));
        if (existingItemIndex > -1) mergedOrder[existingItemIndex].quantity += newItem.quantity;
        else mergedOrder.push(newItem);
    });

    setTableOrders(prev => ({...prev, [table.id]: mergedOrder}));
    await db.updateTableOrder(table.id, mergedOrder);

    if (table.status === 'available') {
        const updatedTable = { ...table, status: 'occupied' as const };
        setTables(prev => prev.map(t => (t.id === tableId ? updatedTable : t)));
        await db.updateTable(updatedTable);
    }
    
    // Delegate to handleSendOrder logic for KDS and throttling
    await handleSendOrder(newItems, table);
  };

  useEffect(() => {
    const releaseHeldOrders = async () => {
        const activeKitchenOrders = kdsOrders.filter(o => o.station === 'Kitchen' && (o.status === OrderStatus.QUEUED || o.status === OrderStatus.COOKING)).length;
        const activeBarOrders = kdsOrders.filter(o => o.station === 'Bar' && (o.status === OrderStatus.QUEUED || o.status === OrderStatus.COOKING)).length;
        
        let kitchenCapacityAvailable = throttlingConfig.kitchen.capacity - activeKitchenOrders;
        let barCapacityAvailable = throttlingConfig.bar.capacity - activeBarOrders;

        const ordersToRelease: Order[] = [];
        const remainingHeldOrders: Order[] = [];
        const sortedHeldOrders = [...heldOrders].sort((a,b) => a.createdAt - b.createdAt);

        for (const order of sortedHeldOrders) {
            if (order.station === 'Kitchen' && kitchenCapacityAvailable > 0) {
                ordersToRelease.push(order);
                kitchenCapacityAvailable--;
            } else if (order.station === 'Bar' && barCapacityAvailable > 0) {
                ordersToRelease.push(order);
                barCapacityAvailable--;
            } else {
                remainingHeldOrders.push(order);
            }
        }

        if (ordersToRelease.length > 0) {
            const addedToKds = await Promise.all(ordersToRelease.map(o => db.addKdsOrder(o)));
            setKdsOrders(prev => [...prev, ...addedToKds]);
            setHeldOrders(remainingHeldOrders);
            await db.updateHeldOrders(remainingHeldOrders);
        }
    };
    releaseHeldOrders();
  }, [kdsOrders, heldOrders, throttlingConfig]);
  
  const updateOrderStatus = async (orderId: number, status: OrderStatus) => {
      const orderToUpdate = kdsOrders.find(o => o.id === orderId);
      if (!orderToUpdate) return;
      
      const updatedOrder = { ...orderToUpdate, status };
      setKdsOrders(prev => prev.map(order => order.id === orderId ? updatedOrder : order));
      await db.updateKdsOrder(updatedOrder);

      if (status === OrderStatus.READY) {
          setReadyTables(prevSet => new Set(prevSet).add(updatedOrder.table));
          if (notificationPermission === 'granted') {
            new Notification(`Order Ready for ${updatedOrder.table}!`, {
                body: `${updatedOrder.server ? `Hey ${updatedOrder.server}, ` : ''}The order for table ${updatedOrder.table} is ready for pickup.`,
                icon: '/vite.svg' 
            });
          }
      }
  };

  const handleTableSelect = async (table: Table) => {
    let tableToSelect = table;
    if (currentUser && table.status === 'available' && !table.server) {
        const updatedTable = { ...table, server: currentUser.name, status: 'occupied' as const };
        setTables(prevTables => prevTables.map(t => (t.id === table.id ? updatedTable : t)));
        await db.updateTable(updatedTable);
        tableToSelect = updatedTable;
    }
    setSelectedTable(tableToSelect);
    setSelectedCustomer(tableToSelect.customerId ? customers.find(c => c.id === tableToSelect.customerId) || null : null);
    
    setReadyTables(prevSet => {
        if (prevSet.has(table.name)) {
            const newSet = new Set(prevSet);
            newSet.delete(table.name);
            return newSet;
        }
        return prevSet;
    });
    setActiveView(View.POS);
  };
  
  const handleCloseTable = async (tableId: number, currentOrderItems: OrderItem[], discountAmount: number) => {
    const tableToClose = tables.find(t => t.id === tableId);
    if (!tableToClose) return;

    if (tableToClose.customerId) {
        const customer = customers.find(c => c.id === tableToClose.customerId);
        if (customer) {
            const subtotal = currentOrderItems.reduce((acc, item) => acc + (item.price + item.modifiers.reduce((mAcc, m) => mAcc + m.priceChange, 0)) * item.quantity, 0);
            const subtotalAfterDiscount = Math.max(0, subtotal - discountAmount);
            const pointsEarned = Math.floor(subtotalAfterDiscount);
            const updatedCustomer = { ...customer, orderHistory: [...customer.orderHistory, ...currentOrderItems], loyaltyPoints: customer.loyaltyPoints + pointsEarned };
            setCustomers(prev => prev.map(c => c.id === customer.id ? updatedCustomer : c));
            await db.updateCustomer(updatedCustomer);
        }
    }
    
    const updatedTable = { ...tableToClose, status: 'available' as const, customerId: undefined, server: undefined };
    setTables(prev => prev.map(t => t.id === tableId ? updatedTable : t));
    await db.updateTable(updatedTable);

    const newTableOrders = {...tableOrders};
    delete newTableOrders[tableId];
    setTableOrders(newTableOrders);
    await db.deleteTableOrder(tableId);

    setKdsOrders(prev => prev.filter(o => o.table !== tableToClose.name));
    await db.clearKdsOrdersByTable(tableToClose.name);
    
    setReadyTables(prevSet => {
        if (prevSet.has(tableToClose.name)) {
            const newSet = new Set(prevSet);
            newSet.delete(tableToClose.name);
            return newSet;
        }
        return prevSet;
    });

    setSelectedTable(null);
    setSelectedCustomer(null);
    setActiveView(View.Tables);
  };

  const handleRedeemPoints = async (customerId: number, pointsToDeduct: number) => {
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
        const updatedCustomer = { ...customer, loyaltyPoints: Math.max(0, customer.loyaltyPoints - pointsToDeduct) };
        setCustomers(prev => prev.map(c => c.id === customerId ? updatedCustomer : c));
        await db.updateCustomer(updatedCustomer);
    }
  };
  
  const handleThrottlingChange = (station: 'kitchen' | 'bar', newConfig: { enabled?: boolean; capacity?: number; }) => {
    setThrottlingConfig(prev => ({ ...prev, [station]: { ...prev[station], ...newConfig }}));
  };
  
  const handleAddReservation = async (newReservationData: Omit<Reservation, 'id' | 'status'>) => {
    const newReservation = await db.addReservation(newReservationData);
    const updatedReservations = [...reservations, newReservation];
    updatedReservations.sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());
    setReservations(updatedReservations);
  };

  const handleShiftAction = async (action: 'offer' | 'claim' | 'approve' | 'deny', shift: Shift, request?: ShiftSwapRequest) => {
    if (!currentUser) return;
    if (action === 'offer') {
        const newRequest = await db.addShiftSwapRequest({ shiftId: shift.id, requestingStaffId: currentUser.id, status: 'pending-coverage' });
        setShiftSwapRequests(prev => [...prev, newRequest]);
    } else if (action === 'claim' && request) {
        const updatedReq = { ...request, status: 'pending-approval' as const, coveringStaffId: currentUser.id };
        setShiftSwapRequests(prev => prev.map(r => r.id === request.id ? updatedReq : r));
        await db.updateShiftSwapRequest(updatedReq);
    } else if (action === 'approve' && request && request.coveringStaffId) {
        const updatedShift = { ...shift, staffId: request.coveringStaffId };
        setShifts(prev => prev.map(s => s.id === request.shiftId ? updatedShift : s));
        await db.updateShift(updatedShift);
        const updatedReq = { ...request, status: 'approved' as const };
        setShiftSwapRequests(prev => prev.map(r => r.id === request.id ? updatedReq : r));
        await db.updateShiftSwapRequest(updatedReq);
    } else if (action === 'deny' && request) {
        if (request.status === 'pending-approval') {
            const updatedReq = { ...request, status: 'pending-coverage' as const, coveringStaffId: undefined };
            setShiftSwapRequests(prev => prev.map(r => r.id === request.id ? updatedReq : r));
            await db.updateShiftSwapRequest(updatedReq);
        } else {
            setShiftSwapRequests(prev => prev.filter(r => r.id !== request.id));
            await db.deleteShiftSwapRequest(request.id);
        }
    }
  };

  const handleUpdateShift = async (shiftId: number, newDay: Shift['day']) => {
    const shift = shifts.find(s => s.id === shiftId);
    if (shift) {
        const updatedShift = { ...shift, day: newDay };
        setShifts(prev => prev.map(s => s.id === shiftId ? updatedShift : s));
        await db.updateShift(updatedShift);
    }
  };
  
  const handleAddShift = async (staffId: number, day: Shift['day'], startTime: string, endTime: string) => {
    const newShift = await db.addShift({ staffId, day, startTime, endTime });
    setShifts(prev => [...prev, newShift]);
  };

  const handleDeleteShift = async (shiftId: number) => {
    setShifts(prev => prev.filter(s => s.id !== shiftId));
    await db.deleteShift(shiftId);
    const relatedRequest = shiftSwapRequests.find(r => r.shiftId === shiftId);
    if (relatedRequest) {
        setShiftSwapRequests(prev => prev.filter(r => r.shiftId !== shiftId));
        await db.deleteShiftSwapRequest(relatedRequest.id);
    }
  };

  const handleSetAvailability = async (staffId: number, day: Shift['day']) => {
    const existing = staffAvailability.find(a => a.staffId === staffId && a.day === day);
    if (!existing) {
        const newAvail = { staffId, day, status: 'available' as const };
        setStaffAvailability(prev => [...prev, newAvail]);
        await db.putStaffAvailability(newAvail);
    } else if (existing.status === 'available') {
        const updatedAvail = { ...existing, status: 'unavailable' as const };
        setStaffAvailability(prev => prev.map(a => a === existing ? updatedAvail : a));
        await db.putStaffAvailability(updatedAvail);
    } else {
        setStaffAvailability(prev => prev.filter(a => a !== existing));
        await db.deleteStaffAvailability([staffId, day]);
    }
  };

  const handleCreatePurchaseOrder = async (itemId: string, quantity: number) => {
    const item = inventory.find(i => i.id === itemId);
    if (!item) return;
    const newPO = await db.addPurchaseOrder({ inventoryItemId: itemId, itemName: item.name, quantity, createdAt: new Date(), status: 'pending' });
    setPurchaseOrders(prev => [newPO, ...prev]);
  };

  const handleReceivePurchaseOrder = async (poId: number) => {
    const po = purchaseOrders.find(p => p.id === poId);
    if (!po) return;
    const item = inventory.find(i => i.id === po.inventoryItemId);
    if (item) {
        const updatedItem = { ...item, stock: item.stock + po.quantity };
        setInventory(prev => prev.map(i => i.id === item.id ? updatedItem : i));
        await db.updateInventoryItem(updatedItem);
    }
    setPurchaseOrders(prev => prev.filter(p => p.id !== poId));
    await db.deletePurchaseOrder(poId);
  };

  const handleUpdateMenuItemImage = async (itemId: number, imageData: string) => {
    const item = menuItems.find(i => i.id === itemId);
    if (item) {
        const updatedItem = { ...item, image: imageData };
        setMenuItems(prev => prev.map(i => i.id === itemId ? updatedItem : i));
        await db.updateMenuItem(updatedItem);
    }
  };

  const handleAddMenuItem = async (itemData: Omit<MenuItem, 'id' | 'image'>) => {
      const newItem = await db.addMenuItem(itemData);
      setMenuItems(prev => [...prev, newItem]);
  };

  const handleAddTable = async (tableData: Omit<Table, 'id' | 'status' | 'floorPlanId'>, floorPlanId: string) => {
      const newTable = await db.addTable(tableData, floorPlanId);
      setTables(prev => [...prev, newTable]);
  };

  const handleUpdateTable = async (tableId: number, updatedData: Partial<Omit<Table, 'id'>>) => {
    const table = tables.find(t => t.id === tableId);
    if (table) {
        const updatedTable = { ...table, ...updatedData };
        setTables(prev => prev.map(t => t.id === tableId ? updatedTable : t));
        await db.updateTable(updatedTable);
    }
  };

  const handleDeleteTable = async (tableId: number) => {
    const tableToDelete = tables.find(t => t.id === tableId);
    if (tableToDelete && tableToDelete.status !== 'available') {
        alert("Cannot delete a table that is currently occupied or reserved.");
        return;
    }
    setTables(prev => prev.filter(t => t.id !== tableId));
    await db.deleteTable(tableId);
  };

  const handleAssignServer = async (tableId: number, serverName: string) => {
    const table = tables.find(t => t.id === tableId);
    if (table) {
        const updatedTable = { ...table, server: serverName || undefined };
        setTables(prev => prev.map(t => t.id === tableId ? updatedTable : t));
        await db.updateTable(updatedTable);
    }
  };

  const handleClockIn = async (staffId: number) => {
    const lastEntry = timeClockEntries.filter(e => e.staffId === staffId).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];
    if (lastEntry && lastEntry.type === 'in') {
        alert("You are already clocked in.");
        return;
    }
    const newEntry = await db.addTimeClockEntry({ staffId, timestamp: new Date(), type: 'in' });
    setTimeClockEntries(prev => [...prev, newEntry]);
  };

  const handleClockOut = async (staffId: number) => {
    const lastEntry = timeClockEntries.filter(e => e.staffId === staffId).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];
    if (!lastEntry || lastEntry.type === 'out') {
        alert("You are not clocked in.");
        return;
    }
    const newEntry = await db.addTimeClockEntry({ staffId, timestamp: new Date(), type: 'out' });
    setTimeClockEntries(prev => [...prev, newEntry]);
  };
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen bg-brand-dark text-white text-2xl">Loading BarNest...</div>;
  }
  if (error) {
    return <div className="flex items-center justify-center h-screen bg-brand-dark text-red-500 text-2xl">{error}</div>;
  }

  const AppContent = () => {
    // Customer-facing view routing
    if (customerView === 'ordering' && customerTableId) {
      const table = tables.find(t => t.id === customerTableId);
      const currentOrder = tableOrders[customerTableId] || [];
      if (table) return <CustomerOrderScreen 
        table={table} 
        menuItems={menuItems} 
        onSendOrder={(newItems) => handleCustomerOrder(table.id, newItems)}
        currentOrder={currentOrder}
      />;
      else return <div className="flex items-center justify-center h-screen bg-brand-dark text-white">Table not found.</div>;
    }
    if (customerView === 'booking') {
        return <CustomerReservationScreen onAddReservation={handleAddReservation} onGoHome={handleGoHome} />;
    }

    // Staff-facing view routing
    if (!currentUser) {
        return <LoginScreen onLogin={handleLogin} onGoToCustomerReservations={handleGoToCustomerReservations} backendMessage={backendMessage} />;
    }

    const visibleFloorPlanAreas = currentUser?.role === 'Bartender'
      ? floorPlanAreas.filter(area => area.id === 'bar')
      : floorPlanAreas;

    const renderView = () => {
      switch (activeView) {
        case View.POS:
          return <PosScreen 
            selectedTable={selectedTable} selectedCustomer={selectedCustomer}
            tableOrder={tableOrders[selectedTable?.id ?? -1] || []}
            onSendOrder={handleSendOrder} onProcessPayment={depleteFromInventory}
            onCloseTable={handleCloseTable} taxRate={settings.taxRate}
            menuItems={menuItems} onRedeemPoints={handleRedeemPoints}
            currentUser={currentUser} setActiveView={setActiveView}
          />;
        case View.KDS:
          return <KdsScreen 
              orders={kdsOrders} onUpdateStatus={updateOrderStatus} 
              heldOrdersCount={{ kitchen: heldOrders.filter(o => o.station === 'Kitchen').length, bar: heldOrders.filter(o => o.station === 'Bar').length }}
              throttlingConfig={throttlingConfig} onThrottlingChange={handleThrottlingChange}
          />;
        case View.Inventory:
          return <InventoryDashboard 
              inventory={inventory} onLogWastage={handleLogWastage} wastageLog={wastageLog}
              purchaseOrders={purchaseOrders} onCreatePurchaseOrder={handleCreatePurchaseOrder} onReceivePurchaseOrder={handleReceivePurchaseOrder}
          />;
        case View.Tables:
          return <FloorPlan 
              tables={tables} onTableSelect={handleTableSelect} readyTables={readyTables}
              currentUser={currentUser!} onUpdateTable={handleUpdateTable} staffMembers={STAFF_DATA}
              onAssignServer={handleAssignServer} tableOrders={tableOrders} floorPlanAreas={visibleFloorPlanAreas}
              settings={settings}
          />;
        case View.Reservations:
          return <ReservationsScreen reservations={reservations} onAddReservation={handleAddReservation} />;
        case View.Reports:
          return <ReportsDashboard menuItems={menuItems} operatingExpenses={operatingExpenses} onUpdateOperatingExpenses={handleUpdateOperatingExpenses} />;
        case View.Staff:
          return <StaffSchedule 
            shifts={shifts} 
            swapRequests={shiftSwapRequests}
            staffAvailability={staffAvailability}
            onShiftAction={handleShiftAction} onUpdateShift={handleUpdateShift} onAddShift={handleAddShift}
            onDeleteShift={handleDeleteShift} onSetAvailability={handleSetAvailability} currentUser={currentUser!}
            timeClockEntries={timeClockEntries} onClockIn={handleClockIn} onClockOut={handleClockOut}
          />;
        case View.Feedback: return <FeedbackAnalysis />;
        case View.Settings:
          return <SettingsScreen 
              settings={settings} onUpdateSettings={handleUpdateSettings} menuItems={menuItems}
              tables={tables} onAddMenuItem={handleAddMenuItem} onAddTable={handleAddTable}
              onUpdateMenuItemImage={handleUpdateMenuItemImage} onUpdateTable={handleUpdateTable}
              onDeleteTable={handleDeleteTable} floorPlanAreas={visibleFloorPlanAreas}
              currentUser={currentUser}
          />;
        default:
          return <FloorPlan 
              tables={tables} onTableSelect={handleTableSelect} readyTables={readyTables}
              currentUser={currentUser!} onUpdateTable={handleUpdateTable} staffMembers={STAFF_DATA}
              onAssignServer={handleAssignServer} tableOrders={tableOrders} floorPlanAreas={visibleFloorPlanAreas}
              settings={settings}
          />;
      }
    };

    return (
      <div className="flex h-screen bg-brand-dark font-sans">
        <Sidebar 
          activeView={activeView} setActiveView={setActiveView} 
          currentUser={currentUser} onLogout={handleLogout}
          showInstallButton={!!installPromptEvent}
          onInstallClick={handleInstallClick}
          syncIndicator={syncIndicator}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-brand-primary/20">
          {renderView()}
        </main>
      </div>
    );
  }

  return (
    <LocalizationProvider language={settings.language}>
      <AppContent />
    </LocalizationProvider>
  )
};

export default App;