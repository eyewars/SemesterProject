"use strict";
import { setCanvas } from "./draw.mjs";
import { socket } from "./clientConnect.mjs";

export const container = document.getElementById("container");

const indexTemplate = document.getElementById("indexTemplate");
export const gameTemplate = document.getElementById("gameTemplate");
const startTemplate = document.getElementById("startTemplate");
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

        container.querySelector("#spawnFriendButton").addEventListener("click", () => {
            socket.emit("friend");
        });
        container.querySelector("#spawnEnemyButton").addEventListener("click", () => {
            socket.emit("enemy");
        });
    } else if (template == startTemplate){
        const startGameButton = container.querySelector("#startGameButton");
        const settingsButton = container.querySelector("#settingsButton");

        startGameButton.addEventListener("click", async () => {
            const requestOptions = {
                method: "POST"
            }
        
            try {
                let response = await fetch("/game", requestOptions);
        
                if (response.status != 200) {
                    console.log("FEIL I START GAME");
                    throw new Error("Error: " + response.status);
                }
        
                let data = await response.json();
                console.log(data);
        
                socket.emit("loadGame");
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
                localStorage.setItem("tempUserId", data.id);
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

        const id = localStorage.getItem("tempUserId");

        async function getUserInfo(){
            
            const requestOptions = {
                method: "GET"
            }

            try {
                let response = await fetch("/user/" + id, requestOptions);
        
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
                body: formData
            }
        
            try {
                let response = await fetch("/user/" + id, requestOptions);
        
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
            }
        
            try {
                let response = await fetch("/user/" + id, requestOptions);
        
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
createUI(indexTemplate);
