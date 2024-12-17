"use strict";

const constants = require("../../../../lib/contants");

/**
 * `startup-assessment` policy
 */

module.exports = async (policyContext, config, { strapi }) => {
  // Add your own logic here.
  strapi.log.info("In startup-assessment policy.");

  const { data } = policyContext.request.body;
  const { startup, step } = data;
  const local = constants.localContest;
  const regional = constants.regionalContest;
  const {
    isJudge,
    viewLastStep,
    viewPreviousStep,
    id: userId,
  } = policyContext.state.user;

  const params = new URLSearchParams(`string=${step}`);
  const decodedStep = params.get("string");

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
          $eq: decodedStep,
        },
      },
    }
  );

  const isValidStep = steps.find((data) => data.step === decodedStep);

  let returnBoolean = false;
  if (isValidStep?.id) {
    returnBoolean = true;
  }

  const targetedStep = isValidStep?.step;

  const findAssessment = await strapi.entityService.findMany(
    "api::startup-assessment.startup-assessment",
    {
      filters: {
        startup: {
          id: {
            $eq: startup,
          },
        },
        judge: {
          id: {
            $eq: userId,
          },
        },
        step: {
          $eq: targetedStep,
        },
        lockedForm: {
          $eq: true,
        },
      },
    }
  );
  if (findAssessment.length > 0) {
    returnBoolean = false;
  }

  if (isJudge) {
    const localClosed = targetedStep === local && !global.competitionLocalOpen;
    const regionalClosed =
      targetedStep === regional && !global.competitionRegionalOpen;
    const viewNotAllowedForLocal = targetedStep === local && !viewPreviousStep;
    const viewNotAllowedForRegional =
      targetedStep === regional && !viewLastStep;

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
