"use strict";

/**
 * assessment controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::assessment.assessment",
  ({ strapi }) => ({
    async getQuestionsByStep(ctx) {
      const { step } = ctx.params;

      const questions = await strapi.entityService.findMany(
        "api::assessment.assessment",
        {
          filters: {
            step: {
              $eq: step,
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

      ctx.body = questions?.length > 0 ? questions[0] : {};
    },
  })
);
