import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import fetcher from "@/lib/fetchData/fetcher";
import { AssessmentQuestionT, Option } from "@/types/strapi/Assessment";
import { questionScore, StartupT } from "@/types/strapi/Startup";
import {
  IconHelpOctagon,
  IconQuestionMark,
  IconStar,
  IconUserStar,
} from "@tabler/icons-react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Questions from "@/components/Questions";
import { GlobalT } from "@/types/strapi/Global";
import constants from "@/lib/constants";
import { Metadata } from "next";

const allowedSteps = ["Local%20contest", "Regional%20contest"];
export const revalidate = 0;

type GetStartupT = {
  token: string | undefined;
  startupId?: string;
  step: string;
};

const getGlobal = async (token: string | undefined) => {
  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-cache",
  };
  const global: GlobalT = await fetcher("/global", {}, options);
  return global?.data?.attributes;
};

const getStartup = async ({ token, startupId, step }: GetStartupT) => {
  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-cache",
  };
  const startups: StartupT = await fetcher(
    `/startup/region-startup/${startupId}/${step}`,
    {},
    options
  );
  return startups;
};

const getAssessment = async ({ token, step }: GetStartupT) => {
  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-cache",
  };
  const startups: AssessmentQuestionT = await fetcher(
    `/assessment/${step}`,
    {},
    options
  );
  return startups;
};

export async function generateMetadata({
  params: { startupId, step },
}: {
  params: { startupId: string; step: string };
}): Promise<Metadata> {
  const session = await getServerSession(authOptions);
  const startup = await getStartup({
    token: session?.strapiToken,
    startupId,
    step,
  });

  return {
    title: startup?.name + " | " + decodeURIComponent(step),
  };
}

async function AssessmentPage({
  params: { startupId, step },
}: {
  params: { startupId: string; step: string };
}) {
  const session = await getServerSession(authOptions);
  if (
    !allowedSteps.includes(step) ||
    (step === allowedSteps[0] && !session?.user?.viewPreviousStep) ||
    (step === allowedSteps[allowedSteps.length - 1] &&
      !session?.user?.viewLastStep)
  ) {
    redirect("/judge");
  }
  const startup = await getStartup({
    token: session?.strapiToken,
    startupId,
    step,
  });

  if (!startup?.id) {
    redirect("/judge");
  }
  const global = await getGlobal(session?.strapiToken);

  const assessment = await getAssessment({ token: session?.strapiToken, step });
  let updatedQuestionScore: questionScore[] = [];
  let isLocked = false;
  let assessmentId = undefined;

  if (assessment.step === constants.local) {
    isLocked = !global.competitionLocalOpen;
  }
  if (assessment.step === constants.reginal) {
    isLocked = !global.competitionRegionalOpen;
  }

  if (startup?.startup_assessments?.length) {
    startup?.startup_assessments?.map((assessment) => {
      if (assessment?.step === decodeURIComponent(step)) {
        isLocked = assessment?.lockedForm;
        assessmentId = assessment.id;
        updatedQuestionScore = assessment?.questionScore?.map((item) => ({
          question: item.id,
          score: item.score,
        }));
      }
    });
  }
  return (
    <div>
      <Questions
        questions={assessment.questions}
        name={startup.name}
        step={step}
        entrepreneur={startup.entrepreneur}
        token={session?.strapiToken}
        startupId={startupId}
        updatedQuestionScore={updatedQuestionScore}
        isLocked={isLocked}
        assessmentId={assessmentId}
        isJudge={session?.user?.isJudge}
      />
    </div>
  );
}

export default AssessmentPage;
