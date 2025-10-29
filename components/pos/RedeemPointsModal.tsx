
import React from 'react';
import type { Customer, Reward } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { StarIcon } from '../icons/Icons';

interface RedeemPointsModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer;
  rewards: Reward[];
  onRedeem: (reward: Reward) => void;
}

const RedeemPointsModal: React.FC<RedeemPointsModalProps> = ({ isOpen, onClose, customer, rewards, onRedeem }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <Card title="Redeem Loyalty Points" className="w-full max-w-md bg-brand-dark">
        <div className="text-center mb-6">
          <p className="text-lg text-gray-300">{customer.name}'s Balance</p>
          <div className="flex items-center justify-center gap-2 mt-1">
            <StarIcon className="w-8 h-8 text-yellow-400" />
            <span className="text-4xl font-bold text-white">{customer.loyaltyPoints}</span>
          </div>
        </div>
        
        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
            <h3 className="font-bold text-brand-accent">Available Rewards</h3>
            {rewards.map(reward => {
                const canAfford = customer.loyaltyPoints >= reward.pointsCost;
                return (
                    <div 
                        key={reward.id} 
                        className={`p-3 rounded-lg flex items-center justify-between ${canAfford ? 'bg-brand-primary/50' : 'bg-brand-primary/20 opacity-60'}`}
                    >
                        <div>
                            <p className="font-semibold">{reward.name}</p>
                            <p className="text-sm text-gray-400">{reward.description}</p>
                        </div>
                        <Button 
                            onClick={() => onRedeem(reward)} 
                            disabled={!canAfford}
                            variant="primary"
                            className="text-sm px-3 py-1 shrink-0 ml-2"
                        >
                            {reward.pointsCost} pts
                        </Button>
                    </div>
                );
            })}
        </div>

        <div className="mt-6 border-t border-brand-primary pt-4">
          <Button variant="secondary" onClick={onClose} className="w-full">
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default RedeemPointsModal;
