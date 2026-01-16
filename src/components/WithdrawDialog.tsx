import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Smartphone, Building2, AlertCircle, Loader2 } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://mistery.pro';

interface WithdrawDialogProps {
  open: boolean;
  onClose: () => void;
  currentBalance: number;
  onSuccess: () => void;
  token: string;
}

export default function WithdrawDialog({
  open,
  onClose,
  currentBalance,
  onSuccess,
  token,
}: WithdrawDialogProps) {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('mvola');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const methods = [
    { value: 'mvola', label: 'MVola', icon: Smartphone, fees: 1300 },
    { value: 'orange_money', label: 'Orange Money', icon: Smartphone, fees: 1300 },
    { value: 'airtel_money', label: 'Airtel Money', icon: Smartphone, fees: 1300 },
    { value: 'bank_transfer', label: 'Virement bancaire', icon: Building2, fees: 0 },
  ];

  const selectedMethod = methods.find((m) => m.value === method);
  const amountNum = parseFloat(amount) || 0;
  const fees = selectedMethod?.fees || 0;
  const amountReceived = amountNum - fees;

  const handleSubmit = async () => {
    try {
      setError('');
      setLoading(true);

      if (amountNum < 10000) {
        setError('Le montant minimum est de 10 000 Ar');
        return;
      }

      if (amountNum > currentBalance) {
        setError('Solde insuffisant');
        return;
      }

      if (!phoneNumber && method !== 'bank_transfer') {
        setError('Numéro de téléphone requis');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/wallet/withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: amountNum,
          method,
          phoneNumber,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors de la demande');
      }

      // Succès
      onSuccess();
      onClose();
      
      // Reset
      setAmount('');
      setPhoneNumber('');
      setError('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('mg-MG', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value) + ' Ar';
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Demander un retrait</DialogTitle>
          <DialogDescription>
            Solde disponible: <span className="font-bold text-purple-600">{formatCurrency(currentBalance)}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Montant */}
          <div className="space-y-2">
            <Label htmlFor="amount">Montant à retirer</Label>
            <Input
              id="amount"
              type="number"
              placeholder="10000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min={10000}
              max={currentBalance}
            />
            <p className="text-xs text-muted-foreground">
              Minimum: 10 000 Ar
            </p>
          </div>

          {/* Méthode */}
          <div className="space-y-3">
            <Label>Méthode de retrait</Label>
            <RadioGroup value={method} onValueChange={setMethod}>
              {methods.map((m) => (
                <div
                  key={m.value}
                  className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-accent"
                  onClick={() => setMethod(m.value)}
                >
                  <RadioGroupItem value={m.value} id={m.value} />
                  <Label htmlFor={m.value} className="flex items-center gap-2 cursor-pointer flex-1">
                    <m.icon className="w-4 h-4" />
                    <span>{m.label}</span>
                    {m.fees > 0 && (
                      <span className="ml-auto text-xs text-muted-foreground">
                        Frais: {formatCurrency(m.fees)}
                      </span>
                    )}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Numéro de téléphone */}
          {method !== 'bank_transfer' && (
            <div className="space-y-2">
              <Label htmlFor="phone">Numéro de téléphone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="034 00 000 00"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
          )}

          {/* Récapitulatif */}
          {amountNum >= 10000 && (
            <Alert className="bg-purple-50 border-purple-200">
              <AlertCircle className="h-4 w-4 text-purple-600" />
              <AlertDescription className="text-sm">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Montant demandé:</span>
                    <span className="font-bold">{formatCurrency(amountNum)}</span>
                  </div>
                  {fees > 0 && (
                    <div className="flex justify-between text-muted-foreground">
                      <span>Frais de transfert:</span>
                      <span>- {formatCurrency(fees)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-green-700 font-bold border-t pt-1">
                    <span>Vous recevrez:</span>
                    <span>{formatCurrency(amountReceived)}</span>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Erreur */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Info */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Les demandes de retrait sont traitées dans un délai de 2 à 5 jours ouvrables.
              Les frais de transfert sont déduits du montant à retirer.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={loading || amountNum < 10000}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Envoi...
              </>
            ) : (
              'Confirmer'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
