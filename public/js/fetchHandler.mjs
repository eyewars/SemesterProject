"use strict";

export async function sendRequest(url, method, body, token, successFunctions = [], failFunctions = []){
    const requestOptions = {};

    if (method != undefined){
        requestOptions.method = method;
    }

    if (body != undefined){
        requestOptions.body = body;
    }

    if (token != undefined){
        requestOptions.headers = {
            authorization: token
        }
    }

    try {
        const response = await fetch(url, requestOptions);

        const data = await response.json();

        if (response.status != 200) {
            throw new Error("Error " + response.status + ": " + data.message);
        }

        successFunctions.forEach(func => {
            func();
        })

        return data;
    } catch (error) {
        console.error(error);

        failFunctions.forEach(func => {
            func();
        })
    }
}