'use strict';

/**
 * startup-score controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::startup-score.startup-score');
