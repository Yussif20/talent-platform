"use client";

import { useTranslations, useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

export default function LanguageSelector() {
  const t = useTranslations("Switch");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;

    // Remove the current locale from the pathname and add the new one
    const currentPath = pathname.replace(`/${locale}`, "") || "/";
    const newPath = `/${newLocale}${currentPath}`;

    router.push(newPath);
  };

  return (
    <select
      value={locale}
      onChange={handleChange}
      className="px-3 py-2 text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      aria-label={t("label")}
    >
      <option value="en">{t("toEnglish")}</option>
      <option value="ar">{t("toArabic")}</option>
    </select>
  );
}
