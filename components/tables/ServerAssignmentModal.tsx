import React, { useState } from 'react';
import { Table, StaffMember, OrderItem } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { PosIcon, QrCodeIcon } from '../icons/Icons';

interface ServerAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (tableId: number, serverName: string) => void;
  table: Table;
  servers: StaffMember[];
  order: OrderItem[];
  onGoToPos: () => void;
  onShowQrCode: () => void;
  currentUser: StaffMember;
}

const ServerAssignmentModal: React.FC<ServerAssignmentModalProps> = ({
  isOpen,
  onClose,
  onAssign,
  table,
  servers,
  order,
  onGoToPos,
  onShowQrCode,
  currentUser,
}) => {
  const [selectedServer, setSelectedServer] = useState(table.server || '');

  const handleAssign = () => {
    onAssign(table.id, selectedServer);
  };
  
  const serverList = servers.filter(s => s.role === 'Server');

  const calculateTotal = (items: OrderItem[]) => {
    return items.reduce((acc, item) => {
        const itemPrice = item.price + item.modifiers.reduce((modAcc, mod) => modAcc + mod.priceChange, 0);
        return acc + itemPrice * item.quantity;
    }, 0);
  };

  if (!isOpen) return null;

  const isManager = currentUser.role === 'Manager';
  const isBartenderAtBar = currentUser.role === 'Bartender' && table.floorPlanId === 'bar';

  const modalTitle = isBartenderAtBar ? `Tab for ${table.name}` : `Table Details: ${table.name}`;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <Card title={modalTitle} className="w-full max-w-md">
        <div className="space-y-4">
          {isManager && (
            <div>
              <label htmlFor="server-select" className="block text-sm font-medium text-gray-300 mb-1">
                Assigned Server
              </label>
              <div className="flex gap-2">
                  <select
                    id="server-select"
                    value={selectedServer}
                    onChange={(e) => setSelectedServer(e.target.value)}
                    className="w-full p-2 rounded bg-brand-primary border border-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                  >
                    <option value="">Unassigned</option>
                    {serverList.map((server) => (
                      <option key={server.id} value={server.name}>
                        {server.name}
                      </option>
                    ))}
                  </select>
                  <Button onClick={handleAssign} disabled={selectedServer === (table.server || '')}>
                    {table.server && selectedServer !== table.server ? 'Change' : table.server ? 'Saved' : 'Assign'}
                  </Button>
              </div>
            </div>
          )}
          
          {table.status === 'occupied' && order.length > 0 && (
            <div className={`${isManager ? 'border-t border-brand-primary pt-4' : ''}`}>
              <h3 className="font-bold text-lg text-brand-accent mb-2">Current Order</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2 bg-brand-primary/20 p-2 rounded-md">
                {order.map(item => (
                  <div key={item.instanceId} className="flex justify-between items-start text-sm">
                    <div>
                      <p><span className="font-semibold">{item.quantity}x</span> {item.name}</p>
                      {item.modifiers.length > 0 && (
                        <div className="text-xs text-gray-400 pl-4">
                          {item.modifiers.map(mod => <p key={mod.name}>+ {mod.name}</p>)}
                        </div>
                      )}
                    </div>
                    <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-between font-bold text-lg mt-2 border-t border-brand-primary/50 pt-2">
                  <span>Subtotal:</span>
                  <span>${calculateTotal(order).toFixed(2)}</span>
              </div>
            </div>
          )}

           {table.status === 'occupied' && order.length === 0 && (
            <div className="border-t border-brand-primary pt-4 text-center text-gray-400">
                Table is occupied but no items have been sent yet.
            </div>
          )}

          <div className="flex flex-col gap-2 pt-4 border-t border-brand-primary">
             {isManager && (
                <Button onClick={onShowQrCode} className="bg-gray-700 hover:bg-gray-600 focus:ring-gray-500 flex items-center justify-center gap-2">
                   <QrCodeIcon className="w-5 h-5"/> Customer QR Code
                </Button>
             )}
             <Button 
                variant="primary" 
                onClick={onGoToPos} 
                className="flex items-center justify-center gap-2"
            >
              <PosIcon className="w-5 h-5" />
              {isBartenderAtBar ? 'Add to Tab / Payment' : 'Go to POS'}
            </Button>
            <Button variant="secondary" onClick={onClose} className="flex-1">
              Close
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ServerAssignmentModal;