const assert = require('assert');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const MongoClient = require('mongodb').MongoClient;

chai.use(chaiAsPromised);
chai.should();

const mongoUrl = 'mongodb://127.0.0.1:27017/mydb';

describe.only('hooks', function () {
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

  beforeEach('before each', function() {
    index += 1;
    return dbInfo.db.collection('user')
    .insert({ name: 'prepper', 'email': 'prepper@126.com', index: index })
    .should.be.fulfilled;
  });

  it('find user', function() {
    return dbInfo.db.collection('user')
    .findOne({}, { fields: { _id: 0 } })
    .should.eventually.deep.equal({
      name: 'prepper',
      email: 'prepper@126.com',
      index: 1,
    });
  });

  it('update user', function() {
    return dbInfo.db.collection('user')
    .updateOne({}, { $set: { name: 'gjj' } })
    .then(() =>
      dbInfo.db.collection('user')
      .findOne({}, { fields: { _id: 0 } }))
    .should.eventually.deep.equal({
      name: 'gjj',
      email: 'prepper@126.com',
      index: 2,
    });
  });

  afterEach('after each', function() {
    return dbInfo.db.collection('user')
    .deleteOne({}, {})
    .should.eventually.fulfilled;
  });

  after('after hook', function() {
    dbInfo.db.close();
  });
});
