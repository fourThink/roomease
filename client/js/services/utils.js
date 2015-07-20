angular.module('roomEase')

.factory('Users', function($http) {

  var getUsers = function() {
    return $http({
      method: 'GET',
      url: '/users'
    })
    .then(function(resp) {
      return resp.data;
    })
  };

  var addUser = function(user) {
    return $http({
      method: 'POST',
      url: '/users',
      data: user
    })
  };

  return {
    getUsers: getUsers,
    addUser: addUser
  }

})

.factory('Request', function($http){
  var returnObj = {
    dwelling : {
      create : function(data){
        return $http({
              method: 'POST',
              url: '/dwellings',
              data: data
        }).then(function(response){
          console.log('inside dwelling create factory call : ', response);
          return response.data;
        })
      }
    },
    task : {
      create : function(data){
        return $http({
              method: 'POST',
              url: '/tasks',
              data: data
        }).then(function(response){
          console.log('inside task create factory call : ', response);
          return response.data;
        })
      }
    },

    freqToInt : { // ugly styling but sticing this here for now
      Daily : 1, 
      Weekly : 2,
      Monthly : 3
    }
  }

  return returnObj;
})

.factory('TaskSetup', function(){
});