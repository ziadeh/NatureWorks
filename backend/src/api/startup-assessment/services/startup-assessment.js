"use strict";

/**
 * startup-assessment service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService(
  "api::startup-assessment.startup-assessment"
);
