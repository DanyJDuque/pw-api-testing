import { request } from "@playwright/test";
import { config } from "../api-test.config";
import { APILogger } from "../utils/logger";
import { RequestHandler } from "../utils/request-handler";

export async function createToken(email: string, password: string) {
    const context = await request.newContext()
    const logger = new APILogger();
    const api = new RequestHandler(context, config.apiUrl, logger)


    try {
        const tokenResponse = await api
            .path('/users/login')
            .body({ "user": { "email": email, "password": password } })
            .postRequest(200);

        return 'Token ' + tokenResponse.user.token;
    } catch (error) {
        Error.captureStackTrace(error as Error, createToken)
        throw error
    } finally {
        await context.dispose()
    }
}



// // esta es la manera facil de crear el token usando la dependeincia de la API RequestHandler
// export async function createToken(api: RequestHandler, email: string, password: string) {
//     const tokenResponse = await api
//         .path('/users/login')
//         .body({ "user": { "email": email, "password": password } })
//         .postRequest(200);
//     return tokenResponse.user.token;
// }