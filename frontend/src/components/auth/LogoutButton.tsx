"use client";

import { useRouter } from "next/navigation";
import { logoutAction } from "@/actions/logout";
import { useToast } from "@/contexts/ToastContext";
import LogoutIcon from "@/components/icons/LogoutIcon";

export default function LogoutButton({ onVideo }: { onVideo: boolean }) {
  const router = useRouter();
  const toast = useToast();

  async function handleLogout() {
    await logoutAction();
    toast.success("Wylogowano pomyślnie");
    router.push("/");
    router.refresh();
  }

  return (
    <form action={handleLogout} className="relative h-9 w-9">
      <button
        type="submit"
        className={`group absolute right-0 top-0 flex h-9 w-9 cursor-pointer items-center justify-start overflow-hidden rounded-full border-2 transition-all duration-300 active:translate-x-0.5 active:translate-y-0.5 hover:w-28 hover:rounded-[20px] ${
          onVideo
            ? "border-white/30 bg-transparent text-white hover:border-white hover:bg-white hover:text-black"
            : "border-gray-300 bg-white text-gray-900 hover:border-gray-900 hover:bg-gray-900 hover:text-white"
        }`}
      >
        <div className="flex w-full items-center justify-center transition-all duration-300 group-hover:w-[30%] group-hover:pl-3.5">
          <LogoutIcon className="w-3.5" />
        </div>
        <span className="absolute right-0 w-0 text-sm font-medium opacity-0 transition-all duration-300 group-hover:w-[70%] group-hover:pr-2.5 group-hover:opacity-100">
          Wyloguj
        </span>
      </button>
    </form>
  );
}
