import { useState, useEffect } from "react";
import { LineChart, XAxis, YAxis, CartesianGrid, Scatter, Area, AreaChart, ResponsiveContainer } from "recharts";
import { Button } from "./Compontents/Button";

export default function AviatorGame() {
  const [betAmount, setBetAmount] = useState("");
  const [returnMultiplier, setReturnMultiplier] = useState(2.0);
  const [isFlying, setIsFlying] = useState(false);
  const [crashed, setCrashed] = useState(false);
  const [cashOutAmount, setCashOutAmount] = useState(null);
  const [graphData, setGraphData] = useState([{ time: 0, value: 1.0 }]);
  const [currentAmount, setCurrentAmount] = useState(1.0);

  useEffect(() => {
    setCurrentAmount(parseFloat(betAmount) || 1.0);
  }, [betAmount]);

  useEffect(() => {
    let interval;
    if (isFlying) {
      interval = setInterval(() => {
        setGraphData((data) => {
          const newAmount = data[data.length - 1].value + (0.03 * returnMultiplier * (parseFloat(betAmount) || 1.0));
          setCurrentAmount(newAmount);
          return [...data, { time: data.length, value: newAmount }];
        });
      }, 700);

      const crashTime = Math.random() * 5000 + 2000;
      setTimeout(() => {
        setIsFlying(false);
        if (!cashOutAmount) setCrashed(true);
      }, crashTime);
    }
    return () => clearInterval(interval);
  }, [isFlying, returnMultiplier, betAmount]);

  const startGame = () => {
    setGraphData([{ time: 0, value: parseFloat(betAmount) || 1.0 }]);
    setIsFlying(true);
    setCrashed(false);
    setCashOutAmount(null);
    setCurrentAmount(parseFloat(betAmount) || 1.0);
  };

  const cashOut = () => {
    const cashOutValue = graphData[graphData.length - 1].value;
    setCashOutAmount(cashOutValue);
    setIsFlying(false);
    setCrashed(false);
  };

  return (
    <div className="w-full min-h-screen bg-purple-800 flex flex-col items-center justify-center p-4 sm:p-6 space-y-6 text-white">
      <h1 className="text-2xl sm:text-3xl font-bold">Aviator Game</h1>
      <div className="relative w-full max-w-2xl h-80 sm:h-96 bg-gray-900 rounded-lg flex flex-col items-center justify-center p-4">
        <div className="flex justify-center items-center w-full h-full">
          <ResponsiveContainer width="90%" height="90%">
            <AreaChart data={graphData} margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="gray" />
              <XAxis dataKey="time" type="number" domain={[0, 'auto']} stroke="white" />
              <YAxis domain={[parseFloat(betAmount) || 1.0, 'auto']} stroke="white" />
              <Area type="monotone" dataKey="value" stroke="#4CAF50" fill="transparent" />
              <Scatter
                data={[graphData[graphData.length - 1]]}
                shape={({ cx, cy }) => (
                  <svg x={cx - 10} y={cy - 10} width={20} height={20}>
                    <circle cx="10" cy="10" r="10" fill="yellow" />
                  </svg>
                )}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <p className="absolute top-2 right-2 bg-black px-4 py-1 rounded text-yellow-400">Amount: {currentAmount.toFixed(2)}</p>
      </div>
      {crashed && !cashOutAmount && <p className="text-red-500 font-semibold text-6xl">Crashed!</p>}
      {cashOutAmount && (
        <p className="text-green-400 font-semibold text-xl">You cashed out: {cashOutAmount.toFixed(2)} ({(cashOutAmount / (parseFloat(betAmount) || 1)).toFixed(2)}x)</p>
      )}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full max-w-md">
        <div className="flex flex-col items-center w-full">
          <label className="text-white mb-1">Bet Amount</label>
          <input
            type="text"
            value={betAmount}
            onChange={(e) => setBetAmount(e.target.value)}
            className="w-full p-3 text-black bg-white border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            placeholder="Enter Bet Amount"
          />
        </div>
        <div className="flex flex-col items-center w-full">
          <label className="text-white mb-1">Multiplier</label>
          <select
            value={returnMultiplier}
            onChange={(e) => setReturnMultiplier(parseFloat(e.target.value))}
            className="w-full p-3 text-black bg-white border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          >
            <option value={2}>2x</option>
            <option value={4}>4x</option>
          </select>
        </div>
      </div>
      <div className="flex space-x-4">
        <Button onClick={startGame} className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg">Place Bet</Button>
        {isFlying && <Button onClick={cashOut} className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg">Cash Out</Button>}
      </div>
    </div>
  );
}
