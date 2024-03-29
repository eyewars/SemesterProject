"use strict";
import { setCanvas } from "./draw.mjs";
import { setToken, getToken, removeToken } from "./localStorageHandler.mjs";
import { sendRequest } from "./fetchHandler.mjs";
import { emitLoadGame } from "./socketEmitHandler.mjs";

export const container = document.getElementById("container");

const indexTemplate = document.getElementById("indexTemplate");
export const gameTemplate = document.getElementById("gameTemplate");
const startTemplate = document.getElementById("startTemplate");
const loginTemplate = document.getElementById("loginTemplate");
const registerTemplate = document.getElementById("registerTemplate");
const settingsTemplate = document.getElementById("settingsTemplate");
const queueTemplate = document.getElementById("queueTemplate");
export const gameOverTemplate = document.getElementById("gameOverTemplate");
const offlineTemplate = document.getElementById("offlineTemplate");

const usernameAlert = "Username needs to be between 1 and 12 characters";
const emailAlert = "Invalid E-Mail address";
const passwordAlert = "Password needs to be at least 6 characters";
const loginAlert = "Incorrect email and/or password";
const alreadyExistsAlert = "Username and/or E-Mail already exists";
const deleteConfirm = "Are you sure you want to delete your account?";

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
    } else if (template == startTemplate){
        const startGameButton = container.querySelector("#startGameButton");
        const settingsButton = container.querySelector("#settingsButton");
        
        startGameButton.addEventListener("click", async () => {
            const token = getToken();

            const data = await sendRequest("/game", "POST", undefined, token);

            if (data.id != undefined){
                emitLoadGame(data.id);

                createUI(queueTemplate);
            }
        })

        settingsButton.addEventListener("click", () => {
            createUI(settingsTemplate);
        });
    } else if (template == registerTemplate){
        const registerForm = container.querySelector("#registerForm");
        const registerBackButton = container.querySelector("#registerBackButton");

        registerForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            
            const formData = new URLSearchParams(new FormData(registerForm));

            const username = formData.get("username");
            const email = formData.get("email");
            const password = formData.get("password");

            if (!(username.length >= 1) || !(username.length <= 12)){
                alert(usernameAlert);
                return;
            }

            if (!(email.includes("@")) || ((email.includes(" ")))){
                alert(emailAlert);
                return;
            }

            if (!(password.length >= 6)){
                alert(passwordAlert);
                return;
            }

            const data = await sendRequest("/user/check", "POST", formData);

            if (!data.exists){
                await sendRequest("/user", "POST", formData, undefined, [createUI.bind(null, indexTemplate)]);
            }
            else{
                alert(alreadyExistsAlert);
            }  
        })

        registerBackButton.addEventListener("click", (event) => {
            createUI(indexTemplate);
        }) 
    } else if (template == loginTemplate){
        const loginForm = container.querySelector("#loginForm");
        const loginBackButton = container.querySelector("#loginBackButton");

        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();
        
            const formData = new URLSearchParams(new FormData(loginForm));

            const data = await sendRequest("/user/login", "POST", formData, undefined, [createUI.bind(null, startTemplate)], [alert.bind(null, loginAlert)]);

            setToken(data.token);
        })

        loginBackButton.addEventListener("click", (event) => {
            createUI(indexTemplate);
        }) 
    } else if (template == settingsTemplate){
        const updateForm = container.querySelector("#updateForm");
        const deleteButton = container.querySelector("#deleteButton");
        const logoutButton = container.querySelector("#logoutButton");
        const settingsBackButton = container.querySelector("#settingsBackButton");

        const myId = container.querySelector("#myId");
        const myUsername = container.querySelector("#myUsername");
        const myEmail = container.querySelector("#myEmail");
        const myGames = container.querySelector("#myGames");
        const myWinrate = container.querySelector("#myWinrate");
        const myWins = container.querySelector("#myWins");
        const myLosses = container.querySelector("#myLosses");

        const token = getToken();

        async function getUserInfo(){
            const data = await sendRequest("/user", "GET", undefined, token);

            if (data != undefined){
                myId.innerText = "Id: " + data.id;
                myUsername.innerText = "Username: " + data.username;
                myEmail.innerText = "Email: " + data.email;
                myGames.innerText = "Games: " + data.games;
                if (data.games == 0){
                    myWinrate.innerText = "Winrate: No games played";
                }else{
                    myWinrate.innerText = "Winrate: " + ((data.wins / data.games) * 100).toFixed(1) + "%";
                }
                
                myWins.innerText = "Wins: " + data.wins;
                myLosses.innerText = "Losses: " + data.losses;
            }
        }
        getUserInfo();

        updateForm.addEventListener("submit", async (event) => {
            event.preventDefault();
        
            const formData = new URLSearchParams(new FormData(updateForm));

            const username = formData.get("username");
            const email = formData.get("email");
            const password = formData.get("password");

            if (!(username.length >= 1) || !(username.length <= 12)){
                if (username != ""){
                    alert(usernameAlert);
                    return;   
                }  
            }

            if (!(email.includes("@")) || ((email.includes(" ")))){
                if (email != ""){
                    alert(emailAlert);
                    return;
                }
            }

            if (!(password.length >= 6)){
                if (password != ""){
                    alert(passwordAlert);
                    return;    
                }
            }

            const data = await sendRequest("/user/check", "POST", formData);

            if (!data.exists){
                await sendRequest("/user", "PUT", formData, token, [createUI.bind(null, settingsTemplate)]);
            }
            else{
                alert(alreadyExistsAlert);
            }   
        })

        logoutButton.addEventListener("click", (event) => {
            removeToken();

            createUI(indexTemplate);
        })

        deleteButton.addEventListener("click", async (event) => {
            event.preventDefault();

            if (confirm(deleteConfirm)){
                await sendRequest("/user", "DELETE", undefined, token, [createUI.bind(null, indexTemplate), removeToken]);
            }
        })

        settingsBackButton.addEventListener("click", (event) => {
            createUI(startTemplate);
        }) 
    } else if (template == queueTemplate){
        const queueBackButton = container.querySelector("#queueBackButton");

        queueBackButton.addEventListener("click", async () => {
            const token = getToken();

            await sendRequest("/game", "GET", undefined, token, [createUI.bind(null, startTemplate)]);
        }) 
    } else if (template == gameOverTemplate){
        const gameOverMenuButton = container.querySelector("#gameOverMenuButton");

        gameOverMenuButton.addEventListener("click", (event) => {
            createUI(startTemplate);
        }) 
    } else if (template == offlineTemplate){

    }
}

async function loadInitialPage(){
    const token = getToken();

    const data = await sendRequest("/user/isLoggedIn", "GET", undefined, token, [createUI.bind(null, startTemplate)], [createUI.bind(null, indexTemplate)]);

    setToken(data.token);
}

async function isOnline(){
    if (navigator.onLine){
        loadInitialPage();
    }
    else {
        createUI(offlineTemplate);
    }
}

isOnline();