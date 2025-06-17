import { useState } from 'react';
import QrReader from 'react-qr-scanner';

interface IQRScannerProps {
  setInputValue: (value: string) => void;
  isCameraOpen: boolean;
  setIsCameraOpen: (value: boolean) => void;
  inputValue: string;
}

export const QRScanner = ({
  setInputValue,
  isCameraOpen,
  setIsCameraOpen,
  inputValue,
}: IQRScannerProps) => {
  const [delay] = useState(0);

  const handleScan = (data: { text: string } | null) => {
    if (data && isCameraOpen) {
      const cleanAddress = data.text.split(':').pop() || '';
      if (cleanAddress !== inputValue) {
        setInputValue(cleanAddress);
        setIsCameraOpen(false);
      }
    }
  };

  const handleError = (error: Error) => {
    console.error('QR Scanner Error:', error);
  };

  return (
    <div className="relative w-full">
      {isCameraOpen && (
        <div className="mt-4 relative">
          <QrReader
            delay={delay}
            onScan={handleScan}
            onError={handleError}
            style={{ width: '100%' }}
            constraints={
              {
                video: {
                  facingMode: 'environment',
                },
              } as any
            }
          />
        </div>
      )}
    </div>
  );
};
