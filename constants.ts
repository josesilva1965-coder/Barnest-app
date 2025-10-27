import type { MenuItem, InventoryItem, Table, StaffMember, Shift, Customer, StaffPerformanceData, StaffAvailability, Reward, FloorPlanArea } from './types';
import { View } from './types';

export const FLOOR_PLAN_AREAS: FloorPlanArea[] = [
    { id: 'main-dining', name: 'Main Dining' },
    { id: 'bar', name: 'Bar Area' },
];

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  { 
    id: 1, 
    name: 'Classic Mojito', 
    price: 12.50, 
    category: 'Drink', 
    subCategory: 'Cocktail', 
    image: 'https://picsum.photos/id/1060/200/200',
    recipe: [
      { inventoryItemId: 'alc-02', amount: 0.08 }, // 60ml from a 750ml bottle
      { inventoryItemId: 'ing-01', amount: 1 },    // 1 lime
      { inventoryItemId: 'ing-02', amount: 0.1 },  // 0.1 of a mint bunch
      { inventoryItemId: 'ing-03', amount: 0.01 }, // 10g from a 1kg bag of sugar
    ]
  },
  { 
    id: 2, 
    name: 'Old Fashioned', 
    price: 14.00, 
    category: 'Drink', 
    subCategory: 'Cocktail', 
    image: 'https://picsum.photos/id/102/200/200',
    recipe: [
      { inventoryItemId: 'alc-03', amount: 0.08 }, // 60ml from a 750ml bottle of Whiskey
      { inventoryItemId: 'ing-03', amount: 0.005 }, // 5g sugar
      { inventoryItemId: 'ing-15', amount: 0.01 }, // 2ml from 200ml bottle of Bitters
      { inventoryItemId: 'ing-16', amount: 0.1 }, // Garnish from an orange
    ]
  },
  { 
    id: 3, 
    name: 'IPA Beer', 
    price: 8.00, 
    category: 'Drink', 
    subCategory: 'Beer', 
    image: 'https://picsum.photos/id/103/200/200',
    recipe: [
      { inventoryItemId: 'bev-01', amount: 0.0167 } // 500ml from a 30L keg
    ]
  },
  { 
    id: 4, 
    name: 'Cabernet Sauvignon', 
    price: 15.00, 
    category: 'Drink', 
    subCategory: 'Wine', 
    image: 'https://picsum.photos/id/104/200/200',
    recipe: [
      { inventoryItemId: 'alc-04', amount: 0.2 } // 150ml from a 750ml bottle (1/5th)
    ]
  },
  { 
    id: 5, 
    name: 'Truffle Fries', 
    price: 9.50, 
    category: 'Food', 
    subCategory: 'Appetizer', 
    image: 'https://picsum.photos/id/211/200/200',
    recipe: [
      { inventoryItemId: 'ing-11', amount: 0.25 }, // 250g potatoes
      { inventoryItemId: 'ing-12', amount: 0.005 }, // 5ml truffle oil
    ]
  },
  { 
    id: 6, 
    name: 'Margherita Pizza', 
    price: 18.00, 
    category: 'Food', 
    subCategory: 'Main', 
    image: 'https://picsum.photos/id/225/200/200',
    availableModifiers: [
        { name: 'Extra Cheese', priceChange: 2.00, inventoryMapping: { inventoryItemId: 'ing-10', amount: 0.05 } },
        { name: 'Gluten-Free Crust', priceChange: 3.50 },
        { name: 'No Olives', priceChange: 0.00 }
    ],
    recipe: [
      { inventoryItemId: 'ing-08', amount: 1 }, // 1 dough ball
      { inventoryItemId: 'ing-09', amount: 0.1 }, // 100ml sauce
      { inventoryItemId: 'ing-10', amount: 0.1 }, // 100g mozzarella
    ]
  },
  { 
    id: 7, 
    name: 'Wagyu Burger', 
    price: 24.00, 
    category: 'Food', 
    subCategory: 'Main', 
    image: 'https://picsum.photos/id/237/200/200',
    availableModifiers: [
        { name: 'Add Bacon', priceChange: 2.50, inventoryMapping: { inventoryItemId: 'ing-07', amount: 2 } },
        { name: 'No Onions', priceChange: 0.00 },
        { name: 'Extra Patty', priceChange: 5.00, inventoryMapping: { inventoryItemId: 'ing-04', amount: 1 } }
    ],
    recipe: [
      { inventoryItemId: 'ing-04', amount: 1 }, // 1 patty
      { inventoryItemId: 'ing-05', amount: 1 }, // 1 bun
      { inventoryItemId: 'ing-06', amount: 2 }, // 2 slices of cheese
    ]
  },
  { 
    id: 8, 
    name: 'Lava Cake', 
    price: 11.00, 
    category: 'Food', 
    subCategory: 'Dessert', 
    image: 'https://picsum.photos/id/249/200/200',
    recipe: [
      { inventoryItemId: 'ing-13', amount: 0.07 }, // 70g chocolate
      { inventoryItemId: 'ing-14', amount: 0.05 }, // 50g flour
      { inventoryItemId: 'ing-03', amount: 0.03 }, // 30g sugar
    ]
  },
];

