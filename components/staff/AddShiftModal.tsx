
import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import type { StaffMember, Shift } from '../../types';

interface AddShiftModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddShift: (startTime: string, endTime: string) => void;
    staff: StaffMember;
    day: Shift['day'];
}

const AddShiftModal: React.FC<AddShiftModalProps> = ({ isOpen, onClose, onAddShift, staff, day }) => {
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('17:00');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!startTime || !endTime) {
            setError('Please set a start and end time.');
            return;
        }
        
        const isOvernight = (endTime.split(':')[0] < startTime.split(':')[0]) || (endTime === "00:00" && startTime !== "00:00");
        
        if (startTime === endTime) {
             setError('Start and end time cannot be the same.');
             return;
        }
        if (startTime > endTime && !isOvernight) {
             setError('End time must be after start time for non-overnight shifts.');
             return;
        }

        onAddShift(startTime, endTime);
        onClose();
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <Card title={`Add Shift for ${staff.name}`} className="w-full max-w-md">
                <p className="text-lg font-semibold text-brand-accent mb-4">On {day}</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="start-time" className="block text-sm font-medium text-gray-300 mb-1">Start Time</label>
                            <input
                                type="time"
                                id="start-time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="w-full p-2 rounded bg-brand-primary border border-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="end-time" className="block text-sm font-medium text-gray-300 mb-1">End Time</label>
                            <input
                                type="time"
                                id="end-time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className="w-full p-2 rounded bg-brand-primary border border-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                                required
                            />
                        </div>
                    </div>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <div className="flex gap-2 pt-4 border-t border-brand-primary">
                        <Button variant="secondary" type="button" onClick={onClose} className="flex-1">Cancel</Button>
                        <Button variant="primary" type="submit" className="flex-1">Add Shift</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default AddShiftModal;
