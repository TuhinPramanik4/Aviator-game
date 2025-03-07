import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function AviatorGame() {
  const [multiplier, setMultiplier] = useState(1.0);
  const [isFlying, setIsFlying] = useState(false);
  const [crashed, setCrashed] = useState(false);
  const [cashOutAmount, setCashOutAmount] = useState(null);
  const [betPlaced, setBetPlaced] = useState(false);

  useEffect(() => {
    let interval;
    if (isFlying) {
      interval = setInterval(() => {
        setMultiplier((prev) => prev + 0.1);
      }, 500);

      const crashTime = Math.random() * 5000 + 2000;
      setTimeout(() => {
        setIsFlying(false);
        setCrashed(true);
      }, crashTime);
    }
    return () => clearInterval(interval);
  }, [isFlying]);

  const startGame = () => {
    setMultiplier(1.0);
    setIsFlying(true);
    setCrashed(false);
    setCashOutAmount(null);
    setBetPlaced(true);
  };

  const cashOut = () => {
    setCashOutAmount(multiplier);
    setIsFlying(false);
  };

  return (
    <div className="flex flex-col items-center p-6 space-y-4">
      <h1 className="text-2xl font-bold">Aviator Game</h1>
      <motion.div
        animate={{ x: isFlying ? multiplier * 50 : 0 }}
        className="w-10 h-10 bg-red-500 rounded-full"
      />
      <p className="text-lg font-semibold">Multiplier: {multiplier.toFixed(2)}x</p>
      {crashed && <p className="text-red-600">Crashed!</p>}
      {cashOutAmount && <p className="text-green-600">Cashed Out: {cashOutAmount.toFixed(2)}x</p>}
      <div className="space-x-2">
        {!isFlying && !betPlaced && <Button onClick={startGame}>Place Bet</Button>}
        {isFlying && <Button onClick={cashOut}>Cash Out</Button>}
      </div>
    </div>
  );
}
