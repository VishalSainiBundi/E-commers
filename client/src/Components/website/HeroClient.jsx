"use client";
import { useState } from "react";
import { Mail } from "lucide-react";
export default function HeroClient() {
  const [email, setEmail] = useState("");
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex flex-col xs:flex-row items-stretch bg-white/95 backdrop-blur-sm rounded-2xl xs:rounded-full overflow-hidden max-w-sm sm:max-w-md shadow-2xl hover:shadow-[#01A49E]/20 transition-shadow"
    >
      <div className="flex items-center flex-1 px-4 sm:px-5 py-1">
        <Mail size={18} className="text-[#01A49E] sm:w-5 sm:h-5 shrink-0" />
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 sm:px-4 py-3 sm:py-3.5 text-gray-700 text-sm sm:text-base outline-none bg-transparent placeholder:text-gray-400"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-[#01A49E] text-white font-bold px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base hover:bg-[#019089] active:scale-95 transition-all rounded-2xl xs:rounded-r-full xs:rounded-l-none shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
      >
        Subscribe <span className="group-hover:translate-x-1 transition-transform">→</span>
      </button>
    </form>
  );
}
