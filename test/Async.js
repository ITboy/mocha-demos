describe('async', function() {
  it('no error raised in aync code', function(done) {
    done();
  });

  it('raise error in aync code', function(done) {
    done('internal error');
  });
});
