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
  onConnect: () => void;
}

export const WalletConnectionPopup: React.FC<WalletConnectionPopupProps> = ({
  isOpen,
  onClose,
  onConnect,
}) => {
  if (!isOpen) return null;

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
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onConnect}>Connect Wallet</Button>
        </CardContent>
      </Card>
    </div>
  );
};