"use strict";

const constants = require("../../../../lib/contants");

/**
 * startup controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::startup.startup", ({ strapi }) => ({
  async regionStartups(ctx) {
    let populateAssessments = "";
    let filters = {
      step: {},
      judge: {},
    };
    const { isJudge, viewLastStep, viewPreviousStep } = ctx.state.userRole;
    const global = await strapi.entityService.findMany(
      "api::global.global",
      {}
    );

    const local = constants.localContest;
    const regional = constants.regionalContest;
    let isOnlyLast = false;
    if (isJudge && !viewLastStep && viewPreviousStep) {
      populateAssessments = local;
    }

    if (isJudge && viewLastStep && !viewPreviousStep) {
      populateAssessments = regional;
      isOnlyLast = true;
    }

    if (populateAssessments) {
      filters.step = {
        $eq: populateAssessments,
      };
    }
    if (!viewLastStep && !viewPreviousStep) {
      filters.step = {
        $eq: null,
      };
    }
    if (isJudge) {
      filters.judge = {
        id: {
          $eq: ctx.state.user.id,
        },
      };
    }

    let startupsFilter = {
      region: {
        id: {
          $in: ctx.state.userRole.regions,
        },
      },
    };

    if (isOnlyLast) {
      startupsFilter.startup_scores = {
        localContestWinner: true,
      };
    }
    const startups = await strapi.entityService.findMany(
      "api::startup.startup",
      {
        filters: startupsFilter,
        populate: {
          region: {
            fields: ["id", "title"],
          },
          startup_assessments: {
            filters,
            populate: {
              judge: {
                fields: ["id", "firstName", "lastName"],
              },
            },
          },
          startup_scores: {},
        },
      }
    );

    const calcStartups = startups.map((startup) => {
      const scores = {};
      if (!isJudge) {
        // startup?.startup_scores?.forEach((score) => {
        //   scores[score.step] = {
        //     score: score.finalScore,
        //     localContestWinner: score.localContestWinner,
        //     regionalContestWinner: score.regionalContestWinner,
        //   };
        // });
      }
      return {
        ...startup,
        // startup_scores: scores,
      };
    });

    ctx.body = calcStartups;
  },
  async regionStartupById(ctx) {
    const { startupId, step } = ctx.params;
    const { isJudge, viewLastStep, viewPreviousStep } = ctx.state.user;

    let filters = {
      step: {
        $eq: step,
      },
      judge: {},
    };

    if (isJudge) {
      filters.judge = {
        id: {
          $eq: ctx.state.user.id,
        },
      };
    }
    let startups = await strapi.entityService.findMany("api::startup.startup", {
      filters: {
        id: startupId,
        region: {
          id: {
            $in: ctx.state.userRole.regions,
          },
        },
      },
      populate: {
        startup_assessments: {
          filters,
          populate: {
            judge: {
              fields: ["id", "firstName", "lastName"],
            },
            questionScore: {
              populate: {
                question: {
                  fields: ["id"],
                },
              },
            },
          },
        },
        startup_scores: {},
      },
    });

    if (startups?.length > 0) {
      const firstStartupAssessments = startups[0].startup_assessments;
      if (firstStartupAssessments?.length > 0) {
        const firstAssessmentQuestionScores =
          firstStartupAssessments[0].questionScore;
        startups[0].startup_assessments[0].questionScore =
          firstAssessmentQuestionScores?.map((item) => ({
            id: item.question.id,
            score: item.score,
          }));
      }
    }

    ctx.body = startups?.length > 0 ? startups[0] : {};
  },
  async getStartupData(ctx) {
    const { startupId } = ctx.params;
    const startup = await strapi.entityService.findOne(
      "api::startup.startup",
      startupId,
      {
        populate: {
          region: true,
          startup_scores: true,
          startup_assessments: {
            sort: "step",
            populate: {
              judge: {
                fields: ["firstName", "lastName", "username", "email"],
              },
            },
          },
        },
      }
    );
    return startup;
  },
}));
