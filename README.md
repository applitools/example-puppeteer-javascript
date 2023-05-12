# Applitools Example: Puppeteer with JavaScript

This is the example project for the [Puppeteer JavaScript tutorial](https://applitools.com/tutorials/quickstart/web/puppeteer).
It shows how to start automating visual tests
with [Applitools Eyes](https://applitools.com/platform/eyes/)
and [Puppeteer](https://pptr.dev/) in JavaScript.

It uses:

* [JavaScript](https://www.javascript.com/) as the programming language
* [Puppeteer](https://pptr.dev/) for browser automation
* [Mocha](https://mochajs.org/) as the core test framework
* [Chromium](https://www.chromium.org/chromium-projects/) as the local browser for testing
* [npm](https://www.npmjs.com/) for dependency management
* [Applitools Eyes](https://applitools.com/platform/eyes/) for visual testing

It can also run tests with:

* [Applitools Ultrafast Grid](https://applitools.com/platform/ultrafast-grid/) for cross-browser execution

To run this example project, you'll need:

1. An [Applitools account](https://auth.applitools.com/users/register), which you can register for free
2. A recent version of [Node.js](https://nodejs.org/en/download/)
3. A good JavaScript editor like [Visual Studio Code](https://code.visualstudio.com/docs/languages/typescript)

To install dependencies, run:

```
npm install
```

When this command installs Puppeteer, it will also automatically install Chromium.

The main test case spec is [`acme-bank.test.js`](test/acme-bank.test.js).
By default, the project will run tests with Ultrafast Grid.
You can change these settings in the test file.

To execute tests, set the `APPLITOOLS_API_KEY` environment variable
to your [account's API key](https://applitools.com/tutorials/guides/getting-started/registering-an-account),
and then run:

```
npm test
```

**For full instructions on running this project, take our
[Puppeteer JavaScript tutorial](https://applitools.com/tutorials/quickstart/web/puppeteer)!**
