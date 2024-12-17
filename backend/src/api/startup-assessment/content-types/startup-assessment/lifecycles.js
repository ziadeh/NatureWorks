module.exports = {
  async afterCreate(event) {
    await updateStartupAssessmentScore(event);
  },

  async afterUpdate(event) {
    await updateStartupAssessmentScore(event);
  },

  async beforeDelete(event) {
    await updateStartupAssessmentScore(event);
  },
};

async function updateStartupAssessmentScore(event) {
  let skipId = null;
  let whereId = null;

  if (event.action === "beforeDelete") {
    skipId = event.params?.where?.id;
    whereId = event.params?.where?.id;
  } else {
    whereId = event.result.id;
  }

  const startupAssessment = await strapi.entityService.findOne(
    "api::startup-assessment.startup-assessment",
    whereId,
    {
      populate: {
        startup: {
          fields: ["id"],
        },
      },
    }
  );
  if (!startupAssessment?.startup?.id) return;

  const startupAssessments = await strapi.entityService.findMany(
    "api::startup-assessment.startup-assessment",
    {
      filters: {
        startup: {
          id: {
            $eq: startupAssessment?.startup?.id,
          },
        },
        step: {
          $eq: startupAssessment.step,
        },
      },
      populate: {
        questionScore: true,
      },
    }
  );

  if (startupAssessments?.length === 0) return;
  let totalScore = 0;
  let startupAssessmentIds = [];
  startupAssessments?.map((assessment) => {
    if (skipId === assessment.id) return;
    startupAssessmentIds.push({ id: assessment.id });
    assessment?.questionScore?.map((question) => {
      totalScore += question.score;
    });
  });

  const findStartupScore = await strapi.entityService.findMany(
    "api::startup-score.startup-score",
    {
      filters: {
        startup: {
          id: {
            $eq: startupAssessment?.startup?.id,
          },
        },
        step: {
          $eq: startupAssessment.step,
        },
      },
    }
  );

  if (findStartupScore.length === 0) {
    await strapi.entityService.create("api::startup-score.startup-score", {
      data: {
        startup: startupAssessment?.startup?.id,
        step: startupAssessment.step,
        startup_assessments: startupAssessmentIds,
        finalScore: totalScore,
      },
    });
  } else {
    await strapi.entityService.update(
      "api::startup-score.startup-score",
      findStartupScore[0].id,
      {
        data: {
          startup: startupAssessment?.startup?.id,
          step: startupAssessment.step,
          startup_assessments: startupAssessmentIds,
          finalScore: totalScore,
        },
      }
    );
  }
}
