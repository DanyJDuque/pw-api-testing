import { APIRequestContext, test } from "@playwright/test"
import { APILogger } from "./logger"


export class RequestHandler {

    private request: APIRequestContext
    private logger: APILogger
    private baseUrl: string | undefined
    private defaultBaseUrl: string
    private apiPath: string = ''
    private queryParams: object = {}
    private apiHeaders: Record<string, string> = {}
    private apiBody: object = {}
    private defaultAuthToken: string
    private clearAuthFlag: boolean | undefined


    constructor(request: APIRequestContext, apiBaseUrl: string, logger: APILogger, authToken: string = "") {
        this.request = request
        this.defaultBaseUrl = apiBaseUrl
        this.logger = logger
        this.defaultAuthToken = authToken
    }

    url(url: string) {
        this.baseUrl = url
        return this
    }

    path(path: string) {
        this.apiPath = path
        return this
    }

    params(params: object) {
        this.queryParams = params
        return this
    }

    headers(headers: Record<string, string>) {
        this.apiHeaders = headers
        return this
    }

    body(body: object) {
        this.apiBody = body
        return this
    }

    clearAuth() {
        this.clearAuthFlag = true
        return this
    }

    async getRequest(statusCode: number) {
        let responseJSON: any

        const url = this.getURL()
        await test.step(`Get request to: ${url}`, async () => {
            this.logger.logRequest('GET', url, this.getHeaders())
            const response = await this.request.get(url, {
                headers: this.getHeaders()
            })
            this.cleanUpFields()
            const actualStatus = response.status()
            responseJSON = await response.json()

            this.logger.logResponse(actualStatus, responseJSON)
            this.statusCodeValidator(actualStatus, statusCode, this.getRequest)
        })

        return responseJSON
    }

    async postRequest(statusCode: number) {
        let responseJSON: any

        const url = this.getURL()
        await test.step(`POST request to: ${url}`, async () => {
            this.logger.logRequest('POST', url, this.getHeaders(), this.apiBody)
            const response = await this.request.post(url, {
                headers: this.getHeaders(),
                data: this.apiBody
            })
            this.cleanUpFields()
            const actualStatus = response.status()
            responseJSON = await response.json()

            this.logger.logResponse(actualStatus, responseJSON)
            this.statusCodeValidator(actualStatus, statusCode, this.postRequest)
            // expect(actualStatus).toEqual(statusCode)
        })
        return responseJSON
    }

    async putRequest(statusCode: number) {
        let responseJSON: any

        const url = this.getURL()
        await test.step(`PUT request to: ${url}`, async () => {
            this.logger.logRequest('PUT', url, this.getHeaders(), this.apiBody)
            const response = await this.request.put(url, {
                headers: this.getHeaders(),
                data: this.apiBody
            })
            this.cleanUpFields()
            const actualStatus = response.status()
            responseJSON = await response.json()

            this.logger.logResponse(actualStatus, responseJSON)
            this.statusCodeValidator(actualStatus, statusCode, this.putRequest)
            // expect(actualStatus).toEqual(statusCode)
        })
        return responseJSON
    }

    async deleteRequest(statusCode: number) {
        const url = this.getURL()
        await test.step(`DELETE request to: ${url}`, async () => {
            this.logger.logRequest('DELETE', url, this.getHeaders())
            const response = await this.request.delete(url, {
                headers: this.getHeaders(),
            })
            this.cleanUpFields()
            const actualStatus = response.status()
            this.logger.logResponse(actualStatus)
            this.statusCodeValidator(actualStatus, statusCode, this.deleteRequest)
            // expect(actualStatus).toEqual(statusCode)
        })
    }

    private getURL() {
        const url = new URL(`${this.baseUrl ?? this.defaultBaseUrl}${this.apiPath}`)
        for (const [key, value] of Object.entries(this.queryParams)) {
            url.searchParams.append(key, String(value))
        }
        return url.toString()
    }

    private statusCodeValidator(actualStatus: number, expectStatus: number, callingMethod: Function) {
        if (actualStatus !== expectStatus) {
            const logs = this.logger.getRecentLogs()
            const error = new Error(`Expected status ${expectStatus} but go ${actualStatus}\n\nRecent API Activity: \n${logs}`)
            Error.captureStackTrace(error, callingMethod)
            throw error
        }
    }

    private getHeaders() {
        if (!this.clearAuthFlag) {
            this.apiHeaders['Authorization'] = this.apiHeaders['Authorization'] || this.defaultAuthToken
        }
        return this.apiHeaders
    }

    private cleanUpFields() {
        this.apiPath = ''
        this.queryParams = {}
        this.apiHeaders = {}
        this.apiBody = {}
        this.baseUrl = undefined
        this.clearAuthFlag = false
    }
}