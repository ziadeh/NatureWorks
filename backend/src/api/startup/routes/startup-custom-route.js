module.exports = {
  routes: [
    {
      method: "GET",
      path: "/startup/region-startups",
      handler: "startup.regionStartups",
      config: {
        middlewares: ["api::auth.auth"],
      },
    },
    {
      method: "GET",
      path: "/startup/region-startup/:startupId/:step",
      handler: "startup.regionStartupById",
      config: {
        middlewares: ["api::auth.auth"],
        policies: ["api::assessment.assessment"],
      },
    },
    {
      method: "GET",
      path: "/startup/data/:startupId",
      handler: "startup.getStartupData",
      config: {
        policies: ["api::global.admin"],
      },
    },
  ],
};
