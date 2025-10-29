export enum View {
  POS = 'POS',
  KDS = 'KDS',
  Inventory = 'Inventory',
  Tables = 'Tables',
  Reservations = 'Reservations',
  Reports = 'Reports',
  Staff = 'Staff',
  Feedback = 'Feedback',
  Settings = 'Settings',
}

export enum OrderStatus {
  QUEUED = 'Queued',
  COOKING = 'Cooking',
  READY = 'Ready',
  SERVED = 'Served',
}

export interface RecipeItem {
  inventoryItemId: string;
  amount: number;
}

export interface Modifier {
  name: string;
  priceChange: number;
  inventoryMapping?: {
    inventoryItemId: string;
    amount: number;
  }
}

export interface MenuItem {
  id: number;
  name:string;
  price: number;
  category: string;
  subCategory: string;
  image: string;
  availableModifiers?: Modifier[];
  recipe?: RecipeItem[];
}

export interface OrderItem extends MenuItem {
  instanceId: number; // Unique identifier for each line item in an order
  quantity: number;
  modifiers: Modifier[];
}

export interface Order {
  id: number;
  station: 'Kitchen' | 'Bar';
  items: OrderItem[];
  status: OrderStatus;
  createdAt: number; // Timestamp using Date.now()
  table: string;
  server?: string;
  customerId?: number;
}

export interface Table {
  id: number;
  name: string;
  status: 'available' | 'occupied' | 'reserved';
  seats: number;
  floorPlanId: string;
  server?: string;
  customerId?: number;
  x?: number;
  y?: number;
}

export interface Customer {
  id: number;
  name: string;
  preferences: string[];
  allergies: string[];
  orderHistory: OrderItem[];
  loyaltyPoints: number;
}

export interface InventoryItem {
    id: string;
    name: string;
    category: string;
    stock: number;
    unit: string;
    threshold: number;
    cost: number;
}

export interface StaffMember {
  id: number;
  name: string;
  role: 'Bartender' | 'Server' | 'Manager' | 'Kitchen';
  password?: string;
  hourlyRate: number;
}

export interface Shift {
  id: number;
  staffId: number;
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  startTime: string;
  endTime: string;
}

export interface Split {
  id: number;
  items: OrderItem[];
  total: number;
  status: 'unpaid' | 'paid';
}

export interface WastageLog {
    id: number;
    timestamp: Date;
    itemName: string;
    amount: number;
    unit: string;
    reason?: string;
}

export interface Reservation {
  id: number;
  customerName: string;
  partySize: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  status: 'confirmed' | 'seated' | 'cancelled';
}

export interface StaffPerformanceData {
  staffId: number;
  totalSales: number;
  averageCheckSize: number;
  upsellRate: number; // percentage
  averageTipPercentage: number; // percentage
}

export interface ShiftSwapRequest {
  id: number;
  shiftId: number; // The shift being offered
  requestingStaffId: number;
  status: 'pending-coverage' | 'pending-approval' | 'approved' | 'denied';
  coveringStaffId?: number; // The staff member who wants to take the shift
}

export interface StaffAvailability {
  staffId: number;
  day: Shift['day'];
  status: 'available' | 'unavailable';
}

export interface AppSettings {
  taxRate: number; // Stored as a percentage, e.g., 8 for 8%
  language: 'en' | 'es' | 'fr' | 'pt';
  theme: 'dark' | 'light';
  baseUrl?: string;
}

export interface PurchaseOrder {
  id: number;
  inventoryItemId: string;
  itemName: string;
  quantity: number;
  createdAt: Date;
  status: 'pending';
}

export interface TimeClockEntry {
  staffId: number;
  timestamp: Date;
  type: 'in' | 'out';
}

export interface Reward {
  id: number;
  name: string;
  pointsCost: number;
  type: 'discount_amount';
  value: number; // dollar amount
  description: string;
}

export interface FloorPlanArea {
  id: string;
  name: string;
}