"use strict";

/**
 * `auth` middleware
 */

module.exports = (config, { strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    try {
      const token = ctx.request.header.authorization.split(" ")[1];
      const { id } = await strapi.plugins[
        "users-permissions"
      ].services.jwt.verify(token);
      if (id) {
        const uUser = await strapi.entityService.findOne(
          "plugin::users-permissions.user",
          id,
          {
            fields: ["id", "isJudge", "viewLastStep", "viewPreviousStep"],
            populate: ["regions"], // populate related fields
          }
        );
        const regionIds = uUser.regions.map((region) => region.id);
        ctx.state.userRole = {
          regions: regionIds,
          isJudge: uUser.isJudge,
          viewLastStep: uUser.viewLastStep,
          viewPreviousStep: uUser.viewPreviousStep,
        };
      }
      return next();
    } catch (error) {
      ctx.throw(401, "Unauthorized");
    }
  };
};
