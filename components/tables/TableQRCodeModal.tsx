
import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Table, AppSettings } from '../../types';
import { ClipboardIcon, CheckIcon } from '../icons/Icons';

interface TableQRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  table: Table;
  settings: AppSettings;
}

const TableQRCodeModal: React.FC<TableQRCodeModalProps> = ({ isOpen, onClose, table, settings }) => {
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  const baseUrlSetting = settings.baseUrl?.trim();
  const hasValidBaseUrlSetting = baseUrlSetting && baseUrlSetting.startsWith('http');

  // A robust, simplified logic for generating the root URL.
  let rootUrl;
  if (hasValidBaseUrlSetting) {
    // Use the explicit URL from settings if available and valid.
    rootUrl = baseUrlSetting;
  } else {
    // Otherwise, derive it from the current window location by stripping query params and hash.
    rootUrl = window.location.href.split('?')[0].split('#')[0];
  }
  
  // Clean up common file names and trailing slashes to ensure a clean base URL.
  if (rootUrl.endsWith('/index.html')) {
      rootUrl = rootUrl.slice(0, -'/index.html'.length);
  }
  if (rootUrl.endsWith('/')) {
      rootUrl = rootUrl.slice(0, -1);
  }

  // The customer-facing URL should direct to the app with a hash-based query for the table ID.
  // Using `/#?` is a standard pattern for single-page applications.
  const orderUrl = `${rootUrl}/#?view=customer&table=${table.id}`;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(orderUrl)}&bgcolor=f8f9fa&color=1a1a1a&qzone=1`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(orderUrl).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    }).catch(err => {
        console.error('Failed to copy link: ', err);
        alert('Failed to copy link.');
    });
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.write(`
            <html>
                <head>
                    <title>Print QR Code for ${table.name}</title>
                    <style>
                        body { font-family: sans-serif; text-align: center; margin: 40px; }
                        img { max-width: 100%; border: 1px solid #ccc; padding: 10px; }
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

          {!hasValidBaseUrlSetting && (
            <div className="mt-4 p-3 bg-yellow-500/20 text-yellow-300 text-sm rounded-lg border border-yellow-500">
              <strong>Warning:</strong> The public URL for this app is not set. This QR code may not work for customers. A manager should set the 'Base URL' in the Settings menu.
            </div>
          )}

          <div className="my-4 p-4 bg-brand-light rounded-lg">
            <img 
              src={qrCodeUrl}
              alt={`QR Code for ${table.name}`}
              width="250"
              height="250"
            />
          </div>
          <div className="w-full grid grid-cols-2 gap-3">
             <Button 
                onClick={handlePrint}
                variant="primary"
                className="w-full"
            >
                Print
            </Button>
            <Button 
                onClick={handleCopyLink}
                variant="secondary"
                className="w-full flex items-center justify-center gap-2"
            >
                {isCopied ? (
                    <>
                        <CheckIcon className="w-5 h-5" /> Copied!
                    </>
                ) : (
                    <>
                        <ClipboardIcon className="w-5 h-5" /> Copy Link
                    </>
                )}
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
