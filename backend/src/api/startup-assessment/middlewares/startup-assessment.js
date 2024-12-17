"use strict";

/**
 * `startup-assessment` middleware
 */

module.exports = (config, { strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    try {
      const { data } = ctx.request.body;
      const { startup, score, step, judge, questionScore } = data;
      const { id: userId, viewLastStep, viewPreviousStep } = ctx.state.user;

      const uUser = await strapi.entityService.findOne(
        "plugin::users-permissions.user",
        userId,
        {
          fields: ["id"],
          populate: {
            regions: {
              fields: ["id"],
            },
          },
        }
      );

      const regionIds = uUser.regions.map((region) => region.id);

      const startups = await strapi.entityService.findMany(
        "api::startup.startup",
        {
          fields: ["id"],
          filters: {
            id: parseInt(startup),
            region: {
              id: {
                $in: regionIds,
              },
            },
          },
        }
      );

      const decodedStep = decodeURIComponent(step);
      if (
        !startups.length ||
        (decodedStep === "Local contest" && !viewPreviousStep) ||
        (decodedStep === "Regional contest" && !viewLastStep)
      ) {
        ctx.throw(401, "Unauthorized");
      }

      await next();
    } catch (error) {
      ctx.throw(401, "Unauthorized");
    }
  };
};
