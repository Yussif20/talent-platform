"use client";

import Image from "next/image";

export default function Logo({
  className = "h-16 w-auto flex items-center justify-center",
}: {
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Light mode logo */}
      <Image
        src="/logo-light.png"
        alt="TalentBridge Logo"
        width={200}
        height={80}
        className="block dark:hidden select-none object-contain w-auto h-full max-w-[220px]"
        priority
        suppressHydrationWarning
        draggable={false}
      />
      {/* Dark mode logo */}
      <Image
        src="/logo-dark.png"
        alt="TalentBridge Logo"
        width={180}
        height={60}
        className="hidden dark:block select-none object-contain w-auto h-full max-w-[200px]"
        priority
        suppressHydrationWarning
        draggable={false}
      />
    </div>
  );
}
