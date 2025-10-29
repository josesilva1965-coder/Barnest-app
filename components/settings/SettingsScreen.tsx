

import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import type { AppSettings, MenuItem, Table, FloorPlanArea, StaffMember } from '../../types';
import AddMenuItemModal from './AddMenuItemModal';
import AddTableModal from './AddTableModal';
import { TrashIcon, CheckIcon } from '../icons/Icons';
import * as db from '../../services/dbService';
import { useLocalization } from '../../contexts/LocalizationContext';

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
  const { t } = useLocalization();
  const [localSettings, setLocalSettings] = useState(settings);
  const [isAddMenuItemModalOpen, setIsAddMenuItemModalOpen] = useState(false);
  const [isAddTableModalOpen, setIsAddTableModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isSaved, setIsSaved] = useState(true);

  useEffect(() => {
    setLocalSettings(settings);
    setIsSaved(true);
  }, [settings]);

  const handleSettingsChange = (newSettings: Partial<AppSettings>) => {
    setLocalSettings(prev => ({...prev, ...newSettings}));
    setIsSaved(false);
  }

  const handleSaveChanges = () => {
    onUpdateSettings(localSettings);
    setIsSaved(true);
  }

  const handleCancelChanges = () => {
    setLocalSettings(settings);
    setIsSaved(true);
  }
  
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
    const isConfirmed = window.confirm(t('settings.resetWarning'));
    if (isConfirmed) {
        try {
            await db.resetDatabase();
            alert(t('settings.resetSuccess'));
            window.location.reload();
        } catch (error) {
            console.error("Failed to reset database:", error);
            alert(t('settings.resetError'));
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
      <h1 className="text-3xl font-bold text-white">{t('settings.title')}</h1>
      
      <Card title={t('settings.general.title')}>
        <div className="space-y-4">
          <div>
            <label htmlFor="tax-rate" className="block text-lg font-medium text-brand-accent mb-1">{t('settings.general.taxRateLabel')}</label>
            <div className="flex items-center max-w-xs">
                <input
                    type="number"
                    id="tax-rate"
                    value={localSettings.taxRate}
                    onChange={(e) => handleSettingsChange({ taxRate: e.target.value === '' ? 0 : parseFloat(e.target.value) })}
                    className="w-full p-2 rounded-l bg-brand-primary border border-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                    step="0.01"
                    min="0"
                />
                <span className="inline-flex items-center px-3 text-sm text-gray-300 bg-brand-primary/50 border border-l-0 border-gray-600 rounded-r-md h-full">
                    %
                </span>
            </div>
            <p className="text-sm text-gray-400 mt-2">{t('settings.general.taxRateDescription')}</p>
          </div>
        </div>
      </Card>

      <Card title={t('settings.appearance.title')}>
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium text-brand-accent mb-2">{t('settings.appearance.themeLabel')}</h3>
                <div className="flex gap-4">
                    <Button
                        variant={localSettings.theme === 'dark' ? 'primary' : 'secondary'}
                        onClick={() => handleSettingsChange({ theme: 'dark' })}
                    >
                        {t('settings.appearance.dark')}
                    </Button>
                    <Button
                        variant={localSettings.theme === 'light' ? 'primary' : 'secondary'}
                        onClick={() => handleSettingsChange({ theme: 'light' })}
                    >
                        {t('settings.appearance.light')}
                    </Button>
                </div>
                 <p className="text-sm text-gray-400 mt-2">{t('settings.appearance.themeDescription')}</p>
            </div>
            
            <div>
                 <label htmlFor="language-select" className="block text-lg font-medium text-brand-accent mb-1">{t('settings.appearance.languageLabel')}</label>
                <div className="max-w-xs">
                    <select 
                        id="language-select"
                        value={localSettings.language}
                        onChange={(e) => handleSettingsChange({ language: e.target.value as AppSettings['language'] })}
                        className="w-full p-2 rounded bg-brand-primary border border-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                    >
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="pt">Português</option>
                    </select>
                </div>
                <p className="text-sm text-gray-400 mt-2">{t('settings.appearance.languageDescription')}</p>
            </div>
             <div className="border-t border-brand-primary pt-4 flex items-center gap-4">
                <Button onClick={handleSaveChanges} disabled={isSaved}>
                    {isSaved ? <span className="flex items-center gap-2"><CheckIcon className="w-5 h-5"/> {t('settings.saved')}</span> : t('settings.saveChanges')}
                </Button>
                {!isSaved && (
                    <Button variant="secondary" onClick={handleCancelChanges}>
                        {t('settings.cancel')}
                    </Button>
                )}
            </div>
        </div>
      </Card>
      
      <Card title={t('settings.url.title')}>
        <div className="space-y-4">
          <div>
            <label htmlFor="base-url" className="block text-lg font-medium text-brand-accent mb-1">{t('settings.url.label')}</label>
            <input
              type="text"
              id="base-url"
              value={localSettings.baseUrl || ''}
              onChange={(e) => handleSettingsChange({ baseUrl: e.target.value })}
              className="w-full p-2 rounded bg-brand-primary border border-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-secondary"
              placeholder="https://your-restaurant-url.com"
            />
             <div className="mt-2 p-3 bg-blue-500/10 text-blue-300 text-sm rounded-lg border border-blue-500/30">
                <p><strong>{t('settings.url.warningTitle')}</strong></p>
                <p className="mt-1" dangerouslySetInnerHTML={{ __html: t('settings.url.warningDescription1') }} />
                <p className="mt-1">{t('settings.url.warningDescription2')}</p>
            </div>
          </div>
        </div>
      </Card>

      <Card title={t('settings.menu.title')} titleExtra={<Button onClick={() => setIsAddMenuItemModalOpen(true)}>{t('settings.menu.addItem')}</Button>}>
        <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
            {menuItems.map(item => (
                <div key={item.id} className="flex justify-between items-center p-2 bg-brand-primary/50 rounded">
                    <div className="flex items-center gap-4">
                        <div className="relative group shrink-0">
                            <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded"/>
                            <label className="absolute inset-0 bg-black/60 flex items-center justify-center text-xs font-semibold text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded">
                                {t('settings.menu.changeImage')}
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

      <Card title={t('settings.tables.title')} titleExtra={<Button onClick={() => setIsAddTableModalOpen(true)}>{t('settings.tables.addTable')}</Button>}>
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
                      <span className="text-gray-400 text-sm">{t('settings.tables.seats')}</span>
                      <button
                          onClick={() => {
                              if (window.confirm(t('settings.tables.deleteConfirm', {tableName: table.name}))) {
                                  onDeleteTable(table.id);
                              }
                          }}
                          disabled={table.status !== 'available'}
                          title={table.status !== 'available' ? t('settings.tables.deleteDisabled') : t('settings.tables.delete')}
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
        <Card title={t('settings.data.title')}>
            <div className="space-y-6">
                <div className="p-4 bg-purple-900/30 border border-purple-500/50 rounded-lg">
                    <h3 className="font-bold text-purple-300 text-lg">{t('settings.data.exportTitle')}</h3>
                    <p className="text-sm text-purple-200 mt-1 mb-4">{t('settings.data.exportDescription')}</p>
                    <div className="flex gap-4">
                        <Button onClick={() => handleExport('json')} disabled={isExporting}>
                            {isExporting ? t('settings.data.exporting') : t('settings.data.exportJson')}
                        </Button>
                        <Button onClick={() => handleExport('sql')} disabled={isExporting}>
                            {isExporting ? t('settings.data.exporting') : t('settings.data.exportSql')}
                        </Button>
                    </div>
                </div>

                <div className="p-4 bg-red-900/30 border border-red-500/50 rounded-lg">
                    <h3 className="font-bold text-red-300 text-lg">{t('settings.data.resetTitle')}</h3>
                    <p className="text-sm text-red-200 mt-1 mb-4">{t('settings.data.resetDescription')}</p>
                    <Button variant="danger" onClick={handleResetDatabase}>
                        {t('settings.data.resetButton')}
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