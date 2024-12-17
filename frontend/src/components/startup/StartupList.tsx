"use client";

import React, { useEffect, useState } from "react";
import { Button, buttonVariants } from "../ui/button";
import {
  IconCheck,
  IconComponents,
  IconEdit,
  IconPlus,
  IconStar,
} from "@tabler/icons-react";
import Link from "next/link";
import { Session } from "next-auth";
import { StartupT } from "@/types/strapi/Startup";
import { GlobalAttributes } from "@/types/strapi/Global";
import { useRouter, useSearchParams } from "next/navigation";
import { StartupRegionFilter } from "./StartupRegionFilter";

const _all = "all";

type Props = {
  session: Session | null;
  token: string | undefined;
  startups: StartupT[];
  global: GlobalAttributes;
  isJudge: boolean | undefined;
  viewLastStep: boolean | undefined;
  viewPreviousStep: boolean | undefined;
};
function StartupList({
  session,
  token,
  startups,
  global,
  isJudge,
  viewLastStep,
  viewPreviousStep,
}: Props) {
  const router = useRouter();
  const [allStartups, setAllStartups] = useState<StartupT[]>(startups);
  const [filter, setFilter] = useState<string>("all");
  const searchParams = useSearchParams();
  const filterByUrl = searchParams.get("region");

  function updateSelectedRegion(filterStartups: string): string {
    if (!filterStartups) return ""; // Returning an empty string if filterStartups is falsy

    const params = new URLSearchParams(window.location.search); // Assuming `searchParams` is from `window.location.search`
    params.set("region", filterStartups);
    window.history.pushState(null, "", `?${params.toString()}`);

    return filterStartups; // Return the updated filterStartups or any relevant string
  }

  function isRegionExists(region: string | null) {
    if (!region) return false;
    const regions = session?.user.regions;
    if (!regions) return false;
    const hasRegion = regions.find((r) => r.title === region);
    return !!hasRegion?.id;
  }
  useEffect(() => {
    const isExist = isRegionExists(filterByUrl);
    if (!isExist || filterByUrl === _all) {
      updateSelectedRegion(_all);
      setFilter(_all);
      setAllStartups(startups);
      return;
    }
    let newList = startups.filter(
      (startup) => startup.region?.title === filterByUrl
    );
    setAllStartups(newList);
    setFilter(filterByUrl ? filterByUrl : _all);
  }, [filterByUrl]);

  return (
    <div className="max-w-screen-lg mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-lg">Startups</h2>
        <div className="hidden lg:flex justify-center items-center gap-4">
          <Button
            variant={filter === _all ? "destructive" : "outline"}
            onClick={() => updateSelectedRegion("all")}
          >
            {filter === _all ? <IconCheck size={18} className="mr-1" /> : null}
            Show all
          </Button>
          {session?.user?.regions?.map((region) => (
            <Button
              key={region.id}
              variant={filter === region?.title ? "destructive" : "outline"}
              onClick={() =>
                updateSelectedRegion(region?.title ? region?.title : _all)
              }
            >
              {filter === region.title ? (
                <IconCheck size={18} className="mr-1" />
              ) : null}
              {region.title}
            </Button>
          ))}
        </div>
        <div className="block lg:hidden">
          {session?.user?.regions ? (
            <StartupRegionFilter
              regions={session?.user?.regions}
              filter={filter}
              _all={_all}
              updateSelectedRegion={updateSelectedRegion}
            />
          ) : null}
        </div>
        <p>
          Total: <b>{startups?.length}</b>
        </p>
      </div>
      <hr className="border-b mt-2 border-zinc-100" />
      <div>
        {allStartups?.map((startup) => {
          let postAssessment = {
            step2: {
              score: -1,
              approved: false,
            },
            step3: {
              score: -1,
            },
          };
          startup.startup_assessments?.map((assessment) => {
            if (assessment.step === "Local contest") {
              postAssessment.step2 = {
                score: assessment?.score || -1,
                approved: assessment.approved || false,
              };
            }
            if (assessment.step === "Regional contest") {
              postAssessment.step3 = {
                score: assessment?.score || -1,
              };
            }
          });

          return (
            <div
              className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-3 border border-slate-100 my-4"
              key={startup.id}
            >
              <div className="flex items-center gap-2">
                <IconComponents /> {startup.name}
              </div>
              {isJudge ? (
                <div className="flex flex-col sm:flex-row justify-end items-center gap-2">
                  {viewPreviousStep ? (
                    <Link
                      href={
                        global?.competitionLocalOpen || global?.openViewToJudges
                          ? `/judge/assessment/${startup.id}/Local contest`
                          : "#"
                      }
                    >
                      <Button
                        size="sm"
                        disabled={
                          !global.competitionLocalOpen &&
                          !global?.openViewToJudges
                        }
                        className="pl-2 gap-2"
                      >
                        {!postAssessment.step2 ? (
                          <IconPlus size={18} />
                        ) : (
                          <IconEdit size={18} />
                        )}
                        Local contest{" "}
                        {postAssessment?.step2?.score > -1 ? (
                          <p className="flex items-center gap-1">
                            (<IconStar size={14} />
                            {postAssessment?.step2?.score} )
                          </p>
                        ) : null}
                      </Button>
                    </Link>
                  ) : null}
                  {viewLastStep ? (
                    <Link
                      href={
                        !global?.competitionRegionalOpen &&
                        !global?.openViewToJudges
                          ? "#"
                          : `/judge/assessment/${startup.id}/Regional contest`
                      }
                    >
                      <Button
                        size="sm"
                        disabled={
                          !global?.competitionRegionalOpen &&
                          !global?.openViewToJudges
                        }
                        className="pl-2 gap-2"
                      >
                        {!postAssessment.step3 ? (
                          <IconPlus size={18} />
                        ) : (
                          <IconEdit size={18} />
                        )}
                        Regional contest{" "}
                        {postAssessment?.step3?.score > -1 ? (
                          <p className="flex items-center gap-1">
                            (<IconStar size={14} />
                            {postAssessment?.step3?.score} )
                          </p>
                        ) : null}
                      </Button>
                    </Link>
                  ) : null}
                </div>
              ) : (
                <div className="flex flex-row gap-4 items-center">
                  {startup?.startup_scores?.map((sScore) => {
                    return (
                      <div key={sScore.id}>
                        <p>
                          <small>{sScore.step}:</small>{" "}
                          <b
                            className={
                              (sScore.step === "Regional contest" &&
                                sScore.regionalContestWinner) ||
                              (sScore.step === "Local contest" &&
                                sScore.localContestWinner)
                                ? "text-green-500"
                                : "text-red-700"
                            }
                          >
                            {sScore.finalScore}
                          </b>
                        </p>
                      </div>
                    );
                  })}
                  <div>
                    <Link
                      className={buttonVariants()}
                      href={`/judge/admin/${startup.id}`}
                    >
                      View
                    </Link>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StartupList;
