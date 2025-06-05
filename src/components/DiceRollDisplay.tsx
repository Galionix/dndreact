import React, { useEffect, useState } from "react";

interface DiceRollVideoProps {
  rolledNumber: number;
  target?: number;
  proceed: () => void;
}

export default function DiceRollVideo({
  rolledNumber,
  target = 10,
  proceed,
}: DiceRollVideoProps) {
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowResult(true);
    }, 4000); // видео длится 4 секунды

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center">
      <div className="relative w-64 h-64 overflow-hidden rounded-xl shadow-xl">
        <video
          src="/dice-roll.mp4"
          autoPlay
          muted
          playsInline
          className="absolute w-full h-full object-cover"
        />

        {/* затемнение углов */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-full bg-gradient-to-br from-black/50 via-transparent to-black/50 rounded-xl"></div>
        </div>

        {showResult && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div
              className={`text-3xl font-bold text-white drop-shadow-md ${
                rolledNumber >= target ? "text-green-400" : "text-red-500"
              }`}
            >
              {rolledNumber} / {target}
            </div>
          </div>
        )}
      </div>
      {showResult && (
              <button
                  className='inset-0 mt-2 button'
                  onClick={proceed}>
          {"Продолжить"}
        </button>
      )}
    </div>
  );
}
