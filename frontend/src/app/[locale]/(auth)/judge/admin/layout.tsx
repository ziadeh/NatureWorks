import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";
export const revalidate = 0;

async function JudgeAdminLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const session = await getServerSession(authOptions);
  if (session?.user?.isJudge) {
    redirect("/");
  }
  return <div className="container">{children}</div>;
}

export default JudgeAdminLayout;
