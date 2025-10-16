
import React, { useState } from 'react';
import { StaffMember } from '../../types';
import { STAFF_DATA } from '../../constants';
import { UserIcon } from '../icons/Icons';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface LoginScreenProps {
  onLogin: (staff: StaffMember) => void;
  onGoToCustomerReservations: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onGoToCustomerReservations }) => {
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLoginAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (selectedStaff && selectedStaff.password === password) {
      onLogin(selectedStaff);
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };
  
  const handleSelectStaff = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setError('');
    setPassword('');
  };

  const handleBack = () => {
    setSelectedStaff(null);
  };

  if (selectedStaff) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-brand-dark p-4">
        <div className="w-full max-w-sm">
          <Card>
            <div className="flex flex-col items-center text-center">
              <UserIcon className="w-20 h-20 text-brand-secondary mb-4" />
              <h1 className="text-2xl font-bold text-white">{selectedStaff.name}</h1>
              <p className="text-gray-400 mb-6">{selectedStaff.role}</p>
              
              <form onSubmit={handleLoginAttempt} className="w-full space-y-4">
                <div>
                  <label htmlFor="password-input" className="sr-only">Password</label>
                  <input
                    id="password-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 rounded bg-brand-primary border border-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-secondary text-center text-lg"
                    placeholder="Enter Password"
                    autoFocus
                    required
                  />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button type="submit" variant="primary" className="w-full py-3">Login</Button>
              </form>
              <button onClick={handleBack} className="mt-4 text-gray-400 hover:text-white text-sm">
                Not {selectedStaff.name}? Select a different profile.
              </button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-brand-dark p-4">
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Bar<span className="text-brand-secondary">Nest</span></h1>
      <h2 className="text-xl text-gray-400 mb-12">Select your profile to sign in</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {STAFF_DATA.map(staff => (
          <Card 
            key={staff.id}
            onClick={() => handleSelectStaff(staff)}
            className="flex flex-col items-center p-6 text-center cursor-pointer hover:border-brand-secondary hover:scale-105 transition-transform duration-200"
            aria-label={`Login as ${staff.name}`}
          >
            <UserIcon className="w-16 h-16 text-brand-secondary mb-4" />
            <p className="font-bold text-lg text-brand-light">{staff.name}</p>
            <p className="text-sm text-gray-400">{staff.role}</p>
          </Card>
        ))}
      </div>
      <div className="mt-12 text-center">
        <button
            onClick={onGoToCustomerReservations}
            className="bg-transparent border-none p-0 cursor-pointer text-brand-secondary hover:text-orange-400 font-semibold text-lg"
        >
            Are you a customer? Make a Reservation
        </button>
    </div>
    </div>
  );
};

export default LoginScreen;
