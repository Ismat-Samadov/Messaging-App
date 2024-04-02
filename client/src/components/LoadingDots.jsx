export default function LoadingDots() {
  return (
    <div className="flex items-center justify-center space-x-2 bg-transparent">
      <span className="sr-only">Loading...</span>
      <div className="h-4 w-4 animate-bounce rounded-full bg-rose-500 [animation-delay:-0.3s]"></div>
      <div className="h-4 w-4 animate-bounce rounded-full bg-rose-500 [animation-delay:-0.15s]"></div>
      <div className="h-4 w-4 animate-bounce rounded-full bg-rose-500"></div>
    </div>
  );
}
