var db = require('../db/db.js').db;
var _ = require('underscore');

exports.fetchAllEvents = function(houseId, cb) {

};

exports.addEvent = function(event, userId, dwellingId, cb){

  var queryString = "INSERT INTO calendar_events (title, type, start_at, end_at, author_id, dwelling_id) \
                     VALUES ("
      + "'" + event.title + "', "
      + "'" + event.type + "', "
      + "'" + event.start_at + "', "
      + "'" + event.end_at + "', "
      + "'" + userId + "', "
      + "'" + dwellingId  + "') RETURNING id;";

  db.query(queryString, function(err, results){
    console.log("Saving event to the database");
    err ? cb(err, null) : cb(null, results.rows);
  });
};

exports.fetchEventsByDwellingId = function(dwellingId, cb){

  var queryString = "SELECT * FROM calendar_events WHERE dwelling_id = " + dwellingId + ";";
  db.query(queryString, function(err, results){
    if(err) {
      console.log(err);
    } else {
      if(!results.rows[0]) {
        cb("Invalid dwelling ID", null);
      }else{
        err ? cb(err, null) : cb(null, results.rows);
      }
    }
  });
};