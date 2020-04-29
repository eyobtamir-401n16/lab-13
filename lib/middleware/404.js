'use strict';

const fourOfour = (req, res, next) => {
  res.send('404 error');
  next();
};

module.exports = fourOfour;