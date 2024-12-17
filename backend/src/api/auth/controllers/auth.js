"use strict";

/**
 * A set of functions called "actions" for `auth`
 */

module.exports = {
  getMe: async (ctx, next) => {
    try {
      // Get the authenticated user from the context
      const user = ctx.state.user;

      if (!user) {
        return ctx.unauthorized(
          "You need to be authenticated to access this information."
        );
      }

      // Retrieve the user information from the database
      const fullUser = await strapi.entityService.findOne(
        "plugin::users-permissions.user",
        user.id,
        {
          fields: [
            "id",
            "username",
            "email",
            "isJudge",
            "viewLastStep",
            "viewPreviousStep",
          ],
          populate: {
            regions: {
              fields: ["id", "title", "locale"],
            },
          }, // populate related fields
        }
      );

      if (!fullUser) {
        return ctx.notFound("User not found");
      }

      ctx.send(fullUser);
    } catch (err) {
      ctx.body = err;
    }
  },
};
