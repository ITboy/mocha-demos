describe.only('slow case', function() {
  this.slow(2000);
  this.timeout(4000);
  it('resolved after 3 secs', function(done) {
    setTimeout(function() {
      done();
    }, 3000);
  });
});
