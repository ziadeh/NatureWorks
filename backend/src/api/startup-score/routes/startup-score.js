'use strict';

/**
 * startup-score router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::startup-score.startup-score');
