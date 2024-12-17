module.exports = {
  routes: [
    {
      method: "GET",
      path: "/auth/me",
      handler: "auth.getMe",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
