# mocha-demos
  记录最开始学习mocha的步骤，例子，以及理解。
  主要包括对官网的翻译，例子的试验，个别不明确的解释，以及额外想到的一些试验和理解。

## Mocha是什么
  mocha是一个功能强大的JavaScript测试框架，可以运行在Node.js和浏览器，支持异步测试。
  mocha是串行执行case，支持灵活的精确的报告。

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
