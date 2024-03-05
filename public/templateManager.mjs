"use strict";
import { setCanvas } from "./draw.mjs";
import { socket } from "./clientConnect.mjs";

export const container = document.getElementById("container");

const indexTemplate = document.getElementById("indexTemplate");
export const gameTemplate = document.getElementById("gameTemplate");
export const startTemplate = document.getElementById("startTemplate");
const loginTemplate = document.getElementById("loginTemplate");
const registerTemplate = document.getElementById("registerTemplate");
const settingsTemplate = document.getElementById("settingsTemplate");

export function createUI(template){
    container.innerHTML = "";

    const clone = template.content.cloneNode(true);

    container.appendChild(clone);

    if (template == indexTemplate){
        container.querySelector("#loginButton").addEventListener("click", () => {
            createUI(loginTemplate);
        })
        container.querySelector("#registerButton").addEventListener("click", () => {
            createUI(registerTemplate);
        })
    } else if (template == gameTemplate){
        setCanvas(container.querySelector("#canvas"));

        const token = localStorage.getItem("token");
        let id;

        async function getId(){
            const requestOptions = {
                method: "GET",
                headers: {
                    authorization: token,
                }
            }
        
            try {
                let response = await fetch("/game/getId", requestOptions);
        
                if (response.status != 200) {
                    throw new Error("Error: " + response.status);
                }
        
                let data = await response.json();
                id = data.id;
            } catch (error) {
                console.error(error);
            }
        }
        getId();

        container.querySelector("#summonUnitButton").addEventListener("click", () => {
            socket.emit("summon", id);
        });
        
    } else if (template == startTemplate){
        const startGameButton = container.querySelector("#startGameButton");
        const settingsButton = container.querySelector("#settingsButton");

        const token = localStorage.getItem("token");

        startGameButton.addEventListener("click", async () => {
            const requestOptions = {
                method: "POST",
                headers: {
                    authorization: token,
                }
            }
        
            try {
                let response = await fetch("/game", requestOptions);
        
                if (response.status != 200) {
                    console.log("FEIL I START GAME");
                    throw new Error("Error: " + response.status);
                }
        
                let data = await response.json();
                console.log(data.message);
        
                socket.emit("loadGame", data.id);
            } catch (error) {
                console.error(error);
            }
        })

        settingsButton.addEventListener("click", () => {
            createUI(settingsTemplate);
        });
    } else if (template == registerTemplate){
        const registerForm = container.querySelector("#registerForm");
        registerForm.addEventListener("submit", async (event) => {
            event.preventDefault();
        
            const formData = new URLSearchParams(new FormData(registerForm));
        
            const requestOptions = {
                method: "POST",
                body: formData
            }
        
            try {
                let response = await fetch("/user", requestOptions);
        
                if (response.status != 200) {
                    throw new Error("Error: " + response.status);
                }
        
                let data = await response.json();
                console.log(data);
                createUI(indexTemplate);
            } catch (error) {
                console.error(error);
            }
        })
    } else if (template == loginTemplate){
        const loginForm = container.querySelector("#loginForm");
        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();
        
            const formData = new URLSearchParams(new FormData(loginForm));
        
            const requestOptions = {
                method: "POST",
                body: formData
            }
        
            try {
                let response = await fetch("/user/login", requestOptions);
        
                if (response.status != 200) {
                    throw new Error("Error: " + response.status);
                }
        
                let data = await response.json();
                console.log(data.message);
                localStorage.setItem("token", data.token);
                createUI(startTemplate);
            } catch (error) {
                console.error(error);
            }
        })
    } else if (template == settingsTemplate){
        const updateForm = container.querySelector("#updateForm");
        const deleteButton = container.querySelector("#deleteButton");

        const myId = container.querySelector("#myId");
        const myUsername = container.querySelector("#myUsername");
        const myEmail = container.querySelector("#myEmail");

        const token = localStorage.getItem("token");

        async function getUserInfo(){
            
            const requestOptions = {
                method: "GET",
                headers: {
                    authorization: token,
                }
            }

            try {
                let response = await fetch("/user", requestOptions);
        
                if (response.status != 200) {
                    throw new Error("Error: " + response.status);
                }
        
                let data = await response.json();
                
                myId.innerText = "Id: " + data.id;
                myUsername.innerText = "Username: " + data.username;
                myEmail.innerText = "Email: " + data.email;
            } catch (error) {
                console.log(error);
            }
        }
        getUserInfo();

        updateForm.addEventListener("submit", async (event) => {
            event.preventDefault();
        
            const formData = new URLSearchParams(new FormData(updateForm));
        
            const requestOptions = {
                method: "PUT",
                body: formData,
                headers: {
                    authorization: token,
                }
            }
        
            try {
                let response = await fetch("/user", requestOptions);
        
                if (response.status != 200) {
                    throw new Error("Error: " + response.status);
                }
        
                let data = await response.json();
                console.log(data);
                createUI(settingsTemplate);
            } catch (error) {
                console.error(error);
            }
        })

        deleteButton.addEventListener("click", async (event) => {
            event.preventDefault();

            const requestOptions = {
                method: "DELETE",
                headers: {
                    authorization: token,
                }
            }
        
            try {
                let response = await fetch("/user", requestOptions);
        
                if (response.status != 200) {
                    throw new Error("Error: " + response.status);
                }
        
                let data = await response.json();
                console.log(data);
                createUI(indexTemplate);
            } catch (error) {
                console.error(error);
            }
        })
    }
}

async function loadInitialPage(){
    const token = localStorage.getItem("token");

    const requestOptions = {
        method: "GET",
        headers: {
            authorization: token,
        }
    }

    try {
        let response = await fetch("/user/isLoggedIn", requestOptions);

        if (response.status != 200) {
            createUI(indexTemplate);
        }
        else{
            createUI(startTemplate);
        }

    } catch (error) {
        console.error(error);
    }
}
loadInitialPage();