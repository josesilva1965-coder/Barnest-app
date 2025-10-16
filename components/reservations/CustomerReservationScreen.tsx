
import React, { useState } from 'react';
import { Reservation } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { CheckIcon } from '../icons/Icons';

interface CustomerReservationScreenProps {
  onAddReservation: (newReservation: Omit<Reservation, 'id' | 'status'>) => void;
  onGoHome: () => void;
}

const CustomerReservationScreen: React.FC<CustomerReservationScreenProps> = ({ onAddReservation, onGoHome }) => {
  const [customerName, setCustomerName] = useState('');
  const [partySize, setPartySize] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('19:00');
  const [error, setError] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const numPartySize = parseInt(partySize, 10);

    if (!customerName.trim() || !partySize || isNaN(numPartySize) || numPartySize <= 0 || !date || !time) {
      setError('Please fill out all fields with valid information.');
      return;
    }

    onAddReservation({
      customerName,
      partySize: numPartySize,
      date,
      time,
    });
    
    setIsConfirmed(true);
  };

  if (isConfirmed) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-brand-dark p-4">
            <Card className="w-full max-w-md">
                <div className="text-center p-4 md:p-6">
                    <div className="w-20 h-20 bg-green-500/20 rounded-full mx-auto flex items-center justify-center mb-6">
                        <CheckIcon className="w-12 h-12 text-green-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-3">Reservation Confirmed!</h2>
                    <p className="text-lg text-gray-300 mb-6">
                        Thank you, <span className="font-bold text-brand-accent">{customerName}</span>! We look forward to seeing you.
                    </p>
                    <div className="bg-brand-primary/30 p-4 rounded-lg text-left space-y-3">
                        <div>
                            <p className="text-sm text-gray-400">Party Size</p>
                            <p className="font-semibold">{partySize}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Date & Time</p>
                            <p className="font-semibold">{new Date(date + 'T00:00:00Z').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at {time}</p>
                        </div>
                    </div>
                     <Button onClick={onGoHome} className="mt-8 w-full py-3">Done</Button>
                </div>
            </Card>
        </div>
      );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-brand-dark p-4">
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Book a Table</h1>
      <h2 className="text-xl text-gray-400 mb-8">at Bar<span className="text-brand-secondary">Nest</span></h2>
      <div className="w-full max-w-md">
        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="customerName" className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
              <input
                type="text"
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full p-2 rounded bg-brand-primary border border-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                placeholder="e.g., Jane Doe"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="partySize" className="block text-sm font-medium text-gray-300 mb-1">Party Size</label>
                <input
                  type="number"
                  id="partySize"
                  value={partySize}
                  onChange={(e) => setPartySize(e.target.value)}
                  className="w-full p-2 rounded bg-brand-primary border border-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                  min="1"
                  placeholder="e.g., 4"
                  required
                />
              </div>
               <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-300 mb-1">Time</label>
                <input
                  type="time"
                  id="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full p-2 rounded bg-brand-primary border border-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                  required
                />
              </div>
            </div>
             <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-1">Date</label>
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-2 rounded bg-brand-primary border border-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                  required
                />
              </div>
            <Button type="submit" className="w-full py-3">Book Now</Button>
            {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
             <div className="text-center mt-4">
                  <button type="button" onClick={onGoHome} className="bg-transparent border-none p-0 cursor-pointer text-sm text-gray-400 hover:text-white">
                    Are you staff? Login here
                  </button>
             </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CustomerReservationScreen;
