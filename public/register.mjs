const registerForm = document.getElementById("submitRegister");

registerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    testFunc();
    return false;
})

async function testFunc(){
    const response = await fetch("http://localhost:8080/user/0");
    const result = await response.json();

    console.log(result);
}