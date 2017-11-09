"use strict";
var logger = require('loopback-component-logger')('app:seed');
var loopback = require('loopback');
var oauth2 = require('loopback-component-oauth2');

var exit = process.exit;

module.exports = function(server) {

  var app = {
    name:  'api-client',
    id: server.get('appId')
  };

  var Application = loopback.getModel('OAuthClientApplication');
  Application.findOrCreate({where: {id: app.id}}, app,
    function(err, instance, created) {
      if (err) {
        logger.error('logger.error creating application', err);
        return exit(2);
      }
  });

  var createRole = function(adminRole, user) {
    server.models.Role.findOrCreate({where: {name: adminRole.name}}, 
      adminRole, function(err, role) {
        if (err) { 
          logger.error("Role find or Create logger.error:", err);
          return exit(2);
        }

        logger.debug("Role " + role.name + " created/found");
        
        role.principals.findOne({where: {
          principalType: server.models.RoleMapping.USER,
          principalId: user.id
        }}, function(err, principal) {
          if (err) {
            logger.error("logger.error finding role principals:", err);
            exit(2);
          }

          if (principal) {
            return logger.debug("Role " + role + " already created for: " 
              + user.username);
          }

          role.principals.create({
            principalType: server.models.RoleMapping.USER,
            principalId: user.id
          }, function (err) {
            if (err) {
              logger.error("Principal create logger.error,", err);
              exit(2);
            }

            logger.debug("Admin role ready");
          });
        });
    });
  };

  var user = {
    name: 'admin',
    lastname: '',
    username: 'admin',
    email: server.get('adminEmail'),
    password: server.get('adminPassword')
  };

  server.models.Person.findOrCreate({where: {email: server.get('adminEmail')}}, user,
    function(err, instance, created) {
      if (err) {
        console.log(err);
        return process.exit(2);
      }
      createRole({name: 'admin'}, instance);
  });
}
