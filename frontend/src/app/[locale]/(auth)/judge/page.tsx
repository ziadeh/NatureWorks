import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import StartupList from "@/components/startup/StartupList";
import { Button, buttonVariants } from "@/components/ui/button";
import fetcher from "@/lib/fetchData/fetcher";
import { GlobalT } from "@/types/strapi/Global";
import { StartupT } from "@/types/strapi/Startup";
import {
  IconComponents,
  IconEdit,
  IconPlus,
  IconStar,
} from "@tabler/icons-react";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import Link from "next/link";
import React from "react";

const getStartups = async (token: string | undefined) => {
  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const startups: StartupT[] = await fetcher(
    "/startup/region-startups",
    {},
    options
  );
  return startups;
};

const getGlobal = async (token: string | undefined) => {
  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const global: GlobalT = await fetcher("/global", {}, options);
  return global?.data?.attributes;
};

export async function generateMetadata(): Promise<Metadata> {
  const session = await getServerSession(authOptions);
  const token = session?.strapiToken;
  const global = await getGlobal(token);
  return {
    title: global.siteName,
  };
}

async function JudgePage() {
  const session = await getServerSession(authOptions);
  const token = session?.strapiToken;
  const startups = await getStartups(token);
  const global = await getGlobal(token);
  const isJudge = session?.user?.isJudge;
  const viewLastStep = session?.user?.viewLastStep;
  const viewPreviousStep = session?.user?.viewPreviousStep;
  return (
    <StartupList
      session={session}
      token={token}
      startups={startups}
      global={global}
      isJudge={isJudge}
      viewLastStep={viewLastStep}
      viewPreviousStep={viewPreviousStep}
    />
  );
}

export default JudgePage;
