// New file: services/dbService.ts
import {
  InventoryItem,
  MenuItem,
  Table,
  StaffMember,
  Customer,
  Reservation,
  Shift,
  StaffAvailability,
  ShiftSwapRequest,
  WastageLog,
  PurchaseOrder,
  TimeClockEntry,
  AppSettings,
  OrderItem,
  Order,
  FloorPlanArea,
} from '../types';

import {
  INITIAL_MENU_ITEMS,
  INVENTORY_DATA,
  INITIAL_TABLES_DATA,
  STAFF_DATA,
  CUSTOMERS_DATA,
  SHIFTS_DATA,
  STAFF_AVAILABILITY_DATA,
  FLOOR_PLAN_AREAS
} from '../constants';

const DB_NAME = 'BarNestDB';
const DB_VERSION = 1;

const STORES = {
  MENU_ITEMS: 'menuItems',
  INVENTORY: 'inventory',
  TABLES: 'tables',
  STAFF: 'staff',
  CUSTOMERS: 'customers',
  RESERVATIONS: 'reservations',
  SHIFTS: 'shifts',
  STAFF_AVAILABILITY: 'staffAvailability',
  SHIFT_SWAP_REQUESTS: 'shiftSwapRequests',
  WASTAGE_LOG: 'wastageLog',
  PURCHASE_ORDERS: 'purchaseOrders',
  TIME_CLOCK_ENTRIES: 'timeClockEntries',
  SETTINGS: 'settings',
  TABLE_ORDERS: 'tableOrders',
  KDS_ORDERS: 'kdsOrders',
  HELD_ORDERS: 'heldOrders',
  FLOOR_PLAN_AREAS: 'floorPlanAreas',
};

let dbPromise: Promise<IDBDatabase> | null = null;

