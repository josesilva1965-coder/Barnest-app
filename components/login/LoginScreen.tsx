
import React, { useState } from 'react';
import type { StaffMember } from '../../types';
import { STAFF_DATA } from '../../constants';
import { UserIcon } from '../icons/Icons';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { useLocalization } from '../../contexts/LocalizationContext';

interface LoginScreenProps {
  onLogin: (staff: StaffMember) => void;
  onGoToCustomerReservations: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onGoToCustomerReservations }) => {
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { t } = useLocalization();

  const handleLoginAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedStaff) return;

    // NOTE: This is placeholder logic for demonstration.
    // In a real production app, this must be replaced with a secure backend authentication system.
    const correctPassword = selectedStaff.role === 'Manager' ? 'admin' : '1234';

    if (password === correctPassword) {
      onLogin(selectedStaff);
    } else {
      setError(t('login.incorrectPassword'));
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
                  <label htmlFor="password-input" className="sr-only">{t('login.password')}</label>
                  <input
                    id="password-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 rounded bg-brand-primary border border-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-secondary text-center text-lg"
                    placeholder={t('login.enterPassword')}
                    autoFocus
                    required
                  />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button type="submit" variant="primary" className="w-full py-3">{t('login.login')}</Button>
              </form>
              <button onClick={handleBack} className="mt-4 text-gray-400 hover:text-white text-sm focus:outline-none focus:text-white focus:underline">
                {t('login.notUser', { name: selectedStaff.name })}
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
      <h2 className="text-xl text-gray-400 mb-12">{t('login.selectProfile')}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {STAFF_DATA.map(staff => (
          <button
            key={staff.id}
            type="button"
            onClick={() => handleSelectStaff(staff)}
            className="group w-full h-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary rounded-lg hover:scale-105 transition-transform duration-200"
            aria-label={`Login as ${staff.name}`}
          >
            <Card
              className="flex flex-col items-center p-6 text-center h-full group-hover:border-brand-secondary pointer-events-none"
            >
              <UserIcon className="w-16 h-16 text-brand-secondary mb-4" />
              <p className="font-bold text-lg text-brand-light">{staff.name}</p>
              <p className="text-sm text-gray-400">{staff.role}</p>
            </Card>
          </button>
        ))}
      </div>
      <div className="mt-12 text-center">
        <button
            onClick={onGoToCustomerReservations}
            className="bg-transparent border-none px-4 py-2 cursor-pointer text-brand-secondary hover:text-orange-400 font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-brand-secondary rounded"
        >
            {t('login.customerReservation')}
        </button>
    </div>
    </div>
  );
};

export default LoginScreen;