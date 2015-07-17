var userModel = require('./user/userModel.js');
var dwellingModel = require('./dwelling/dwellingModel.js');
var taskModel = require('./task/taskModel.js');

module.exports = {
  users: {
    add : function(req, res){
      console.log('Add User Request Handler...');
      var user = {  // Data Packaging
        username: req.body.username,
        password: req.body.password,
        age     : req.body.age,
        email   : req.body.email,
      };
      userModel.add(user, function(err, insertedUserId){
        userResponseHandler(err, insertedUserId, res);
      });
    },

    getAll : function(req, res){
      userModel.getAll(function(err, results){
        userResponseHandler(err, results, res);
      });
    },

    find : function(req, res){
      console.log('inside the user find request handler');
      var username = req.params.username;
      console.log(username)
      userModel.findUser(username, function(err, results){
        console.log('inside response handler: ', results);
        userResponseHandler(err, results, res);
      });
    }
  },

  tasks: {
    add: function(req, res){
      console.log('ADD TASK REQ.HANDLER');
      taskModel.add(req.body, houseId)
    },

    remove: function(req, res){

    },

    getAll : function(req, res){
      // need to pull current user from the req.user
      taskModel.getAll(function(err, results){
        if(err) console.log(err)
        else{
          res.send(results);
          res.end();
        }
      });
    }
  },

  dwellings: {
    add: function(req, res){
      // 1. make the house
      console.log('inside dwelling add request handler');
      dwellingModel.createDwelling(req.body, function(err, dwellingId){
        if(err){
          console.log(err)
          res.send('failure');
          res.end();
        }
        else {
          // update the currently logged in user's homeId
            // call some user model function that does this and pass the dwellingId
            // passed dwellingId.

          res.send(dwellingId)
          res.end();
        }
      });
    },

    get: function(req, res){

    }
  }
}


// Utility function for user response handling
function userResponseHandler(err, resultsData, res){
  if(err) res.end(JSON.stringify(err));
  else{
    res.send(resultsData);
    res.end();
  }
}
