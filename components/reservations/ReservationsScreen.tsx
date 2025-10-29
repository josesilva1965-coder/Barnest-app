
import React, { useState, useMemo } from 'react';
import type { Reservation } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface ReservationsScreenProps {
  reservations: Reservation[];
  onAddReservation: (newReservation: Omit<Reservation, 'id' | 'status'>) => void;
}

const ReservationsScreen: React.FC<ReservationsScreenProps> = ({ reservations, onAddReservation }) => {
  const [customerName, setCustomerName] = useState('');
  const [partySize, setPartySize] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('19:00');
  const [error, setError] = useState('');

  const today = new Date();
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });

  const reservationsByDay = useMemo(() => {
    const grouped: { [key: string]: Reservation[] } = {};
    reservations.forEach(res => {
      const resDate = res.date;
      if (!grouped[resDate]) {
        grouped[resDate] = [];
      }
      grouped[resDate].push(res);
    });
    // Sort reservations within each day by time
    for (const dateKey in grouped) {
        grouped[dateKey].sort((a, b) => a.time.localeCompare(b.time));
    }
    return grouped;
  }, [reservations]);

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

    // Reset form
    setCustomerName('');
    setPartySize('');
    setDate(new Date().toISOString().split('T')[0]);
    setTime('19:00');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Reservations Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card title="Add New Reservation">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="customerName" className="block text-sm font-medium text-gray-300 mb-1">Customer Name</label>
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
              <Button type="submit" className="w-full">Add Reservation</Button>
              {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
            </form>
          </Card>
        </div>

        <div className="lg:col-span-2">
            <Card title="Upcoming Reservations (Next 7 Days)">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 max-h-[75vh] overflow-y-auto pr-2">
                    {weekDays.map(day => {
                        const dateKey = day.toISOString().split('T')[0];
                        const dayReservations = reservationsByDay[dateKey] || [];
                        const isToday = day.toDateString() === new Date().toDateString();

                        return (
                            <div key={dateKey} className={`p-3 rounded-lg ${isToday ? 'bg-brand-secondary/20 border border-brand-secondary' : 'bg-brand-primary/30'}`}>
                                <h4 className="font-bold text-center border-b border-brand-primary pb-2 mb-2">
                                    {day.toLocaleDateString('en-US', { weekday: 'short' })}
                                    <span className="block text-sm font-normal text-gray-400">
                                        {day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </span>
                                </h4>
                                <div className="space-y-2">
                                    {dayReservations.length > 0 ? (
                                        dayReservations.map(res => (
                                            <div key={res.id} className="bg-brand-dark/50 p-2 rounded text-sm">
                                                <p className="font-semibold">{res.customerName}</p>
                                                <p className="text-gray-300">
                                                    <span className="font-bold">{res.time}</span> - Party of {res.partySize}
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-center text-gray-500 text-sm pt-4">No reservations</p>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default ReservationsScreen;
