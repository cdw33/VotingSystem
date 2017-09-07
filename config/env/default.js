'use strict';

module.exports = {
  app: {
    title: 'Votem Voting Platform',
    description: 'Open-Source Voting Platform Utilizing Blockchain Technology',
    keywords: 'voting, votem, ethereum, blockchain',
    googleAnalyticsTrackingID: process.env.GOOGLE_ANALYTICS_TRACKING_ID || 'GOOGLE_ANALYTICS_TRACKING_ID'
  },
  port: process.env.PORT || 3000,
  templateEngine: 'swig',
  sessionSecret: 'MEAN',
  sessionCollection: 'sessions',
  logo: 'modules/core/img/brand/logo.png',
  favicon: 'modules/core/img/brand/favicon.ico'
};
