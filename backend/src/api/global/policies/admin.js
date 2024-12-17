"use strict";

/**
 * `admin` policy
 */

module.exports = (policyContext, config, { strapi }) => {
  // Add your own logic here.
  strapi.log.info("In admin policy.");
  const { isJudge } = policyContext.state.user;
  if (!isJudge) {
    return true;
  }
  return false;
};
