export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 animate-gradientBackground">
      
      {/* Morphing Blob */}
      <div className="w-24 h-24 bg-white rounded-full opacity-80 animate-pulseBlob mb-8"></div>
      
      {/* Animated Dots */}
      <div className="flex space-x-3">
        <span className="w-4 h-4 bg-white rounded-full animate-bounce delay-75"></span>
        <span className="w-4 h-4 bg-white rounded-full animate-bounce delay-150"></span>
        <span className="w-4 h-4 bg-white rounded-full animate-bounce delay-300"></span>
      </div>

      {/* Loading Text */}
      <p className="text-white font-semibold text-xl mt-4 animate-pulse">Loading Level 7...</p>
    </div>
  );
}
