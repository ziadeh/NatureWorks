"use strict";

const { localContest, regionalContest } = require("../../../../lib/contants");

/**
 * startup-assessment controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::startup-assessment.startup-assessment",
  ({ strapi }) => ({
    async createAssessment(ctx) {
      // @ts-ignore
      const { data } = ctx.request.body;
      const { startup, score, step, questionScore } = data;
      const judge = ctx.state.user.id;

      const params = new URLSearchParams(`string=${step}`);
      const decodedStep = params.get("string");

      const steps = await strapi.entityService.findMany(
        "api::assessment.assessment",
        {}
      );

      const isValidStep = steps.find((data) => data.step === decodedStep);

      if (!isValidStep) {
        ctx.badRequest("Not found!");
        return;
      }

      const newAssessment = await strapi.entityService.create(
        "api::startup-assessment.startup-assessment",
        {
          data: {
            startup,
            step: isValidStep.step,
            score,
            questionScore,
            judge,
          },
        }
      );
      ctx.body = { success: true, ...newAssessment };
    },
    async updateAssessment(ctx) {
      // @ts-ignore
      const { data } = ctx.request.body;
      const { startup, score, step, questionScore } = data;
      const { assessmentId } = ctx.params;

      const judge = ctx.state.user.id;
      const params = new URLSearchParams(`string=${step}`);
      const decodedStep = params.get("string");

      const steps = await strapi.entityService.findMany(
        "api::assessment.assessment",
        {}
      );

      const isValidStep = steps.find((data) => data.step === decodedStep);

      await strapi.entityService.update(
        "api::startup-assessment.startup-assessment",
        assessmentId,
        {
          data: {
            startup,
            step: isValidStep.step,
            score,
            questionScore,
            judge,
            lockedForm: true,
          },
        }
      );

      ctx.body = { success: true };
    },
    async getStartupAssessmentAdmin(ctx) {
      const { startupId, assessmentId } = ctx.params;
      const startup = await strapi.entityService.findOne(
        "api::startup.startup",
        startupId,
        {
          populate: {
            startup_assessments: {
              filters: {
                id: {
                  $eq: assessmentId,
                },
              },
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
          },
        }
      );

      let startup_assessments = [];
      if (startup.id) {
        startup_assessments = startup.startup_assessments.map((item) => {
          let assessment = {
            ...item,
            questionScore: item.questionScore.map((qs) => ({
              question: qs.question.id, // Accessing the question id correctly
              score: qs.score,
            })),
          };
          return assessment; // Ensure you return the mapped assessment
        });
      }
      let questions = [];
      if (startup.startup_assessments?.length > 0) {
        questions = await strapi.entityService.findMany(
          "api::assessment.assessment",
          {
            filters: {
              step: {
                $eq: startup.startup_assessments[0].step,
              },
            },
            populate: {
              questions: {
                populate: {
                  options: true,
                  localizations: {
                    populate: {
                      options: "*",
                    },
                  },
                },
              },
            },
          }
        );
      }
      ctx.body = {
        startup: {
          ...startup,
          startup_assessments,
        },
        questions: questions?.length > 0 ? questions[0] : questions,
      };
    },
  })
);
