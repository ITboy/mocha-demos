const assert = require('assert');
const MongoClient = require('mongodb').MongoClient;

const mongoUrl = 'mongodb://127.0.0.1:27017/mydb';

describe('hooks', function () {
  let dbInfo = {};
  let index = 0;
  before('before hook', function(done) {
    MongoClient.connect(mongoUrl, function(err, db) {
      if (err) {
        done(err);
      } else {
        dbInfo.db = db;
        done();
      }
    });
  });

  beforeEach('before each', function(done) {
    index += 1;
    dbInfo.db.collection('user').insert({ name: 'prepper', 'email': 'prepper@126.com', index: index }
    , function(err, result) {
      done(err);
    });
  });

  it('find user', function(done) {
    dbInfo.db.collection('user').findOne({}, { fields: { _id: 0 } }, function(err, user) {
      if (err) {
        done(err);
        return;
      } else {
        try {
          assert.deepEqual(user, { name: 'prepper', 'email': 'prepper@126.com', 'index': 1 });
        } catch(e) {
          done(e);
          return;
        }
        done();
      }
    });
  });

  it('update user', function(done) {
    dbInfo.db.collection('user')
    .updateOne({}, { $set: { name: 'gjj' } })
    .then(function() {
      dbInfo.db.collection('user').findOne({}, { fields: { _id: 0 } }, function(err, user) {
      if (err) {
        done(err);
        return;
      } else {
        try {
          assert.deepEqual(user, { name: 'gjj', 'email': 'prepper@126.com', 'index': 2 });
        } catch(e) {
          done(e);
          return;
        }
        done();
      }
    });
    });
  });

  afterEach('after each', function(done) {
    dbInfo.db.collection('user').deleteOne({}, {}, function(err) {
      done(err);
    });
  });

  after('after hook', function() {
    dbInfo.db.close();
  });
});
