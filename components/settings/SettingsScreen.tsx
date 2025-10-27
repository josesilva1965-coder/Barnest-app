

import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { AppSettings, MenuItem, Table, FloorPlanArea, StaffMember } from '../../types';
import AddMenuItemModal from './AddMenuItemModal';
import AddTableModal from './AddTableModal';
import { TrashIcon } from '../icons/Icons';
import * as db from '../../services/dbService';


interface SettingsScreenProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  menuItems: MenuItem[];
  tables: Table[];
  onAddMenuItem: (itemData: Omit<MenuItem, 'id' | 'image'>) => void;
  onAddTable: (tableData: Omit<Table, 'id' | 'status' | 'floorPlanId'>, floorPlanId: string) => void;
  onUpdateMenuItemImage: (itemId: number, imageData: string) => void;
  onUpdateTable: (tableId: number, updatedData: Partial<Omit<Table, 'id'>>) => void;
  onDeleteTable: (tableId: number) => void;
  floorPlanAreas: FloorPlanArea[];
  currentUser: StaffMember | null;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ settings, onUpdateSettings, menuItems, tables, onAddMenuItem, onAddTable, onUpdateMenuItemImage, onUpdateTable, onDeleteTable, floorPlanAreas, currentUser }) => {
  const [isAddMenuItemModalOpen, setIsAddMenuItemModalOpen] = useState(false);
  const [isAddTableModalOpen, setIsAddTableModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  const handleTaxRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty input for user-friendliness, but don't update state with NaN
    onUpdateSettings({ taxRate: value === '' ? 0 : parseFloat(value) });
  };
  
  const handleThemeChange = (theme: AppSettings['theme']) => {
      onUpdateSettings({ theme });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, itemId: number) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        if (loadEvent.target && typeof loadEvent.target.result === 'string') {
          onUpdateMenuItemImage(itemId, loadEvent.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetDatabase = async () => {
    const isConfirmed = window.confirm("Are you sure? This will delete ALL current orders, inventory counts, and settings, and restore the application to its initial demo state. This action cannot be undone.");
    if (isConfirmed) {
        try {
            await db.resetDatabase();
            alert("Database has been reset. The application will now reload.");
            window.location.reload();
        } catch (error) {
            console.error("Failed to reset database:", error);
            alert("An error occurred while resetting the database. Please check the console for details.");
        }
    }
  };
  
  const triggerDownload = (filename: string, content: string, mimeType: string) => {
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
  };

  const handleExport = async (format: 'json' | 'sql') => {
      setIsExporting(true);
      try {
          const date = new Date().toISOString().split('T')[0];
          if (format === 'json') {
              const jsonString = await db.exportAllDataAsJson();
              triggerDownload(`barnest-export-${date}.json`, jsonString, 'application/json');
          } else {
              const sqlString = await db.exportAllDataAsSql();
              triggerDownload(`barnest-export-${date}.sql`, sqlString, 'application/sql');
          }
      } catch (error) {
          console.error(`Failed to export data as ${format}:`, error);
          alert(`An error occurred during the ${format} export. Please check the console.`);
      } finally {
          setIsExporting(false);
      }
  };


  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-white">Application Settings</h1>
      
      <Card title="General Configuration">
        <div className="space-y-4">
          {/* Tax Rate Setting */}
          <div>
            <label htmlFor="tax-rate" className="block text-lg font-medium text-brand-accent mb-1">Sales Tax Rate</label>
            <div className="flex items-center max-w-xs">
                <input
                    type="number"
                    id="tax-rate"
                    value={settings.taxRate}
                    onChange={handleTaxRateChange}
                    className="w-full p-2 rounded-l bg-brand-primary border border-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                    step="0.01"
                    min="0"
                />
                <span className="inline-flex items-center px-3 text-sm text-gray-300 bg-brand-primary/50 border border-l-0 border-gray-600 rounded-r-md h-full">
                    %
                </span>
            </div>
            <p className="text-sm text-gray-400 mt-2">This rate will be applied to all checks at the point of sale.</p>
          </div>
        </div>
      </Card>
      
      <Card title="Live Sync Simulation">
        <div className="p-4 bg-blue-900/30 border border-blue-500/50 rounded-lg space-y-3 text-sm text-blue-200">
            <h3 className="font-bold text-blue-100 text-lg">Demonstrating Real-Time Collaboration</h3>
            <p>
                This application uses a powerful browser-based database (IndexedDB), which makes it incredibly fast and enables full offline functionality. However, this data is normally isolated to a single browser.
            </p>
            <p>
                To demonstrate how a real restaurant team would work together, we've enabled a <strong>Live Sync Simulation</strong>. When you open this app in two separate browser tabs and make a change in one (like taking an order or updating a table's status), you will see the change reflect in the other tab instantly.
            </p>
             <p>
                A small green dot will flash in the sidebar to indicate when a sync has occurred. This simulates the experience of a fully centralized, cloud-based database required for a live production environment.
            </p>
        </div>
      </Card>

      <Card title="Appearance & Language">
        <div className="space-y-6">
            {/* Theme Selection */}
            <div>
                <h3 className="text-lg font-medium text-brand-accent mb-2">Theme</h3>
                <div className="flex gap-4">
                    <Button
                        variant={settings.theme === 'dark' ? 'primary' : 'secondary'}
                        onClick={() => handleThemeChange('dark')}
                    >
                        Dark
                    </Button>
                    <Button
                        variant={settings.theme === 'light' ? 'primary' : 'secondary'}
                        onClick={() => handleThemeChange('light')}
                    >
                        Light
                    </Button>
                </div>
                 <p className="text-sm text-gray-400 mt-2">Change the color scheme of the application.</p>
            </div>
            
            {/* Language Selection */}
            <div>
                 <label htmlFor="language-select" className="block text-lg font-medium text-brand-accent mb-1">Language</label>
                <div className="max-w-xs">
                    <select 
                        id="language-select"
                        value={settings.language}
                        onChange={(e) => onUpdateSettings({ language: e.target.value as AppSettings['language'] })}
                        className="w-full p-2 rounded bg-brand-primary border border-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                    >
                        <option value="en">English</option>
                        <option value="es">Español (Spanish)</option>
                    </select>
                </div>
                <p className="text-sm text-gray-400 mt-2">Select the display language for the interface (full translation coming soon).</p>
            </div>
        </div>
      </Card>

      <Card title="Public URL / QR Code Settings">
        <div className="space-y-4">
          <div>
            <label htmlFor="base-url" className="block text-lg font-medium text-brand-accent mb-1">Base URL</label>
            <input
              type="text"
              id="base-url"
              value={settings.baseUrl || ''}
              onChange={(e) => onUpdateSettings({ baseUrl: e.target.value })}
              className="w-full p-2 rounded bg-brand-primary border border-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-secondary"
              placeholder="https://your-restaurant-url.com"
            />
             <div className="mt-2 p-3 bg-blue-500/10 text-blue-300 text-sm rounded-lg border border-blue-500/30">
                <p><strong>This is a critical setting for customer-facing features.</strong></p>
                <p className="mt-1">
                  After deploying your application to a public web address (e.g., <code>https://my-barnest-app.com</code>), you must enter that full address here. This ensures that the QR codes generated for table ordering point to the correct, live application.
                </p>
                <p className="mt-1">Please do not include a trailing slash (e.g., <code>/</code>) at the end of the URL.</p>
            </div>
          </div>
        </div>
      </Card>

      <Card title="Menu Management" titleExtra={<Button onClick={() => setIsAddMenuItemModalOpen(true)}>Add Menu Item</Button>}>
        <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
            {menuItems.map(item => (
                <div key={item.id} className="flex justify-between items-center p-2 bg-brand-primary/50 rounded">
                    <div className="flex items-center gap-4">
                        <div className="relative group shrink-0">
                            <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded"/>
                            <label className="absolute inset-0 bg-black/60 flex items-center justify-center text-xs font-semibold text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded">
                                Change
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    className="hidden" 
                                    onChange={(e) => handleImageChange(e, item.id)}
                                />
                            </label>
                        </div>
                        <span className="font-semibold">{item.name}</span>
                    </div>
                    <span className="text-gray-400">${item.price.toFixed(2)}</span>
                </div>
            ))}
        </div>
      </Card>

      <Card title="Table Management" titleExtra={<Button onClick={() => setIsAddTableModalOpen(true)}>Add Table</Button>}>
        <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
          {tables.map(table => (
              <div key={table.id} className="flex justify-between items-center p-2 bg-brand-primary/50 rounded">
                  <span className="font-semibold">{table.name}</span>
                  <div className="flex items-center gap-4">
                      <input
                          type="number"
                          value={table.seats}
                          onChange={(e) => {
                              const newSeats = parseInt(e.target.value, 10);
                              if (!isNaN(newSeats) && newSeats > 0) {
                                  onUpdateTable(table.id, { seats: newSeats });
                              }
                          }}
                          className="w-20 p-1 rounded bg-brand-dark border border-gray-700 focus:outline-none focus:ring-1 focus:ring-brand-secondary text-center"
                          min="1"
                          aria-label={`Seats for table ${table.name}`}
                      />
                      <span className="text-gray-400 text-sm">seats</span>
                      <button
                          onClick={() => {
                              if (window.confirm(`Are you sure you want to delete table ${table.name}? This cannot be undone.`)) {
                                  onDeleteTable(table.id);
                              }
                          }}
                          disabled={table.status !== 'available'}
                          title={table.status !== 'available' ? 'Cannot delete an occupied or reserved table' : 'Delete table'}
                          className="p-1 text-red-500 hover:text-red-400 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
                      >
                          <TrashIcon className="w-5 h-5" />
                      </button>
                  </div>
              </div>
          ))}
        </div>
      </Card>
      
      {currentUser?.role === 'Manager' && (
        <Card title="Data Management">
            <div className="space-y-6">
                <div className="p-4 bg-purple-900/30 border border-purple-500/50 rounded-lg">
                    <h3 className="font-bold text-purple-300 text-lg">Export & Backup</h3>
                    <p className="text-sm text-purple-200 mt-1 mb-4">
                        Download a complete copy of all your application data. This is useful for creating backups or migrating to a different system. The SQL file can be used to seed a new production database.
                    </p>
                    <div className="flex gap-4">
                        <Button onClick={() => handleExport('json')} disabled={isExporting}>
                            {isExporting ? 'Exporting...' : 'Export to JSON'}
                        </Button>
                        <Button onClick={() => handleExport('sql')} disabled={isExporting}>
                            {isExporting ? 'Exporting...' : 'Export to SQL'}
                        </Button>
                    </div>
                </div>

                <div className="p-4 bg-red-900/30 border border-red-500/50 rounded-lg">
                    <h3 className="font-bold text-red-300 text-lg">Reset Application Data</h3>
                    <p className="text-sm text-red-200 mt-1 mb-4">
                        This will permanently delete all current data including sales, inventory, and customizations, and restore the application to its original demonstration state. This is useful for training or starting fresh.
                    </p>
                    <Button variant="danger" onClick={handleResetDatabase}>
                        Reset and Re-seed Database
                    </Button>
                </div>
            </div>
        </Card>
      )}


      {isAddMenuItemModalOpen && (
          <AddMenuItemModal
              isOpen={isAddMenuItemModalOpen}
              onClose={() => setIsAddMenuItemModalOpen(false)}
              onAddMenuItem={(itemData) => {
                  onAddMenuItem(itemData);
                  setIsAddMenuItemModalOpen(false);
              }}
              menuItems={menuItems}
          />
      )}

      {isAddTableModalOpen && (
          <AddTableModal
              isOpen={isAddTableModalOpen}
              onClose={() => setIsAddTableModalOpen(false)}
              onAddTable={(tableData, floorPlanId) => {
                  onAddTable(tableData, floorPlanId);
                  setIsAddTableModalOpen(false);
              }}
              floorPlanAreas={floorPlanAreas}
          />
      )}
      
    </div>
  );
};

export default SettingsScreen;
