export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-12 h-12 sm:w-16 sm:h-16">
        <div className="absolute top-0 left-0 w-full h-full border-4 sm:border-4 border-[#2a2a2a] rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 sm:border-4 border-[#ff9000] rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p className="mt-4 text-sm sm:text-base text-gray-400">Loading...</p>
    </div>
  );
}
