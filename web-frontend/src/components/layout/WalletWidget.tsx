import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { AnimatePresence, motion } from "framer-motion";
import { Wallet, Eye, EyeOff, Plus, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

export const WalletWidget = () => {
  // const { user, addBalance, isBalanceVisible, toggleBalanceVisibility } = useApp();
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible);
  };
  const [showAddBalance, setShowAddBalance] = useState(false);
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const user = { balance: 150.75 };
  if (!user) return null;

  const handleAddBalance = async () => {
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) {
      toast.error('Digite um valor válido');
      return;
    }

    setIsProcessing(true);
    
    // Animate balance addition
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // addBalance(value);
    toast.success(`€${value.toFixed(2)} adicionados à carteira`, {
      icon: '💰',
    });
    
    setAmount('');
    setShowAddBalance(false);
    setIsProcessing(false);
  };

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center">
            <Wallet className="w-5 h-5 text-black" />
          </div>
          <div>
            <p className="text-sm text-black/60">Carteira</p>
            <p className="text-xs text-[#10B981]">Saldo Disponível</p>
          </div>
        </div>
        
        <motion.button
          onClick={toggleBalanceVisibility}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isBalanceVisible ? (
            <Eye className="w-4 h-4 text-black/60" />
          ) : (
            <EyeOff className="w-4 h-4 text-black/60" />
          )}
        </motion.button>
      </div>

      {/* Balance Display */}
      <div className="py-4">
        <AnimatePresence mode="wait">
          {isBalanceVisible ? (
            <motion.div
              key="visible"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-1"
            >
              <div className="flex items-baseline gap-1">
                <span className="text-sm text-black/60">€</span>
                <motion.span
                  key={user.balance}
                  initial={{ scale: 1.2, color: '#10B981' }}
                  animate={{ scale: 1, color: '#FFFFFF' }}
                  className="text-4xl font-bold text-black"
                >
                  {user.balance.toFixed(2)}
                </motion.span>
              </div>
              <div className="flex items-center gap-1 text-xs text-[#10B981]">
                <TrendingUp className="w-3 h-3" />
                <span>+12.5% este mês</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="hidden"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-4xl font-bold text-black"
            >
              ••••••
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Add Balance Section */}
      <AnimatePresence>
        {showAddBalance ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3 pt-4 border-t border-white/10"
          >
            <Input
              type="number"
              placeholder="Valor"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-white/5 border-white/10 text-black placeholder:text-black/40"
              disabled={isProcessing}
            />
            <div className="flex gap-2">
              <Button
                onClick={handleAddBalance}
                disabled={isProcessing}
                className="flex-1 bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-black border-0"
              >
                {isProcessing ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    💫
                  </motion.div>
                ) : (
                  'Adicionar'
                )}
              </Button>
              <Button
                onClick={() => setShowAddBalance(false)}
                variant="ghost"
                className="text-black/60 hover:text-black hover:bg-white/5"
                disabled={isProcessing}
              >
                Cancelar
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div whileTap={{ scale: 0.98 }}>
            <Button
              onClick={() => setShowAddBalance(true)}
              className="w-full bg-white/5 hover:bg-white/10 text-black border border-white/10"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Saldo
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
        <div className="text-center">
          <p className="text-xs text-black/60">Este Mês</p>
          <p className="text-lg font-bold text-black">€420</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-black/60">Transações</p>
          <p className="text-lg font-bold text-black">18</p>
        </div>
      </div>
    </div>
  );
};
