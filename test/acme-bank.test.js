'use strict';

const {
    VisualGridRunner,
    RunnerOptions,
    Eyes,
    Target,
    Configuration,
    RectangleSize,
    BatchInfo,
    BrowserType,
    DeviceName,
    ScreenOrientation
} = require('@applitools/eyes-puppeteer');

const puppeteer = require('puppeteer')

describe('ACME BANK', function () {
    // This test case contains everything needed to run a full visual test against the ACME bank site.
    // It runs the test once locally,
    // and then it performs cross-browser testing against multiple unique browsers in Applitools Ultrafast Grid.

    // Test control inputs to read once and share for all tests
    var applitoolsApiKey;
    var headless;

    // Applitools objects to share for all tests
    let batch;
    let config;
    let runner;

    // Test-specific objects
    let browser;
    let page;
    let eyes;

    before(async function () {
        // This method sets up the configuration for running visual tests in the Ultrafast Grid.
        // The configuration is shared by all tests in a test suite, so it belongs in a `before` method.
        // If you have more than one test class, then you should abstract this configuration to avoid duplication. 
    
        // Read the Applitools API key from an environment variable.
        // To find your Applitools API key:
        // https://applitools.com/tutorials/getting-started/setting-up-your-environment.html
        applitoolsApiKey = process.env.APPLITOOLS_API_KEY;

        // Read headless mode from an environment variable.
        // Run tests headlessly in CI.
        headless = (process.env.HEADLESS !== undefined ) && (process.env.HEADLESS.toLowerCase() === 'true');
    
        // Create the runner for the Ultrafast Grid.
        // Concurrency refers to the number of visual checkpoints Applitools will perform in parallel.
        // Warning: If you have a free account, then concurrency will be limited to 1.
        runner = new VisualGridRunner(new RunnerOptions().testConcurrency(5));
    
        // Create a new batch for tests.
        // A batch is the collection of visual checkpoints for a test suite.
        // Batches are displayed in the dashboard, so use meaningful names.
        batch = new BatchInfo('Applitools Example: Puppeteer JavaScript with the Ultrafast Grid');
    
        // Create a configuration for Applitools Eyes.
        config = new Configuration();
        
        // Set the Applitools API key so test results are uploaded to your account.
        // If you don't explicitly set the API key with this call,
        // then the SDK will automatically read the `APPLITOOLS_API_KEY` environment variable to fetch it.
        config.setApiKey(applitoolsApiKey);
    
        // Set the batch for the config.
        config.setBatch(batch);
    
        // Add 3 desktop browsers with different viewports for cross-browser testing in the Ultrafast Grid.
        // Other browsers are also available, like Edge and IE.
        config.addBrowser(800, 600, BrowserType.CHROME);
        config.addBrowser(1600, 1200, BrowserType.FIREFOX);
        config.addBrowser(1024, 768, BrowserType.SAFARI);
    
        // Add 2 mobile emulation devices with different orientations for cross-browser testing in the Ultrafast Grid.
        // Other mobile devices are available, including iOS.
        config.addDeviceEmulation(DeviceName.Pixel_2, ScreenOrientation.PORTRAIT);
        config.addDeviceEmulation(DeviceName.Nexus_10, ScreenOrientation.LANDSCAPE);
    });

    beforeEach(async function () {
        // This method sets up each test with its own ChromeDriver and Applitools Eyes objects.
        // Even though this test will run visual checkpoints on different browsers in the Ultrafast Grid,
        // it still needs to run the test one time locally to capture snapshots.

        // Initialize the Puppeteer browser.
        browser = await puppeteer.launch({headless: headless});
        page = await browser.newPage();
        
        // Create the Applitools Eyes object connected to the runner and set its configuration.
        eyes = new Eyes(runner);
        eyes.setConfiguration(config);

        // Open Eyes to start visual testing.
        // It is a recommended practice to set all four inputs:
        await eyes.open(
            page,                               // The page to "watch"
            'ACME Bank',                        // The name of the app under test
            this.currentTest.fullTitle(),       // The name of the test case
            new RectangleSize(1024, 768)        // The viewport size for the local browser
        );
    });

    it('should log into a bank account', async function () {
  
        // This test covers login for the Applitools demo site, which is a dummy banking app.
        // The interactions use typical Puppeteer calls,
        // but the verifications use one-line snapshot calls with Applitools Eyes.
        // If the page ever changes, then Applitools will detect the changes and highlight them in the dashboard.
        // Traditional assertions that scrape the page for text values are not needed here.

        // Load the login page.
        await page.goto('https://demo.applitools.com');

        // Verify the full login page loaded correctly.
        await eyes.check('Login Window', Target.window().fully());

        // Perform login.
        await page.type('#username', 'andy');
        await page.type('#password', 'i<3pandas');
        await page.click("#log-in");

        // Verify the full main page loaded correctly.
        // This snapshot uses LAYOUT match level to avoid differences in closing time text.
        await eyes.check('App Window', Target.window().fully());
    });

    afterEach(async function () {

        // Close Eyes to let the server know it should display the results.
        await eyes.close();

        // Close the browser
        await browser.close()

        // we pass false to this method to suppress the exception that is thrown if we
        // find visual differences
        const results = await runner.getAllTestResults(false);
        console.log(results);
    });

    after(async function () {

        // Close the batch and report visual differences to the console.
        // Note that it forces tests to wait synchronously for all visual checkpoints to complete.
        const results = await runner.getAllTestResults();
        console.log('Visual test results', results);
    });
});
