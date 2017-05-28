# mocha-demos
  记录最开始学习mocha的步骤，例子，以及理解。
  主要包括对官网的翻译，例子的试验，个别不明确的解释，以及额外想到的一些试验和理解。

## Mocha是什么
  mocha是一个功能强大的JavaScript测试框架，可以运行在Node.js和浏览器，支持异步测试。
  mocha是串行执行case，支持灵活的精确的报告。

## 用法
  * [安装](#安装)
  * [断言库](#断言库)
  * [异步测试](#异步测试)
  * [异步promise](#异步promise)
  * [hook](#hook)
  * [异步hook](#异步hook)
  * [根hook](#根hook)
  * [延迟执行case](#延迟执行case)
  * [pending test](#pending test)
  * [白名单，只执行某些case](#白名单，只执行某些case)
  * [黑名单，跳过某些case](#黑名单，跳过某些case)
  * [test重试](#test重试)
  * [动态生成case](#动态生成case)
  * [case的持续时间](#case的持续时间)
  * [case的超时时间](#case的超时时间)
  * [Diff](#Diff)
  * [命令行用法](#命令行用法)


### 安装
  全局安装
  ```
  $ npm install --global mocha
  ```
  或者作为项目的开发依赖
  ```
  $ npm install mocha --save-dev
  ```

### 断言库
mocha只是一个测试框架，不提供对断言细节方法的支持，所以可以使用所有需要的断言库

#### should.js
BDD风格，后面例子主要用到的就是这种。

#### better-assert
C语言风格的断言

####  expect.js
expect风格的断言

#### unexpect
可扩展的BDD断言工具包

#### chai
    expect, assert和should都支持

### 异步测试
  支持异步很简单，只需要在it方法里接受mocha传递的done参数，并在异步操作完成时，调用done方法，
  如果成功，不传递任何值，如果失败，传递error

### 异步promise
  当调用异步api返回一个promise，可以为他添加then或catch方法，继而在内部调用done方法，但是
  这样会很繁琐，因此mocha支持返回一个promise，当这个promiscasese fulfilled，则认为pass，如果被
  rejected，则case失败。
  但是这样仍然不能满足大多数需求，比如我要对promise resolved的值进行校验才能确定case是否成功，
  这时就可以使用chai-as-promised库.
  ```js
    return promise.should.eventually.equal(xxx);
    return promise.should.eventually.deep.equal(xxx);
    return promise.should.become(xxx); // same as should.eventually.deep.equal
    return promise.should.be.fulfilled;
    return promise.should.be.rejected;
    return promise.should.be.rejectedWith(xxx);
  ```
  注意，这里一定要记得return，因为在异步情况下，mocha只提供两种方式来通知case是pass还是fail，一个是done的callback，一个是return一个promise，chai-as-promised显然使用的是return一个promise，因此所有这些should本质上都是一个promise。

### hook
  定义在test suite中, 用法类似it
  * `before` 当前test suite执行前会执行一次
  * `after` 当前test suite执行后会执行一次
  * `beforeEach` 当前test suite的每一个test case执行前都会执行一次
  * `afterEach` 当前test suite的每一次test case执行后都会执行一次

### 异步hook
  hook当然可以执行异步操作，注意的是，mocha不只是每一test case是串行执行，这些hook和test case都是串行的，也就是说如果before hook不执行结束，后面的test case是不会执行的，那么如何告知before异步操作已经结束？方式与it一样，既可以使用done的callback，又可以return一个promise。

### 根hook
  当在最外层（不在任何describe之内）定义hook时，认为这些hook是根hook，此时任何test case，即使test case与当前根hook不在一个文件之内，也会受影响（假如这个hook是beforeEach)。
  但这种根hook只能使用同步操作，因为他不在一个suite内，没人给他传递done方法，也没办法return一个promise，但是如果有这种需求可参考[延迟执行case](#延迟执行case)。

### 延迟执行case
  如果你想在跑所有的case之前，做一些异步操作，首先想到的是使用[根hook](# 根hook)，但在[根hook](#根hook)节已经解释无法支持。
  mocha允许你执行异步操作，而在任何时刻调用run来通知mocha开始执行test suite，这里的run跟在test suite传递的done功能一模一样，但需要注意，在执行mocha命令时必须指定--delay以通知mocha先不执行test suite，在适当的时候，内部代码会开始test suite。

  ```js
  setTimeout(function() {
      // do some setup

      describe('my suite', function() {
      // ...
    });

    run();
  }, 5000);
  ```

### pending test
  通常在实现case前已经设计好这个方法需要有哪些case，需要逐个的实现，这时未实现的case可以只写上描述，而不传递回调函数，当case执行后，report会指明case pass几个，fail几个，pendding几个，而这里的pendding指的就是还未实现，处于pendding状态的case
  ```js
  describe('Array', function() {
    describe('#indexOf()', function() {
      // pending test below
      it('should return -1 when the value is not present');
    });
  });
  ```
  执行报告：
  ```
  Array
    #indexOf()
      - should return -1 when the value is not present


  0 passing (7ms)
  1 pending
  ```

### 白名单，只执行某些case
  用法：
    * describe.only()
    * it.only()

  注意：
  1. 影响全局，假设只配置了某case为only，那么所有的case，包括别的文件中case都不会执行，单单执行这一个case
  2. 可以同时指定多个，那么只有被指定的执行
  3. 如果指定suite，那么suite下的所有都会执行
  4. 如果指定suite，他下面的某test case也执行了，那么仍然只执行某test case
  5. 会影响beforeEach以及afterEach这些hook的重新执行
  6. 不要提交.only的代码到代码库

### 黑名单，跳过某些case
  用法：
    * describe.skip()
    * it.skip()
    * this.skip()

  注意，skip用法几乎和only一样，不同在于
  1. 跳过的case在report中是pendding状态
  2. 可以使用this.skip在运行时跳过执行，比如检查环境不合条件，不执行case

### test重试
  可以指定当test case失败时重试次数，在单元测试中尽量不要使用。
  用法：
  this.retries(n);

### 动态生成case
  这里其实不涉及mocha的新功能点，只是提醒使用者，很多情况下，多个test case非常相似，这时可以像正常使用javascript一样减少这样的冗余。
  ```js
    var assert = require('chai').assert;

    function add() {
      return Array.prototype.slice.call(arguments).reduce(function(prev, curr) {
        return prev + curr;
      }, 0);
    }

    describe('add()', function() {
      var tests = [
        {args: [1, 2],       expected: 3},
        {args: [1, 2, 3],    expected: 6},
        {args: [1, 2, 3, 4], expected: 10}
      ];

      tests.forEach(function(test) {
        it('correctly adds ' + test.args.length + ' args', function() {
          var res = add.apply(null, test.args);
          assert.equal(res, test.expected);
        });
      });
    });
  ```
  本质上是把it放在循环体中多次调用。

### case的持续时间
  当case的执行时间过长的时候，mocha会在report中显示出来，可以对每个case设置他的持续时间为多少是合理的，超过就会在report中标识为slow.

  ```
  Array
    #indexOf()
      - should return -1 when the value is not present

  slow case
    ✓ resolved after 3 secs (3000ms)


  1 passing (3s)
  1 pending

  ```
  实际中，(3000ms)是红色加亮的。

### case的超时时间
  由于case的执行是串行，为了增强Mocha的可用性，mocha对case采用了超时机制，如果某个case异步的时间过长，mocha就会终止他的执行，开始执行后面的case。

  * 默认的超时时间是2000ms，如果想要修改某case的超时时间可以使用`this.timeout(3000);`
  * 如果在test suite中设置超时时间，那么子test suite以及test case都会继承这个超时时间。
  * hook中也可以指定超时时间
  * 也可以在命令行中指定超时时间：`--timeout 3000`.

### Diff
  在case中抛出任何错误都会被mocha识别会case失败，事实上所有的同步断言库都是这么做的，但是如果抛出的error对象包含exected和actual两个属性，那么在mocha的report中就可以更好的展示错误

### 命令行用法
  只列出常用的参数：
  1. -s 设置slow时间点
  2. -t 设置超时时间
  3. -w 监听test文件改变，重新执行case
  4. --recursive 递归执行test目录下的所有test文件
  5. --delay 延迟执行test case

# TODO 浏览器的测试
