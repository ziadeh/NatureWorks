'use strict';

/**
 * startup-score service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::startup-score.startup-score');
