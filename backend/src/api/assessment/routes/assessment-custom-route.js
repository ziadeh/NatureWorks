module.exports = {
  routes: [
    {
      method: "GET",
      path: "/assessment/:step",
      handler: "assessment.getQuestionsByStep",
      config: {
        middlewares: [],
        policies: ["api::assessment.assessment"],
      },
    },
  ],
};
