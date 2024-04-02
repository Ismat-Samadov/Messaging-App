export default function LoadingSpinner() {
  return (
    <div className="relative">
      <div className="h-12 w-12 rounded-full border-b-8 border-t-8 border-gray-200 dark:border-neutral-700"></div>
      <div className="absolute left-0 top-0 h-12  w-12 animate-spin rounded-full border-b-8 border-t-8 border-rose-500"></div>
    </div>
  );
}
