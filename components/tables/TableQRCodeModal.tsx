import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Table } from '../../types';

interface TableQRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  table: Table;
}

const TableQRCodeModal: React.FC<TableQRCodeModalProps> = ({ isOpen, onClose, table }) => {
  if (!isOpen) return null;

  const orderUrl = `${window.location.origin}${window.location.pathname}?table=${table.id}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(orderUrl)}&bgcolor=1a1a1a&color=f8f9fa&qzone=1`;

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.write(`
            <html>
                <head>
                    <title>Print QR Code for ${table.name}</title>
                    <style>
                        body { font-family: sans-serif; text-align: center; margin: 40px; }
                        img { max-width: 100%; }
                        h1 { font-size: 24px; }
                        p { font-size: 16px; }
                    </style>
                </head>
                <body>
                    <h1>Order at Table: ${table.name}</h1>
                    <p>Scan this code to view the menu and place your order.</p>
                    <img src="${qrCodeUrl}" alt="QR Code for table ${table.name}" />
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        // Give image time to load before printing
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <Card title={`Customer QR Code for ${table.name}`} className="w-full max-w-sm bg-brand-dark">
        <div className="flex flex-col items-center text-center">
          <p className="text-lg text-gray-300">
            Customers can scan this code to order from their table.
          </p>
          <div className="my-4 p-4 bg-brand-light rounded-lg">
            <img 
              src={qrCodeUrl}
              alt={`QR Code for ${table.name}`}
              width="250"
              height="250"
            />
          </div>
          <div className="w-full space-y-3">
             <Button 
                onClick={handlePrint}
                variant="primary"
                className="w-full"
            >
                Print
            </Button>
          </div>
        </div>
        <div className="mt-6 border-t border-brand-primary pt-4">
          <Button variant="secondary" onClick={onClose} className="w-full">
            Done
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default TableQRCodeModal;