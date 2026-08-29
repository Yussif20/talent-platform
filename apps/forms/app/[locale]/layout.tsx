import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Inter, Tajawal } from "next/font/google";
import { direction, isLocale, routing } from "@/i18n/routing";
import { Footer, Header, type NavLink } from "@talent/ui";
import DemoNotice from "@/components/DemoNotice";
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

export default async function RootLayout({
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

  const links: NavLink[] = [
    { name: t("home"), href: `/${locale}` },
    { name: t("teacherForm"), href: `/${locale}/teacher-form` },
    { name: t("parentForm"), href: `/${locale}/parent-form` },
  ];

  return (
    <html
      lang={locale}
      dir={direction(locale)}
      className={locale === "ar" ? tajawal.variable : inter.variable}
      suppressHydrationWarning
    >
      <head>
        {/*
          Applies the stored theme before first paint, so the page does not render light
          and then flip once React hydrates. The previous version hardcoded a `light`
          class on <html>, which fought this script and made dark mode flash on reload.
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
          <Header links={links} />
          <DemoNotice />
          <main className="flex-1">{children}</main>
          <Footer links={links} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
