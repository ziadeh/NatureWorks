import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import StartupTable from "@/components/startup/StartupTable";
import fetcher from "@/lib/fetchData/fetcher";
import { GetStartupT, StartupT } from "@/types/strapi/Startup";
import {
  IconArrowLeft,
  IconMapPin,
  IconMapPinFilled,
  IconStar,
  IconUserStar,
} from "@tabler/icons-react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import React from "react";

const getStartup = async ({ token, startupId }: GetStartupT) => {
  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const startups: StartupT = await fetcher(
    `/startup/data/${startupId}`,
    {},
    options
  );
  return startups;
};

async function AdminStartupPage({
  params: { startupId },
}: {
  params: { startupId: string };
}) {
  const session = await getServerSession(authOptions);
  const token = session?.strapiToken;

  const startup = await getStartup({
    token,
    startupId,
  });

  return (
    <div>
      <div className="grid grid-cols-3 items-center sticky top-0 bg-white/80 z-10 p-2">
        <div className="flex gap-4">
          <Link
            href="/judge"
            className="w-16 h-16 bg-white flex justify-center items-center hover:bg-zinc-50 transition-all"
          >
            <IconArrowLeft />
          </Link>
          <div>
            <h1 className="font-bold text-blue-500 text-2xl">{startup.name}</h1>
            <p className="flex items-center gap-1 mt-2 font-semibold text-indigo-700">
              <IconUserStar /> {startup.entrepreneur}
            </p>
          </div>
        </div>
        <div className="font-semibold text-center">
          <IconMapPin className="mx-auto mb-1" />
          <p className="text-lg">{startup.region?.title}</p>
        </div>
        <div className="flex justify-end">
          <div className="flex flex-col justify-center items-center text-center">
            <div className="flex gap-2">
              {startup.startup_scores?.map((st) => (
                <div key={st.id}>
                  <p className="text-sm text-zinc-700">{st.step}</p>
                  <p className="font-bold text-2xl text-blue-500">
                    {st.finalScore}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white p-5 mt-1">
        <StartupTable
          assessments={startup.startup_assessments}
          startupId={startupId}
        />
      </div>
      {/* <pre>{JSON.stringify(startup, undefined, 2)}</pre> */}
    </div>
  );
}

export default AdminStartupPage;
