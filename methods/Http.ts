import {recordToArray} from "./Javascript"
import {Require} from "../types/Basic"

// import * as nodeFetch from "node-fetch"


function parseParameters(parameters?: Record<string, string>): string {
    if (parameters === undefined) return ""
    if (Object.values(parameters).length === 0) {
        return ""
    } else {
        return "?" + recordToArray(parameters, (key, value) => `${key}=${value}`).join("&")
    }
}

type SpecificHttpRequest = Omit<HttpRequest, "method">
type HttpGetRequest = Omit<SpecificHttpRequest, "body">
type HttpPostRequest = Require<SpecificHttpRequest, "body">

export interface HttpResponse {
    status: number | undefined
    text: () => Promise<string>
    arrayBuffer: () => Promise<ArrayBuffer>
}

// interface HttpResponse {
//     text: string
//     status: number | undefined
// }

// async function performGetRequest(url: string): Promise<HttpResponse> {
//     if (typeof window !== "undefined") {
//         // code to run in a browser environment
//         try {
//             const response = await fetch(url);
//             return {
//                 status: response.status,
//                 text: async () => response.text(),
//                 arrayBuffer: async () => response.arrayBuffer(),
//             };
//         } catch (error) {
//             console.error(error);
//             throw error;
//         }
//     } else {
//         // code to run in a Node.js environment
//         return new Promise((resolve, reject) => {
//             https.get(url, (response) => {
//                 let data = "";
//                 response.on("data", (chunk) => {
//                     data += chunk;
//                 });
//                 response.on("end", () => {
//                     try {
//                         resolve({
//                             status: response.statusCode,
//                             text: async () => Promise.resolve(data),
//                             arrayBuffer: async () =>
//                                 Promise.resolve(Buffer.from(data).buffer),
//                         });
//                     } catch (error) {
//                         reject(error);
//                     }
//                 });
//             }).on("error", (error) => {
//                 reject(error);
//             });
//         });
//     }
// }


export async function httpGet(request: HttpGetRequest): Promise<Response> {
    return httpCall({...request, method: "GET"})
}


export async function httpPost(request: HttpPostRequest): Promise<Response> {
    return httpCall({...request, method: "POST"})
}

// Tests can set this to node-fetch because they run on Node.js
export const fetcher: { fetch: (input: (RequestInfo | URL), init?: RequestInit) => Promise<Response> } = {
    fetch: typeof window !== "undefined" ? fetch : () => {
        throw new Error("Fetcher must be set in test")
    }
}

async function httpCall(request: HttpRequest): Promise<Response> {
    const actualUrl = request.url + parseParameters(request.parameters)

    const requestObject: RequestInit = {
        method: request.method,
        body: request.body,
        headers: request.headers,
        mode: "cors"
    }

    return typeof window !== "undefined" ? fetch(actualUrl, requestObject) : fetcher.fetch(actualUrl, requestObject)
}

interface HttpRequest {
    url: string
    method: string
    parameters?: Record<string, string>
    headers?: Record<string, string>
    // noCache?: boolean
    body?: BodyInit
}