// src/components/WalletConnectionPopup.tsx
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface WalletConnectionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (onConnectSuccess: () => void) => void; // Modify onConnect prop to accept callback
}

export const WalletConnectionPopup: React.FC<WalletConnectionPopupProps> = ({
  isOpen,
  onClose,
  onConnect,
}) => {
  if (!isOpen) {
    return null;
  }

  const handleConnect = () => {
    console.log("WalletConnectionPopup: handleConnect called"); // ADDED LOG
    onConnect(() => { // Call onConnect with a success callback
      console.log("WalletConnectionPopup: onConnect callback executed (onConnectSuccess from DiraContext)"); // ADDED LOG
      onClose(); // Close the popup after successful connection
      console.log("WalletConnectionPopup: onClose called after onConnect success callback"); // ADDED LOG
    });
    onClose(); // Close the popup after successful connection
  };

  const handleCancel = () => {
    console.log("WalletConnectionPopup: handleCancel called"); // ADDED LOG
    onClose();
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75">
      <Card className="bg-gray-800 text-white">
        <CardHeader>
          <CardTitle>Connect Wallet</CardTitle>
          <CardDescription>
            You need to connect your Keplr wallet to perform this action.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center space-x-4">
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleConnect}>Connect Wallet</Button>
        </CardContent>
      </Card>
    </div>
  );
};