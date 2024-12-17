import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getLocale } from "next-intl/server";
import { IconLanguage, IconLogout2, IconUser } from "@tabler/icons-react";
import RefetchPage from "@/components/RefetchPage";
export const revalidate = 0;

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import SignOutButton from "@/components/header/SignOutButton";
import SwitchLanguage from "@/components/header/SwitchLanguage";
import Link from "next/link";

async function JudgeLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    // redirect("/signin");
  }
  return (
    <div className="container">
      <RefetchPage />
      <div className="grid grid-cols-2 md:grid-cols-3 py-10 gap-5 md:gap-10 mb-10 items-center">
        <div className="">
          <h1 className="text-xl font-semibold mb-5 ">NatureWorks</h1>
        </div>
        <div className="order-3 md:order-2 col-span-2 md:col-span-1">
          <div className="grid grid-cols-3 items-center bg-white px-8 rounded-md">
            <div>
              <Image
                src="/images/Kingdom-of-the-Netherlands.png"
                width={200}
                height={100}
                alt=""
                className="mx-auto"
              />
            </div>
            <div>
              <Image
                src="/images/leaders_international_logo.jpg"
                width={200}
                height={100}
                alt=""
                className="mx-auto"
              />
            </div>
            <div className="h-24">
              <Image
                src="/images/rscn-logo.png"
                width={200}
                height={100}
                alt=""
                className="mx-auto object-contain h-full"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end items-center gap-4 order-2 md:order-3">
          <SwitchLanguage />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="gap-1 pl-3 capitalize" variant="outline">
                <IconUser />
                {session?.user?.name}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem className="p-0">
                <SignOutButton />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {children}
    </div>
  );
}

export default JudgeLayout;
