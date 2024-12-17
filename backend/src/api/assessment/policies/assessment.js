"use strict";

const constants = require("../../../../lib/contants");

/**
 * `assessment` policy
 */

module.exports = async (policyContext, config, { strapi }) => {
  strapi.log.info("In assessment policy.");
  const { step } = policyContext.params;
  const local = constants.localContest;
  const regional = constants.regionalContest;
  const { isJudge, viewLastStep, viewPreviousStep } = policyContext.state.user;

  const global = await strapi.entityService.findOne(
    "api::global.global",
    1,
    {}
  );

  const steps = await strapi.entityService.findMany(
    "api::assessment.assessment",
    {
      filters: {
        step: {
          $eq: step,
        },
      },
    }
  );

  const isValidStep = steps.find((data) => data.step === step);

  let returnBoolean = false;
  if (isValidStep?.id) {
    returnBoolean = true;
  }

  if (isJudge) {
    const localClosed =
      step === local &&
      !global.competitionLocalOpen &&
      !global.openViewToJudges;
    const regionalClosed =
      step === regional &&
      !global.competitionRegionalOpen &&
      !global.openViewToJudges;
    const viewNotAllowedForLocal = step === local && !viewPreviousStep;
    const viewNotAllowedForRegional = step === regional && !viewLastStep;

    if (
      localClosed ||
      regionalClosed ||
      viewNotAllowedForLocal ||
      viewNotAllowedForRegional
    ) {
      returnBoolean = false;
    }
  }
  return returnBoolean;
};