export const CUSTOMERS_DATA: Customer[] = [
    {
        id: 1,
        name: 'Mr. Lee',
        preferences: ['Likes spicy food', 'Prefers window seat'],
        allergies: ['Peanuts'],
        orderHistory: [
            {...(INITIAL_MENU_ITEMS.find(i => i.name === 'Wagyu Burger') as MenuItem), instanceId: 1001, quantity: 1, modifiers: [{ name: 'Add Bacon', priceChange: 2.50, inventoryMapping: { inventoryItemId: 'ing-07', amount: 2 } }]},
            {...(INITIAL_MENU_ITEMS.find(i => i.name === 'Old Fashioned') as MenuItem), instanceId: 1002, quantity: 2, modifiers: []},
        ],
        loyaltyPoints: 125,
    },
    {
        id: 2,
        name: 'Jane Smith',
        preferences: ['Vegan options only'],
        allergies: [],
        orderHistory: [],
        loyaltyPoints: 30,
    }
];

export const INVENTORY_DATA: InventoryItem[] = [
    { id: 'alc-01', name: 'Vodka', category: 'Alcohol', stock: 12, unit: 'bottles (750ml)', threshold: 5, cost: 18.00 },
    { id: 'alc-02', name: 'Rum', category: 'Alcohol', stock: 25, unit: 'bottles (750ml)', threshold: 10, cost: 15.00 },
    { id: 'alc-03', name: 'Whiskey', category: 'Alcohol', stock: 8, unit: 'bottles (750ml)', threshold: 5, cost: 22.00 },
    { id: 'ing-01', name: 'Limes', category: 'Ingredient', stock: 45, unit: 'units', threshold: 50, cost: 0.50 },
    { id: 'ing-02', name: 'Mint', category: 'Ingredient', stock: 3, unit: 'bunches', threshold: 5, cost: 2.00 },
    { id: 'ing-03', name: 'Sugar', category: 'Ingredient', stock: 10, unit: 'kg', threshold: 2, cost: 3.00 },
    { id: 'ing-04', name: 'Wagyu Patty', category: 'Ingredient', stock: 50, unit: 'units', threshold: 20, cost: 5.50 },
    { id: 'ing-05', name: 'Brioche Buns', category: 'Ingredient', stock: 50, unit: 'units', threshold: 20, cost: 1.00 },
    { id: 'ing-06', name: 'Cheddar Slices', category: 'Ingredient', stock: 100, unit: 'slices', threshold: 40, cost: 0.25 },
    { id: 'ing-07', name: 'Bacon Strips', category: 'Ingredient', stock: 80, unit: 'strips', threshold: 30, cost: 0.40 },
    { id: 'sup-01', name: 'Napkins', category: 'Supply', stock: 2500, unit: 'units', threshold: 1000, cost: 0.02 },
    { id: 'alc-04', name: 'Cabernet Sauvignon', category: 'Alcohol', stock: 12, unit: 'bottles (750ml)', threshold: 6, cost: 25.00 },
    { id: 'bev-01', name: 'IPA Keg', category: 'Beverage', stock: 2, unit: 'kegs (30L)', threshold: 1, cost: 120.00 },
    { id: 'ing-08', name: 'Pizza Dough Ball', category: 'Ingredient', stock: 40, unit: 'units', threshold: 20, cost: 1.20 },
    { id: 'ing-09', name: 'Tomato Sauce', category: 'Ingredient', stock: 10, unit: 'liters', threshold: 5, cost: 8.00 },
    { id: 'ing-10', name: 'Mozzarella Cheese', category: 'Ingredient', stock: 5, unit: 'kg', threshold: 2, cost: 15.00 },
    { id: 'ing-11', name: 'Potatoes', category: 'Ingredient', stock: 20, unit: 'kg', threshold: 10, cost: 1.50 },
    { id: 'ing-12', name: 'Truffle Oil', category: 'Ingredient', stock: 1, unit: 'liters', threshold: 0.5, cost: 50.00 },
    { id: 'ing-13', name: 'Dark Chocolate', category: 'Ingredient', stock: 3, unit: 'kg', threshold: 1, cost: 20.00 },
    { id: 'ing-14', name: 'Flour', category: 'Ingredient', stock: 10, unit: 'kg', threshold: 5, cost: 5.00 },
    { id: 'ing-15', name: 'Angostura Bitters', category: 'Ingredient', stock: 2, unit: 'bottles (200ml)', threshold: 1, cost: 10.00 },
    { id: 'ing-16', name: 'Orange', category: 'Ingredient', stock: 30, unit: 'units', threshold: 20, cost: 0.60 },
];

