"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@talent/db/browser";

export default function SignOutButton() {
  const t = useTranslations("Auth");
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={async () => {
        await createClient().auth.signOut();
        router.refresh();
      }}
      className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label={t("signOut")}
    >
      <LogOut className="w-4 h-4" aria-hidden="true" />
      <span className="hidden sm:inline">{t("signOut")}</span>
    </button>
  );
}