const openDb = (): Promise<IDBDatabase> => {
  if (dbPromise) {
    return dbPromise;
  }
  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('Database error:', request.error);
      reject('Database error');
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = (event.target as IDBOpenDBRequest).transaction;

      // Create object stores
      if (!db.objectStoreNames.contains(STORES.MENU_ITEMS)) {
        db.createObjectStore(STORES.MENU_ITEMS, { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains(STORES.INVENTORY)) {
        db.createObjectStore(STORES.INVENTORY, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORES.TABLES)) {
        db.createObjectStore(STORES.TABLES, { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains(STORES.STAFF)) {
        db.createObjectStore(STORES.STAFF, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORES.CUSTOMERS)) {
        db.createObjectStore(STORES.CUSTOMERS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORES.RESERVATIONS)) {
        db.createObjectStore(STORES.RESERVATIONS, { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains(STORES.SHIFTS)) {
        db.createObjectStore(STORES.SHIFTS, { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains(STORES.STAFF_AVAILABILITY)) {
        db.createObjectStore(STORES.STAFF_AVAILABILITY, { keyPath: ['staffId', 'day'] });
      }
      if (!db.objectStoreNames.contains(STORES.SHIFT_SWAP_REQUESTS)) {
        db.createObjectStore(STORES.SHIFT_SWAP_REQUESTS, { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains(STORES.WASTAGE_LOG)) {
        db.createObjectStore(STORES.WASTAGE_LOG, { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains(STORES.PURCHASE_ORDERS)) {
        db.createObjectStore(STORES.PURCHASE_ORDERS, { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains(STORES.TIME_CLOCK_ENTRIES)) {
        db.createObjectStore(STORES.TIME_CLOCK_ENTRIES, { autoIncrement: true });
      }
      if (!db.objectStoreNames.contains(STORES.TABLE_ORDERS)) {
        db.createObjectStore(STORES.TABLE_ORDERS, { keyPath: 'tableId' });
      }
      if (!db.objectStoreNames.contains(STORES.KDS_ORDERS)) {
        db.createObjectStore(STORES.KDS_ORDERS, { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains(STORES.HELD_ORDERS)) {
        db.createObjectStore(STORES.HELD_ORDERS, { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains(STORES.FLOOR_PLAN_AREAS)) {
        db.createObjectStore(STORES.FLOOR_PLAN_AREAS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
         db.createObjectStore(STORES.SETTINGS, { keyPath: 'id' });
      }
      
      // Seeding
      const seedData = (storeName: string, data: any[]) => {
        const store = transaction!.objectStore(storeName);
        data.forEach(item => store.put(item));
      };
      
      seedData(STORES.MENU_ITEMS, INITIAL_MENU_ITEMS);
      seedData(STORES.INVENTORY, INVENTORY_DATA);
      seedData(STORES.TABLES, INITIAL_TABLES_DATA);
      seedData(STORES.STAFF, STAFF_DATA);
      seedData(STORES.CUSTOMERS, CUSTOMERS_DATA);
      seedData(STORES.SHIFTS, SHIFTS_DATA);
      seedData(STORES.STAFF_AVAILABILITY, STAFF_AVAILABILITY_DATA);
      seedData(STORES.FLOOR_PLAN_AREAS, FLOOR_PLAN_AREAS);

      const settingsStore = transaction!.objectStore(STORES.SETTINGS);
      settingsStore.put({ id: 'appSettings', taxRate: 8.0, language: 'en', theme: 'dark' });
      settingsStore.put({ id: 'operatingExpenses', rent: 5000, insurance: 500, utilities: 800 });
    };
  });
  return dbPromise;
};

// Generic CRUD helpers
const getStore = async (storeName: string, mode: IDBTransactionMode) => {
  const db = await openDb();
  const transaction = db.transaction(storeName, mode);
  return transaction.objectStore(storeName);
};

const getAll = async <T>(storeName: string): Promise<T[]> => {
  const store = await getStore(storeName, 'readonly');
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const get = async <T>(storeName: string, key: IDBValidKey): Promise<T | undefined> => {
    const store = await getStore(storeName, 'readonly');
    return new Promise((resolve, reject) => {
        const request = store.get(key);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};


const add = async <T extends {id?: any}>(storeName: string, item: Omit<T, 'id'>): Promise<T> => {
    const store = await getStore(storeName, 'readwrite');
    return new Promise((resolve, reject) => {
        const request = store.add(item);
        request.onsuccess = () => {
            const newItemRequest = store.get(request.result);
            newItemRequest.onsuccess = () => resolve(newItemRequest.result);
            newItemRequest.onerror = () => reject(newItemRequest.error);
        };
        request.onerror = () => reject(request.error);
    });
};

const put = async <T>(storeName: string, item: T): Promise<T> => {
  const store = await getStore(storeName, 'readwrite');
  return new Promise((resolve, reject) => {
    const request = store.put(item);
    request.onsuccess = () => resolve(item); // Put returns the key, not the item. Resolve with original item.
    request.onerror = () => reject(request.error);
  });
};

const deleteItem = async (storeName: string, key: IDBValidKey): Promise<void> => {
  const store = await getStore(storeName, 'readwrite');
  return new Promise((resolve, reject) => {
    const request = store.delete(key);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

const clearStore = async (storeName: string): Promise<void> => {
    const store = await getStore(storeName, 'readwrite');
    return new Promise((resolve, reject) => {
        const request = store.clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
};


// Export specific service functions
export const initDB = () => openDb();

// Settings
export const getSettings = () => get<AppSettings>(STORES.SETTINGS, 'appSettings');
export const updateSettings = (settings: AppSettings) => put(STORES.SETTINGS, { ...settings, id: 'appSettings' });
export const getOperatingExpenses = () => get<{rent: number, insurance: number, utilities: number}>(STORES.SETTINGS, 'operatingExpenses');
export const updateOperatingExpenses = (expenses: {rent: number, insurance: number, utilities: number}) => put(STORES.SETTINGS, { ...expenses, id: 'operatingExpenses' });

// Menu Items
export const getAllMenuItems = () => getAll<MenuItem>(STORES.MENU_ITEMS);
export const addMenuItem = (item: Omit<MenuItem, 'id'|'image'>) => add<MenuItem>(STORES.MENU_ITEMS, {...item, image: `https://picsum.photos/seed/${Date.now()}/200/200`});
export const updateMenuItem = (item: MenuItem) => put(STORES.MENU_ITEMS, item);

// Inventory
export const getAllInventory = () => getAll<InventoryItem>(STORES.INVENTORY);
export const updateInventoryItem = (item: InventoryItem) => put(STORES.INVENTORY, item);
export const updateInventoryBatch = async (items: InventoryItem[]) => {
    const store = await getStore(STORES.INVENTORY, 'readwrite');
    items.forEach(item => store.put(item));
    return Promise.resolve();
};

// Tables
export const getAllTables = () => getAll<Table>(STORES.TABLES);
export const addTable = (table: Omit<Table, 'id'|'status'|'floorPlanId'>, floorPlanId: string) => add<Table>(STORES.TABLES, {...table, status: 'available', floorPlanId, x: 20, y: 20});
export const updateTable = (table: Table) => put(STORES.TABLES, table);
export const deleteTable = (tableId: number) => deleteItem(STORES.TABLES, tableId);

// Staff
export const getAllStaff = () => getAll<StaffMember>(STORES.STAFF);

// Customers
export const getAllCustomers = () => getAll<Customer>(STORES.CUSTOMERS);
export const updateCustomer = (customer: Customer) => put(STORES.CUSTOMERS, customer);

// Reservations
export const getAllReservations = () => getAll<Reservation>(STORES.RESERVATIONS);
export const addReservation = (reservation: Omit<Reservation, 'id' | 'status'>) => add<Reservation>(STORES.RESERVATIONS, {...reservation, status: 'confirmed'});

// Shifts
export const getAllShifts = () => getAll<Shift>(STORES.SHIFTS);
export const addShift = (shift: Omit<Shift, 'id'>) => add<Shift>(STORES.SHIFTS, shift);
export const updateShift = (shift: Shift) => put(STORES.SHIFTS, shift);
export const deleteShift = (shiftId: number) => deleteItem(STORES.SHIFTS, shiftId);

// Staff Availability
export const getAllStaffAvailability = () => getAll<StaffAvailability>(STORES.STAFF_AVAILABILITY);
export const putStaffAvailability = (availability: StaffAvailability) => put(STORES.STAFF_AVAILABILITY, availability);
export const deleteStaffAvailability = (key: [number, Shift['day']]) => deleteItem(STORES.STAFF_AVAILABILITY, key);

// Shift Swap Requests
export const getAllShiftSwapRequests = () => getAll<ShiftSwapRequest>(STORES.SHIFT_SWAP_REQUESTS);
export const addShiftSwapRequest = (req: Omit<ShiftSwapRequest, 'id'>) => add<ShiftSwapRequest>(STORES.SHIFT_SWAP_REQUESTS, req);
export const updateShiftSwapRequest = (req: ShiftSwapRequest) => put(STORES.SHIFT_SWAP_REQUESTS, req);
export const deleteShiftSwapRequest = (id: number) => deleteItem(STORES.SHIFT_SWAP_REQUESTS, id);

// Wastage Log
export const getAllWastageLog = () => getAll<WastageLog>(STORES.WASTAGE_LOG);
export const addWastageLog = (log: Omit<WastageLog, 'id'>) => add<WastageLog>(STORES.WASTAGE_LOG, log);

// Purchase Orders
export const getAllPurchaseOrders = () => getAll<PurchaseOrder>(STORES.PURCHASE_ORDERS);
export const addPurchaseOrder = (po: Omit<PurchaseOrder, 'id'>) => add<PurchaseOrder>(STORES.PURCHASE_ORDERS, po);
export const deletePurchaseOrder = (id: number) => deleteItem(STORES.PURCHASE_ORDERS, id);

// Time Clock
export const getAllTimeClockEntries = () => getAll<TimeClockEntry>(STORES.TIME_CLOCK_ENTRIES);
// FIX: The generic 'add' helper has a type constraint requiring an 'id' property, which TimeClockEntry lacks. This custom implementation adds the entry directly, resolving the type error.
export const addTimeClockEntry = async (entry: TimeClockEntry): Promise<TimeClockEntry> => {
    const store = await getStore(STORES.TIME_CLOCK_ENTRIES, 'readwrite');
    return new Promise((resolve, reject) => {
        const request = store.add(entry);
        request.onsuccess = () => resolve(entry);
        request.onerror = () => reject(request.error);
    });
};


// Orders
export const getAllTableOrders = () => getAll<{tableId: number, items: OrderItem[]}>(STORES.TABLE_ORDERS);
export const updateTableOrder = (tableId: number, items: OrderItem[]) => put(STORES.TABLE_ORDERS, { tableId, items });
export const deleteTableOrder = (tableId: number) => deleteItem(STORES.TABLE_ORDERS, tableId);

export const getAllKdsOrders = () => getAll<Order>(STORES.KDS_ORDERS);
export const addKdsOrder = (order: Omit<Order, 'id'>) => add<Order>(STORES.KDS_ORDERS, order);
export const updateKdsOrder = (order: Order) => put(STORES.KDS_ORDERS, order);
export const deleteKdsOrder = (id: number) => deleteItem(STORES.KDS_ORDERS, id);
export const clearKdsOrdersByTable = async (tableName: string) => {
    const orders = await getAllKdsOrders();
    const store = await getStore(STORES.KDS_ORDERS, 'readwrite');
    orders.filter(o => o.table === tableName).forEach(o => store.delete(o.id));
};


export const getAllHeldOrders = () => getAll<Order>(STORES.HELD_ORDERS);
export const addHeldOrder = (order: Omit<Order, 'id'>) => add<Order>(STORES.HELD_ORDERS, order);
export const updateHeldOrders = async (orders: Order[]) => {
    await clearStore(STORES.HELD_ORDERS);
    const store = await getStore(STORES.HELD_ORDERS, 'readwrite');
    orders.forEach(order => store.add(order));
};

export const getAllFloorPlanAreas = () => getAll<FloorPlanArea>(STORES.FLOOR_PLAN_AREAS);