import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Inter, Tajawal } from "next/font/google";
import { direction, isLocale, routing } from "@/i18n/routing";
import { Footer, Header, type NavLink } from "@talent/ui";
import { createClient } from "@talent/db/server";
import SignOutButton from "@/components/SignOutButton";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["200", "300", "400", "500", "700", "800", "900"],
  display: "swap",
  variable: "--font-tajawal",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: "Header" });

  // Links are passed in rather than hardcoded in the component. The shared Navigation
  // previously baked in the forms app's routes, which is why this app had its header
  // and mobile nav commented out entirely rather than linking to pages it lacks.
  const links: NavLink[] = [
    { name: t("statistics"), href: `/${locale}` },
    { name: t("submissions"), href: `/${locale}/submissions` },
  ];

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html
      lang={locale}
      dir={direction(locale)}
      className={locale === "ar" ? tajawal.variable : inter.variable}
      suppressHydrationWarning
    >
      <head>
        {/*
          Applies the stored theme before first paint. Without it the page renders light
          and then flips, because the class is otherwise only set once React hydrates.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('theme');
                  var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var theme = saved || (systemDark ? 'dark' : 'light');
                  document.documentElement.classList.toggle('dark', theme === 'dark');
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <NextIntlClientProvider messages={messages}>
          {user && <Header links={links} actions={<SignOutButton />} />}
          <main className={`flex-1 ${user ? "" : "pt-0"}`}>{children}</main>
          <Footer links={links} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
