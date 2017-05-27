describe('promise', function() {
  it('just return a resolved promise', function() {
    return Promise.resolve(1);
  });

  it('return a promise resolved after 1 secs', function() {
    return new Promise((resolve, reject) => {
      setTimeout(function() {
        resolve(1);
      }, 1000);
    });
  });

  it('return a promise reject after 1 secs', function() {
    return new Promise((resolve, reject) => {
      setTimeout(function() {
        reject('promse rejected');
      }, 1000);
    });
  });
});
