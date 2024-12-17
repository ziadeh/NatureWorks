"use client";

import { useLocale } from "next-intl";
import { locales } from "@/i18n";
import { Fragment } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "@/lib/navigation";
import { Button } from "../ui/button";
import { IconLanguage } from "@tabler/icons-react";

function SwitchLanguage() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = () => {
    router.push(pathname, { locale: locale === "en" ? "ar" : "en" });
  };

  return (
    <Button
      className="gap-1 pl-3 uppercase"
      variant="outline"
      onClick={() => switchLocale()}
    >
      <IconLanguage />
      {locale === "en" ? "عربي" : "EN"}
    </Button>
  );
}
export default SwitchLanguage;
