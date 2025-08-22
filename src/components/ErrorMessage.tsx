export default function ErrorMessage({ message = "Something went wrong." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 bg-red-50 border border-red-300 rounded">
      <p className="text-red-600 font-semibold">{message}</p>
    </div>
  );
}