export const SALES_DATA = [
  { menuItemId: 1, quantitySold: 150 }, // Classic Mojito (Star)
  { menuItemId: 2, quantitySold: 120 }, // Old Fashioned
  { menuItemId: 3, quantitySold: 250 }, // IPA Beer (Plowhorse)
  { menuItemId: 4, quantitySold: 40 },  // Cabernet Sauvignon (Dog)
  { menuItemId: 5, quantitySold: 200 }, // Truffle Fries (Plowhorse)
  { menuItemId: 6, quantitySold: 180 }, // Margherita Pizza
  { menuItemId: 7, quantitySold: 220 }, // Wagyu Burger (Star)
  { menuItemId: 8, quantitySold: 70 },  // Lava Cake (Puzzle)
];

export const INITIAL_TABLES_DATA: Table[] = [
    // Main Dining
    { id: 1, name: 'T1', status: 'available', seats: 2, floorPlanId: 'main-dining', x: 50, y: 50 },
    { id: 2, name: 'T2', status: 'occupied', seats: 4, floorPlanId: 'main-dining', server: 'Anna', customerId: 1, x: 250, y: 50 },
    { id: 3, name: 'T3', status: 'available', seats: 4, floorPlanId: 'main-dining', x: 50, y: 250 },
    { id: 4, name: 'T4', status: 'reserved', seats: 6, floorPlanId: 'main-dining', x: 250, y: 250 },
    { id: 7, name: 'P1', status: 'available', seats: 8, floorPlanId: 'main-dining', x: 50, y: 450 },
    { id: 8, name: 'P2', status: 'reserved', seats: 4, floorPlanId: 'main-dining', x: 400, y: 450 },
    // Bar Area
    { id: 5, name: 'B1', status: 'available', seats: 1, floorPlanId: 'bar', x: 50, y: 80 },
    { id: 6, name: 'B2', status: 'available', seats: 1, floorPlanId: 'bar', x: 150, y: 80 },
    { id: 9, name: 'B3', status: 'available', seats: 1, floorPlanId: 'bar', x: 250, y: 80 },
    { id: 10, name: 'B4', status: 'available', seats: 1, floorPlanId: 'bar', x: 350, y: 80 },
    { id: 11, name: 'H1', status: 'available', seats: 4, floorPlanId: 'bar', x: 100, y: 250 },
    { id: 12, name: 'H2', status: 'available', seats: 4, floorPlanId: 'bar', x: 300, y: 250 },
];

export const STAFF_DATA: StaffMember[] = [
    { id: 1, name: 'Anna', role: 'Server', hourlyRate: 15.00 },
    { id: 2, name: 'John', role: 'Server', hourlyRate: 15.50 },
    { id: 3, name: 'Mike', role: 'Bartender', hourlyRate: 18.00 },
    { id: 4, name: 'Chloe', role: 'Bartender', hourlyRate: 18.50 },
    { id: 5, name: 'David', role: 'Manager', hourlyRate: 25.00 },
    { id: 6, name: 'Maria', role: 'Kitchen', hourlyRate: 20.00 },
];

export const STAFF_PERFORMANCE_DATA: StaffPerformanceData[] = [
    { staffId: 1, totalSales: 22540, averageCheckSize: 45.80, upsellRate: 15, averageTipPercentage: 18.5 }, // Anna
    { staffId: 2, totalSales: 21890, averageCheckSize: 43.20, upsellRate: 12, averageTipPercentage: 19.2 }, // John
    { staffId: 3, totalSales: 28930, averageCheckSize: 35.70, upsellRate: 22, averageTipPercentage: 20.1 }, // Mike
    { staffId: 4, totalSales: 27500, averageCheckSize: 36.10, upsellRate: 18, averageTipPercentage: 19.8 }, // Chloe
];

