///startup-assessment/admin/:assessmentId

import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import Questions from "@/components/Questions";
import fetcher from "@/lib/fetchData/fetcher";
import { AssessmentQuestionT, Question } from "@/types/strapi/Assessment";
import { StartupT } from "@/types/strapi/Startup";
import { getServerSession } from "next-auth";

type Props = {
  token: string | undefined;
  assessmentId: string;
  startupId: string;
};

const getStartupAssessment = async ({
  token,
  assessmentId,
  startupId,
}: Props) => {
  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const startups: { startup: StartupT; questions: AssessmentQuestionT } =
    await fetcher(
      `/startup-assessment/admin/${startupId}/${assessmentId}`,
      {},
      options
    );
  return startups;
};

async function AdminAssessmentPage({
  params: { startupId, assessmentId },
}: {
  params: { startupId: string; assessmentId: string };
}) {
  const session = await getServerSession(authOptions);
  const token = session?.strapiToken;
  const startup = await getStartupAssessment({
    token,
    startupId,
    assessmentId,
  });
  return (
    <div>
      {startup.startup?.startup_assessments &&
      startup.startup?.startup_assessments?.length > 0 ? (
        <div>
          <Questions
            questions={startup?.questions?.questions}
            name={startup?.startup?.name}
            step={startup?.questions?.step}
            entrepreneur={startup?.startup?.entrepreneur}
            token={session?.strapiToken}
            startupId={startupId}
            updatedQuestionScore={
              startup.startup.startup_assessments[0].questionScore
            }
            isLocked={startup.startup.startup_assessments[0].lockedForm}
            assessmentId={parseInt(assessmentId)}
          />
        </div>
      ) : null}
    </div>
  );
}

export default AdminAssessmentPage;
