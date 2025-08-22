// components/Spinner.tsx
export default function Spinner({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-50">
      <div className="w-12 h-12 border-4 border-t-4 border-gray-300 border-t-[#121f3e] rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-700">{message}</p>
    </div>
  );
}
