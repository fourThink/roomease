var db = require('../db/db.js').db;
var fs = require ('fs');
exports.add = function(data, cb){
//   var queryString = "INSERT INTO documents (file_name, dwelling_id, user_id, filesize, type, description, data, paid) \
//                      VALUES ("
//                      + "'" + data.file_name + "', "
//                      +       dwellingId + ", "
//                      +       userId + ", "
//                      +       data.filesize + ", "
//                      + "'" + data.type + "', "
//                      //+ "'" + documents.description + "', "
//                      +       data.data +") RETURNING id;";
// **
  fs.readFile(__dirname + '/../../uploads/' + data.file_name, 'hex', function(err, imgData) {
    //console.log('imgData',imgData);
    //console.log(__dirname + '/../../uploads/' + data.file_name);
    imgData = '\\x' + imgData;
    var queryString = 'INSERT INTO documents (dwelling_id, user_id, file_name, filesize, type, data) \
      values($1, $2, $3, $4, $5, $6)';
    db.query(queryString, [data.dwelling_id, data.user_id, data.file_name, data.filesize, data.type, imgData], function(err, results){
    //db.query(queryString, function(err, results){
      if(err) console.log(err);
      console.log("Inside the addDocument query");
      err ? cb(err, null) : cb(null, results);
    });
  });
  //console.log('queryString in addDocument(): ', queryString);
},
  exports.getDocsDwelling = function(dwellingId, cb){
  var queryString = "SELECT file_name FROM documents WHERE dwelling_id = " + dwellingId + ";";
  db.query(queryString, function(err, results){
    console.log("Inside the getDocs DWELLINGS query");
    err ? cb(err, null) : cb(null, results.rows);
  });
},

 exports.showDoc = function(documentId, cb){
    fs.writeFile(__dirname + '/../../uploads'+ data.file_name,'hex', function(err, imgData){
      var queryString = 'SELECT * FROM documents WHERE id = '+ documentId+';';
      db.query(queryString, function (err, results){
        if(err) console.log(err);
        console.log("Inside the addDocument query");
        err ? cb(err, null) : cb(null, results);
      })
    })
  }, 

/*
app.get('/url/to/get/', function(req, res, next) {
  app.pgClient.query('select image from image_table limit 1',
                     function(err, readResult) {
    console.log('err',err,'pg readResult',readResult);
    

    res.json(200, {success: true});
  });
});
*/

  exports.getDocsUsers = function(userId, cb){
  var queryString = "SELECT file_name FROM documents WHERE user_id = " + userId + ";";
  db.query(queryString, function(err, results){
    console.log("Inside the getDocs USER query");
    err ? cb(err, null) : cb(null, results.rows);
  });
},
exports.deleteDoc = function(documentId, cb){
  var queryString = "DELETE * FROM documents WHERE id = " + documentId + ";";
  db.query(queryString, function(err, results){
    console.log("Inside the delete docs query");
    err ? cb(err, null) : cb(null, results.rows);
  });
}

