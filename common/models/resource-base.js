'use strict';

module.exports = function(ResourceBase) {
  ResourceBase.observe('before save', function(ctx, next) {
    if (ctx.instance && ctx.isNewInstance) {
      ctx.instance.updatedAt = new Date();
      ctx.instance.createdAt = new Date();
    } else if (ctx.instance) {
      ctx.instance.updatedAt = new Date();
    } else if (ctx.data) {
      ctx.data.updatedAt = new Date();
    }
    next();
  });
};
