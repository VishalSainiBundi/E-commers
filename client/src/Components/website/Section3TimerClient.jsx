"use client";
import { useEffect, useState } from "react";
export default function Section3TimerClient() {
  const [timeLeft, setTimeLeft] = useState({ days: 2, hours: 9, minutes: 34, seconds: 45 });
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
        }
        if (minutes < 0) {
          minutes = 59;
          hours--;
        }
        if (hours < 0) {
          hours = 23;
          days--;
        }
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="flex gap-4 sm:gap-3 text-center">
      {Object.entries(timeLeft).map(([key, val]) => (
        <div key={key} className="bg-white border-2 border-gray-200 rounded-xl p-1 shadow-sm">
          <div className="text-sm font-bold text-[#01A49E]">{val.toString().padStart(2, "0")}</div>
          <div className="text-[5px] font-semibold text-gray-600 mt-1">
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </div>
        </div>
      ))}
    </div>
  );
}
