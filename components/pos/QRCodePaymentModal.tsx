import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface QRCodePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  onConfirmPayment: () => void;
}

const QRCodePaymentModal: React.FC<QRCodePaymentModalProps> = ({ isOpen, onClose, totalAmount, onConfirmPayment }) => {
  if (!isOpen) return null;

  const qrData = encodeURIComponent(`upi://pay?pa=your-business-upi@oksbi&pn=BarNest&am=${totalAmount.toFixed(2)}&cu=USD&tn=Payment for your order`);
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${qrData}&bgcolor=1a1a1a&color=f8f9fa&qzone=1`;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <Card title="Pay with QR Code" className="w-full max-w-sm bg-brand-dark">
        <div className="flex flex-col items-center text-center">
          <p className="text-lg text-gray-300">Scan the code below with your payment app</p>
          <div className="my-4 p-4 bg-brand-light rounded-lg">
            <img 
              src={qrCodeUrl}
              alt="Payment QR Code"
              width="250"
              height="250"
            />
          </div>
          <p className="text-3xl font-bold text-brand-secondary mb-6">
            Total: ${totalAmount.toFixed(2)}
          </p>

          <div className="w-full space-y-3">
            <Button 
                onClick={onConfirmPayment}
                variant="primary"
                className="w-full"
            >
                Simulate Customer Payment
            </Button>
            <p className="text-xs text-gray-500">
                In a real app, the system would wait for a webhook from the payment provider. This button simulates that process.
            </p>
          </div>
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

export default QRCodePaymentModal;
