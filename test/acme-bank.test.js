// This test case spec contains everything needed to run a full visual test against the ACME bank site.
// It runs the test once locally.
// If you use the Ultrafast Grid, then it performs cross-browser testing against multiple unique browsers.

'use strict';

const {
    VisualGridRunner,
    ClassicRunner,
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

    // Settings to control how tests are run.
    // These could be set by environment variables or other input mechanisms.
    // They are hard-coded here to keep the example project simple.
    const USE_ULTRAFAST_GRID = true;

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
        // This method sets up the configuration for running visual tests.
        // The configuration is shared by all tests in a test suite, so it belongs in a `before` method.
        // If you have more than one test class, then you should abstract this configuration to avoid duplication. 
    
        // Read the Applitools API key from an environment variable.
        // To find your Applitools API key:
        // https://applitools.com/tutorials/getting-started/setting-up-your-environment.html
        applitoolsApiKey = process.env.APPLITOOLS_API_KEY;

        // Read headless mode from an environment variable.
        // Run tests headlessly in CI.
        headless = (process.env.HEADLESS !== undefined ) && (process.env.HEADLESS.toLowerCase() === 'true');

        if (USE_ULTRAFAST_GRID) {
            // Create the runner for the Ultrafast Grid.
            // Concurrency refers to the number of visual checkpoints Applitools will perform in parallel.
            // Warning: If you have a free account, then concurrency will be limited to 1.
            runner = new VisualGridRunner(new RunnerOptions().testConcurrency(5));
        }
        else {
            // Create the classic runner.
            runner = new ClassicRunner();
        }
    
        // Create a new batch for tests.
        // A batch is the collection of visual checkpoints for a test suite.
        // Batches are displayed in the Eyes Test Manager, so use meaningful names.
        const runnerName = (USE_ULTRAFAST_GRID) ? 'Ultrafast Grid' : 'Classic runner';
        batch = new BatchInfo(`Example: Puppeteer JavaScript with the ${runnerName}`);
    
        // Create a configuration for Applitools Eyes.
        config = new Configuration();
        
        // Set the Applitools API key so test results are uploaded to your account.
        // If you don't explicitly set the API key with this call,
        // then the SDK will automatically read the `APPLITOOLS_API_KEY` environment variable to fetch it.
        config.setApiKey(applitoolsApiKey);
    
        // Set the batch for the config.
        config.setBatch(batch);
    
        // If running tests on the Ultrafast Grid, configure browsers.
        if (USE_ULTRAFAST_GRID) {

            // Add 3 desktop browsers with different viewports for cross-browser testing in the Ultrafast Grid.
            // Other browsers are also available, like Edge and IE.
            config.addBrowser(800, 600, BrowserType.CHROME);
            config.addBrowser(1600, 1200, BrowserType.FIREFOX);
            config.addBrowser(1024, 768, BrowserType.SAFARI);
        
            // Add 2 mobile emulation devices with different orientations for cross-browser testing in the Ultrafast Grid.
            // Other mobile devices are available, including iOS.
            config.addDeviceEmulation(DeviceName.Pixel_2, ScreenOrientation.PORTRAIT);
            config.addDeviceEmulation(DeviceName.Nexus_10, ScreenOrientation.LANDSCAPE);
        }
    });

    beforeEach(async function () {
        // This method sets up each test with its own browser and Applitools Eyes objects.

        // Initialize the Puppeteer browser.
        browser = await puppeteer.launch({headless: headless});
        page = await browser.newPage();
        
        // Create the Applitools Eyes object connected to the runner and set its configuration.
        eyes = new Eyes(runner);
        eyes.setConfiguration(config);

        // Open Eyes to start visual testing.
        // It is a recommended practice to set all four inputs:
        await eyes.open(
            
            // The page to "watch."
            page,
            
            // The name of the application under test.
            // All tests for the same app should share the same app name.
            // Set this name wisely: Applitools features rely on a shared app name across tests.
            'ACME Bank',
            
            // The name of the test case for the given application.
            // Additional unique characteristics of the test may also be specified as part of the test name,
            // such as localization information ("Home Page - EN") or different user permissions ("Login by admin").
            this.currentTest.fullTitle(),
            
            // The viewport size for the local browser.
            // Eyes will resize the web browser to match the requested viewport size.
            // This parameter is optional but encouraged in order to produce consistent results.
            new RectangleSize(1200, 600)
        );
    });

    it('should log into a bank account', async function () {
  
        // This test covers login for the Applitools demo site, which is a dummy banking app.
        // The interactions use typical Puppeteer calls,
        // but the verifications use one-line snapshot calls with Applitools Eyes.
        // If the page ever changes, then Applitools will detect the changes and highlight them in the Eyes Test Manager.
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
        await eyes.check('App Window', Target.window().fully().layout());
    });

    afterEach(async function () {

        // Close Eyes to let the server know it should display the results.
        await eyes.close();

        // Close the browser
        await browser.close()
    });

    after(async function () {

        // Close the batch and report visual differences to the console.
        // Note that it forces tests to wait synchronously for all visual checkpoints to complete.
        const results = await runner.getAllTestResults();
        console.log('Visual test results', results);
    });
});
