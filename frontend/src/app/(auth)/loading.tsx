export default function AuthLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-gray-300 border-t-gray-900" />
        <p className="text-sm text-gray-500">Ładowanie...</p>
      </div>
    </div>
  );
}
