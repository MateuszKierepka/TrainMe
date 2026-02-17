export function inputClassName(touched: boolean, hasError: boolean, extra = "") {
  const base = "block w-full rounded-lg border bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:ring-1 focus:outline-none";
  const border = touched && hasError
    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
    : touched && !hasError
      ? "border-green-500 focus:border-green-500 focus:ring-green-500"
      : "border-gray-300 focus:border-gray-900 focus:ring-gray-900";
  return `${base} ${border} ${extra}`;
}
