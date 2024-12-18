"use client";
export const revalidate = 0;

import { Option, Question } from "@/types/strapi/Assessment";
import { useRouter } from "next/navigation";

import {
  IconArrowBack,
  IconArrowLeft,
  IconHelpOctagon,
  IconLock,
  IconLockOpen,
  IconStar,
  IconUserStar,
} from "@tabler/icons-react";
import { FormEvent, useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import AppDialog from "./elements/AppDialog";
import { toast } from "sonner";
import { questionScore } from "@/types/strapi/Startup";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { useLocale } from "next-intl";

type Props = {
  questions: Question[];
  name: string;
  entrepreneur?: string;
  step: string;
  token?: string;
  startupId: string;
  updatedQuestionScore: questionScore[];
  isLocked: boolean;
  assessmentId: number | undefined;
  isJudge?: boolean;
};

function Questions({
  questions,
  name,
  entrepreneur,
  step,
  token,
  startupId,
  updatedQuestionScore,
  isLocked,
  assessmentId,
  isJudge,
}: Props) {
  const [selectedOptions, setSelectedOptions] =
    useState<questionScore[]>(updatedQuestionScore);
  const [totalScore, setTotalScore] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isLockedForm, setIsLockedForm] = useState(isLocked);
  const router = useRouter();
  const locale = useLocale();
  const handleOptionChange = (questionId: number, key: string) => {
    const optionIndex = parseInt(key);
    setSelectedOptions((prev) => {
      const updatedOptions = prev.filter(
        (option) => option.question !== questionId
      );
      return [
        ...updatedOptions,
        { question: questionId, score: optionIndex + 1 },
      ];
    });
  };

  useEffect(() => {
    const totalSum = selectedOptions.reduce(
      (accumulator, currentValue) => accumulator + currentValue.score,
      0
    );
    setTotalScore(totalSum);
  }, [selectedOptions]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitted(true);

    // Check if all questions have a selected option
    const allQuestionsAnswered = questions.every((question) =>
      selectedOptions.some((option) => option.question === question.id)
    );

    if (!allQuestionsAnswered) {
      setError("Please answer all questions before submitting.");
      toast.error("Please answer all questions before submitting.");
      return;
    }

    setError(null);
    setOpen(true);
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const loadingSubmit = async () => {
    toast.promise(handleSubmit, {
      loading: "Submitting...",
      success: (data) => {
        setIsLockedForm(true);
        let newStep = decodeURIComponent(step);
        router.refresh();
        scrollToTop();
        return `${name} score has been ${
          assessmentId ? "updated" : "submitted"
        }.`;
      },
      error: (error) => {
        scrollToTop();
        if (error?.message) {
          return error?.message;
        }
        return "Something went wrong, please contact administrator.";
      },
    });
  };

  const handleSubmit = async () => {
    try {
      setOpen(false);
      setSubmitting(true);
      const data = {
        startup: startupId,
        step,
        score: totalScore,
        questionScore: selectedOptions,
      };
      let strapiResponse;
      if (assessmentId) {
        strapiResponse = await fetch(
          `/backend-api/startup-assessment/${assessmentId}`,
          {
            method: "PUT",
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ data }),
          }
        );
      } else {
        strapiResponse = await fetch(`/backend-api/startup-assessment/create`, {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ data }),
        });
      }
      setSubmitting(false);
      const response = await strapiResponse.json();
      if (response.error) {
        throw new Error(
          response?.error?.message
            ? response?.error?.message
            : "Something went wrong."
        );
      }
      return response;
    } catch (e) {
      setSubmitting(false);
      if (typeof e === "string") {
        if (e === "Unauthorized") {
          signOut();
        }
        throw new Error(e);
      } else if (e instanceof Error) {
        if (e.message === "Unauthorized") {
          signOut();
        }
        throw new Error(e.message);
      } else {
        throw new Error("Something went wrong.");
      }
    }
  };

  return (
    <div>
      <div className="font-semibold text-lg md:text-2xl text-center mb-2 -mt-10 block md:hidden">
        <IconStar className="mx-auto " />
        <p className="">
          {decodeURIComponent(step) === "Local contest"
            ? "December 18th"
            : "December 19th"}
        </p>
      </div>
      <div className="grid grid-cols-3 items-center sticky top-0 bg-white/80 z-10 p-2">
        <div className="flex gap-4 col-span-2 md:col-span-1">
          <button
            onClick={() => router.back()}
            className="w-16 h-16 bg-white flex justify-center items-center hover:bg-zinc-50 transition-all"
          >
            <IconArrowLeft />
          </button>
          <div>
            <h1 className="font-bold text-blue-500 text-lg md:text-2xl">
              {name}
            </h1>
            <p className="flex items-center gap-1 mt-2 font-semibold text-indigo-700">
              <IconUserStar /> {entrepreneur}
            </p>
          </div>
        </div>
        <div className="hidden md:block font-semibold text-2xl text-center">
          <IconStar className="mx-auto " />
          <p className="">
            {decodeURIComponent(step) === "Local contest"
              ? "December 18th"
              : "December 19th"}
          </p>
        </div>
        <div className="flex justify-end items-center">
          <div className="w-24 h-24 border border-zinc-50 bg-white flex flex-col justify-center items-center">
            <p>Score</p>
            <p className="font-bold text-2xl text-blue-500">{totalScore}</p>
          </div>
          {!isJudge ? (
            <Button
              variant={isLocked ? "default" : "default"}
              className={cn(
                "text-center flex flex-col h-auto m-0 p-2 bg-green-400 hover:bg-green-600 active:bg-green-700",
                isLocked &&
                  "bg-red-500 hover:bg-red-700 active:bg-red-800 text-white"
              )}
            >
              <div className="mb-1 text-white">
                {isLocked ? "Locked" : "Unlocked"}
              </div>
              <div>
                {isLocked ? (
                  <IconLock className="mx-auto" size={28} />
                ) : (
                  <IconLockOpen className="mx-auto" size={28} />
                )}
              </div>
            </Button>
          ) : null}
        </div>
      </div>

      <form
        onSubmit={onSubmit}
        className="max-w-screen-lg mx-auto mt-10"
        dir={locale === "ar" ? "rtl" : "ltr"}
      >
        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
            {error}
          </div>
        )}
        {questions?.map((question) => {
          const isOptionSelected = selectedOptions.some(
            (option) => option.question === question.id
          );
          const selectedScore = selectedOptions.find(
            (option) => option.question === question.id
          )?.score;
          const arOptions =
            question.localizations?.length > 0
              ? question.localizations[0]?.options || []
              : [];
          const options = locale === "en" ? question.options : arOptions;
          return (
            <div
              key={question.id}
              className="border border-zinc-100 bg-white p-4 rounded-sm mb-5"
            >
              <div className="mb-4">
                <h1 className="font-semibold text-center mb-4 pb-4 border-b border-zinc-100 text-sm text-blue-600 pt-2">
                  {locale === "en"
                    ? question.header
                    : question.localizations[0]?.header}
                </h1>
                <h2
                  className={`flex gap-2 font-semibold ${
                    !isOptionSelected && isSubmitted ? "text-red-600" : ""
                  }`}
                >
                  <div className="w-6">
                    <IconHelpOctagon />
                  </div>
                  {locale === "en"
                    ? question.title
                    : question.localizations[0]?.title}
                </h2>
              </div>
              <div className="px-5 mt-5">
                <RadioGroup
                  disabled={isLockedForm}
                  defaultValue={
                    selectedScore !== undefined
                      ? (selectedScore - 1).toString()
                      : ""
                  }
                  onValueChange={(e) => handleOptionChange(question.id, e)}
                >
                  {options.map((option, key) => (
                    <div
                      key={option.id}
                      className="flex space-x-2 mb-2"
                      dir={locale === "ar" ? "rtl" : "ltr"}
                    >
                      <div className="w-4 ltr:ml-3">
                        <RadioGroupItem
                          value={key + ""}
                          id={`c-${option.id}`}
                        />
                      </div>
                      <Label
                        htmlFor={`c-${option.id}`}
                        className={cn(
                          "leading-normal",
                          locale === "ar" && "text-right"
                        )}
                        dir={(locale === "ar" && "ltr") || ""}
                      >
                        {locale === "ar"
                          ? option.choice.replace(".", "")
                          : option.choice}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          );
        })}
        <Button
          className="w-full mt-4"
          type="submit"
          disabled={submitting || isLockedForm}
        >
          {assessmentId ? "Update" : "Submit"}
        </Button>
      </form>
      <AppDialog
        open={open}
        setOpen={() => setOpen(!open)}
        confirm={loadingSubmit}
      />
    </div>
  );
}

export default Questions;
