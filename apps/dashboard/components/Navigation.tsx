"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const t = useTranslations("Header");
  const locale = useLocale();
  const pathname = usePathname();

  const navigation = [
    { name: t("home"), href: `/${locale}` },
    { name: t("teacherForm"), href: `/${locale}/teacher-form` },
    { name: t("parentForm"), href: `/${locale}/parent-form` },
  ];

  const isActive = (href: string) => {
    if (href === `/${locale}`) {
      return pathname === `/${locale}` || pathname === `/${locale}/`;
    }
    return pathname === href;
  };

  return (
    <nav className="hidden md:flex items-center gap-2 relative">
      {navigation.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex items-center px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-md
            ${
              isActive(item.href)
                ? "bg-blue-600 text-white"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            }
          `}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
}
