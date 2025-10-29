import React, { useState, useRef, useEffect, useMemo } from 'react';
import type { Table, StaffMember, OrderItem, FloorPlanArea, AppSettings } from '../../types';
import ServerAssignmentModal from './ServerAssignmentModal';
import TableQRCodeModal from './TableQRCodeModal';

interface FloorPlanProps {
  tables: Table[];
  onTableSelect: (table: Table) => void;
  readyTables: Set<string>;
  currentUser: StaffMember;
  onUpdateTable: (tableId: number, updatedData: Partial<Omit<Table, 'id'>>) => void;
  staffMembers: StaffMember[];
  onAssignServer: (tableId: number, serverName: string) => void;
  tableOrders: Record<number, OrderItem[]>;
  floorPlanAreas: FloorPlanArea[];
  settings: AppSettings;
}

const TableComponent: React.FC<{ 
  table: Table; 
  isReady: boolean;
  onClick: () => void;
}> = ({ table, isReady, onClick }) => {
  const statusClasses = {
    available: 'bg-green-500/20 border-green-500',
    occupied: 'bg-yellow-500/20 border-yellow-500',
    reserved: 'bg-blue-500/20 border-blue-500',
  };

  return (
    <div
      onClick={onClick}
      className={`absolute w-24 h-24 flex flex-col items-center justify-center rounded-lg border-2 cursor-pointer transition-all hover:scale-105 shadow-lg ${statusClasses[table.status]} ${isReady ? 'animate-pulse ring-4 ring-brand-secondary' : ''}`}
      style={{ left: `${table.x}px`, top: `${table.y}px` }}
      title={isReady ? `Order for ${table.name} is ready!` : `Table ${table.name}`}
    >
      <span className="font-bold text-lg">{table.name}</span>
      <span className="text-sm text-gray-400">{table.seats} seats</span>
      {table.server && <span className="text-xs text-brand-accent mt-1">{table.server}</span>}
    </div>
  );
};

export const FloorPlan: React.FC<FloorPlanProps> = ({
  tables,
  onTableSelect,
  readyTables,
  currentUser,
  onUpdateTable,
  staffMembers,
  onAssignServer,
  tableOrders,
  floorPlanAreas,
  settings,
}) => {
  const [activeAreaId, setActiveAreaId] = useState<string>(floorPlanAreas[0]?.id || '');
  const [selectedTableForModal, setSelectedTableForModal] = useState<Table | null>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  useEffect(() => {
    if (floorPlanAreas.length > 0 && !floorPlanAreas.find(a => a.id === activeAreaId)) {
        setActiveAreaId(floorPlanAreas[0].id);
    }
  }, [floorPlanAreas, activeAreaId]);
  
  const tablesInArea = useMemo(() => tables.filter(t => t.floorPlanId === activeAreaId), [tables, activeAreaId]);

  const handleTableClick = (table: Table) => {
    if (currentUser.role === 'Server' || currentUser.role === 'Manager' || (currentUser.role === 'Bartender' && table.floorPlanId === 'bar')) {
        if (table.status === 'occupied' || table.status === 'reserved') {
            setSelectedTableForModal(table);
        } else {
            onTableSelect(table);
        }
    }
  };

  const handleGoToPos = () => {
    if(selectedTableForModal) {
        onTableSelect(selectedTableForModal);
    }
    setSelectedTableForModal(null);
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex border-b border-brand-primary mb-4">
        {floorPlanAreas.map(area => (
          <button
            key={area.id}
            onClick={() => setActiveAreaId(area.id)}
            className={`py-2 px-4 font-semibold ${activeAreaId === area.id ? 'text-brand-secondary border-b-2 border-brand-secondary' : 'text-gray-400'}`}
          >
            {area.name}
          </button>
        ))}
      </div>
      <div className="relative flex-1 bg-brand-dark/20 rounded-lg overflow-auto p-4">
          {tablesInArea.map(table => (
              <TableComponent 
                  key={table.id}
                  table={table}
                  isReady={readyTables.has(table.name)}
                  onClick={() => handleTableClick(table)}
              />
          ))}
      </div>

      {selectedTableForModal && (
        <ServerAssignmentModal
            isOpen={!!selectedTableForModal}
            onClose={() => setSelectedTableForModal(null)}
            onAssign={onAssignServer}
            table={selectedTableForModal}
            servers={staffMembers}
            order={tableOrders[selectedTableForModal.id] || []}
            onGoToPos={handleGoToPos}
            onShowQrCode={() => setIsQrModalOpen(true)}
            currentUser={currentUser}
        />
      )}
      
      {isQrModalOpen && selectedTableForModal && (
          <TableQRCodeModal 
            isOpen={isQrModalOpen}
            onClose={() => setIsQrModalOpen(false)}
            table={selectedTableForModal}
            settings={settings}
          />
      )}
    </div>
  );
};
