import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Table, FloorPlanArea } from '../../types';

interface AddTableModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddTable: (tableData: Omit<Table, 'id' | 'status' | 'floorPlanId'>, floorPlanId: string) => void;
    floorPlanAreas: FloorPlanArea[];
}

const AddTableModal: React.FC<AddTableModalProps> = ({ isOpen, onClose, onAddTable, floorPlanAreas }) => {
    const [name, setName] = useState('');
    const [seats, setSeats] = useState('');
    const [selectedPlanId, setSelectedPlanId] = useState<string>(floorPlanAreas[0]?.id || '');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const numSeats = parseInt(seats, 10);

        if (!name.trim() || !seats || isNaN(numSeats) || numSeats <= 0 || !selectedPlanId) {
            setError('Please provide a valid table name, number of seats, and select a floor plan.');
            return;
        }

        onAddTable({
            name,
            seats: numSeats,
        }, selectedPlanId);
        
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <Card title="Add New Table" className="w-full max-w-sm">
                <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                        <label htmlFor="tableName" className="block text-sm font-medium text-gray-300 mb-1">Table Name</label>
                        <input
                            type="text"
                            id="tableName"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 rounded bg-brand-primary border border-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                            placeholder="e.g., T9 or Patio 3"
                            required
                        />
                    </div>
                     <div>
                        <label htmlFor="tableSeats" className="block text-sm font-medium text-gray-300 mb-1">Seating Capacity</label>
                        <input
                            type="number"
                            id="tableSeats"
                            value={seats}
                            onChange={(e) => setSeats(e.target.value)}
                            className="w-full p-2 rounded bg-brand-primary border border-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                            min="1"
                            placeholder="e.g., 4"
                            required
                        />
                    </div>
                     <div>
                        <label htmlFor="floorPlanSelect" className="block text-sm font-medium text-gray-300 mb-1">Floor Plan Area</label>
                        <select
                            id="floorPlanSelect"
                            value={selectedPlanId}
                            onChange={(e) => setSelectedPlanId(e.target.value)}
                            className="w-full p-2 rounded bg-brand-primary border border-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                            required
                        >
                            <option value="" disabled>Select an area</option>
                            {floorPlanAreas.map(area => (
                                <option key={area.id} value={area.id}>{area.name}</option>
                            ))}
                        </select>
                    </div>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <div className="flex gap-2 pt-4 border-t border-brand-primary">
                        <Button variant="secondary" type="button" onClick={onClose} className="flex-1">Cancel</Button>
                        <Button variant="primary" type="submit" className="flex-1">Add Table</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default AddTableModal;