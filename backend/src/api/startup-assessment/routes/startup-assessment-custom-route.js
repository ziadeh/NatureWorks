module.exports = {
  routes: [
    {
      method: "POST",
      path: "/startup-assessment/create",
      handler: "startup-assessment.createAssessment",
      config: {
        policies: ["api::startup-assessment.startup-assessment"],
      },
    },
    {
      method: "PUT",
      path: "/startup-assessment/:assessmentId",
      handler: "startup-assessment.updateAssessment",
      config: {
        policies: ["api::startup-assessment.startup-assessment"],
      },
    },
    {
      method: "GET",
      path: "/startup-assessment/admin/:startupId/:assessmentId",
      handler: "startup-assessment.getStartupAssessmentAdmin",
      config: {
        policies: ["api::global.admin"],
      },
    },
  ],
};
