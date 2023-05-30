import type { Options } from '@wdio/types'
import { UtamWdioService } from 'wdio-utam-service';
import path from 'path';

// use this remote variable to distinguish decide local vs remote exections
global.remote = process.argv.some(arg => arg === '--remote');

export const config: Options.Testrunner = {
   
    autoCompileOpts: {
        autoCompile: true,
        tsNodeOpts: {
            transpileOnly: true,
            project: 'tsconfig.json'
        }       
    },
    runner: 'local',
    protocol: 'http',
    hostname: '10.10.1.71',
    port: 4444,
    path: '/wd/hub',
    specs: [],    
    exclude: [
    ],
    maxInstances: 5,    
    capabilities: [{

        browserName: 'chrome',
        acceptInsecureCerts: true,
        'selenoid:options': {
            "enableVNC": true,
            "sessionTimeout": "4m"
        },
        'goog:chromeOptions': {
            args: [
                'start-maximized',
                'disable-extensions',
                'disable-popup-blocking',
                'disable-notifications',
                'disable-login-animations'
            ],
            prefs: {
                'profile.default_content_settings.popups': 0,
                'directory_upgrade': true,
                'disable-popup-blocking': true,
                'download.prompt_for_download': false,
                'profile.default_content_setting_values.automatic_downloads': 1,
                'plugins.always_open_pdf_externally': true
            }
        },
    }],    
    logLevel: 'error',
    bail: 0,
    baseUrl: 'http://localhost',
    waitforTimeout: 1_000,
    connectionRetryTimeout: 120_000,
    connectionRetryCount: 3,
    services: [...(global.remote ? [] : ['chromedriver']), ['utam', { implicitTimeout: 0, injectionConfigs: ['salesforce-pageobjects/ui-utam-pageobjects.config.json'] }]],
    framework: 'jasmine',
    reporters: [
        'spec',
        ['allure', {
            outputDir: './allure-results',
            disableWebdriverStepsReporting: true,
            disableWebdriverScreenshotsReporting: false,
            disableMochaHooks: true,
            tmsLinkTemplate: ""
        }],
        ['junit', {
            outputDir: './reports/junit',
            outputFileFormat: function (options: { cid: any; capabilities: { browserName: any; }; }) { // optional
                return `results-${options.cid}-${Date.now()}-${options.capabilities.browserName}.xml`
            },
            errorOptions: {
                error: 'message',
                failure: 'message',
                stacktrace: 'stack'
            }
        }]
    ],
    jasmineOpts: {
        defaultTimeoutInterval: 120_000,
        cleanStack: false,
        expectationResultHandler: async function (passed, assertion) {
            if (!passed) {
                try {
                    const filename = (assertion.error?.message || assertion.message).trim()
                        .replace(/[\r\n"<>:\/\\|?*]/g, ' ').slice(0, 50);
                    await browser.saveScreenshot(`./reports/assertionError_${filename}_${Date.now()}.png`);
                } catch (error) {
                    console.log(error);
                }
            }
        },
    }
}
