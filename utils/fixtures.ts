import { test as base } from '@playwright/test';
import { RequestHandler } from '../utils/request-handler';
import { APILogger } from './logger';
import { setCustomExpectLogger } from './custom-expect';
import { config } from '../api-test.config';

export type TestOptions = {
    api: RequestHandler
    config: typeof config
}

export const test = base.extend<TestOptions>({
    api: async ({request}, use) => {
        // const baseUrl = 'https://conduit-api.bondaracademy.com/api'
        const logger = new APILogger();
        setCustomExpectLogger(logger);
        const requestHandler = new RequestHandler(request, config.apiUrl, logger)
        await use(requestHandler);
    },
    config: async({}, use)=>{
        await use(config);
    }
})


// export const test = base.extend<{ api: RequestHandler }>({
//     api: async ({}, use) => {
//         const requestHandler = new RequestHandler()
//         await use(requestHandler);
//     }
// })