export const SHIFTS_DATA: Shift[] = [
    { id: 1, staffId: 1, day: 'Mon', startTime: '17:00', endTime: '23:00' },
    { id: 2, staffId: 2, day: 'Mon', startTime: '17:00', endTime: '23:00' },
    { id: 3, staffId: 3, day: 'Mon', startTime: '16:00', endTime: '00:00' },
    { id: 4, staffId: 5, day: 'Mon', startTime: '15:00', endTime: '23:00' },
    { id: 5, staffId: 6, day: 'Mon', startTime: '16:00', endTime: '22:00' },
    { id: 6, staffId: 1, day: 'Tue', startTime: '17:00', endTime: '23:00' },
    { id: 7, staffId: 4, day: 'Tue', startTime: '16:00', endTime: '00:00' },
    // Adding shifts for every day for testing auto-logout
    ...STAFF_DATA.flatMap(staff => 
        ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => ({
            id: 100 + staff.id * 7 + index,
            staffId: staff.id,
            day: day as Shift['day'],
            startTime: staff.role === 'Manager' ? '09:00' : '17:00',
            endTime: staff.role === 'Manager' ? '23:59' : '23:00'
        }))
    )
];

export const STAFF_AVAILABILITY_DATA: StaffAvailability[] = [
    { staffId: 1, day: 'Wed', status: 'available' },
    { staffId: 1, day: 'Thu', status: 'unavailable' },
    { staffId: 2, day: 'Tue', status: 'available' },
    { staffId: 4, day: 'Fri', status: 'available' },
];

export const ROLE_PERMISSIONS: Record<StaffMember['role'], View[]> = {
    Manager: [View.POS, View.KDS, View.Inventory, View.Tables, View.Reservations, View.Reports, View.Staff, View.Feedback, View.Settings],
    Server: [View.POS, View.Tables, View.Reservations, View.Staff],
    Bartender: [View.POS, View.Tables, View.KDS, View.Inventory, View.Staff],
    Kitchen: [View.KDS, View.Staff],
};


export const INVENTORY_HISTORY = [
    { name: 'Day 1', Rum: 30, Whiskey: 15, Vodka: 20 },
    { name: 'Day 5', Rum: 28, Whiskey: 14, Vodka: 18 },
    { name: 'Day 10', Rum: 25, Whiskey: 12, Vodka: 15 },
    { name: 'Day 15', Rum: 22, Whiskey: 11, Vodka: 14 },
    { name: 'Day 20', Rum: 18, Whiskey: 10, Vodka: 12 },
    { name: 'Day 25', Rum: 15, Whiskey: 8, Vodka: 10 },
    { name: 'Day 30', Rum: 12, Whiskey: 6, Vodka: 8 },
];

export const TOP_CONSUMED = [
    { name: 'Limes', value: 150 },
    { name: 'Mint', value: 80 },
    { name: 'Simple Syrup', value: 75 },
    { name: 'Oranges', value: 60 },
    { name: 'Tonic Water', value: 120 },
];

export const DAILY_SALES = [
    { day: 'Mon', food: 2400, drinks: 3800 },
    { day: 'Tue', food: 2210, drinks: 3900 },
    { day: 'Wed', food: 2290, drinks: 4100 },
    { day: 'Thu', food: 2000, drinks: 4500 },
    { day: 'Fri', food: 2181, drinks: 5800 },
    { day: 'Sat', food: 2500, drinks: 7200 },
    { day: 'Sun', food: 3490, drinks: 6500 },
];

export const TOP_SELLING_ITEMS = [
    { name: 'Old Fashioned', revenue: 2800 },
    { name: 'Wagyu Burger', revenue: 2400 },
    { name: 'IPA Beer', revenue: 1900 },
    { name: 'Truffle Fries', revenue: 1500 },
    { name: 'Classic Mojito', revenue: 1250 },
];

export const REWARDS_DATA: Reward[] = [
    { id: 1, name: '$5 Off', pointsCost: 50, type: 'discount_amount', value: 5, description: 'Get $5 off your total bill.' },
    { id: 2, name: '$10 Off', pointsCost: 90, type: 'discount_amount', value: 10, description: 'Get $10 off your total bill.' },
    { id: 3, name: '$20 Off', pointsCost: 160, type: 'discount_amount', value: 20, description: 'Get $20 off your total bill.' },
];