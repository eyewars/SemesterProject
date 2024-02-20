"use strict";
/*
const registerForm = container.getElementById("registerForm");
const updateForm = container.getElementById("updateForm");
const getForm = container.getElementById("getForm");
const deleteForm = container.getElementById("deleteForm");
const allUsersButton = container.getElementById("getAllUsers");

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
			console.log("FEIL I REGISTRERINGEN");
			throw new Error("Error: " + response.status);
		}

		let data = await response.json();
		console.log(data);
	} catch (error) {
		console.log(error);
	}
})

updateForm.addEventListener("submit", async (event) => {
	event.preventDefault();

	const formData = new URLSearchParams(new FormData(updateForm));

	const requestOptions = {
		method: "PUT",
		body: formData
	}

	try {
		let response = await fetch("/user/" + formData.get("id"), requestOptions);

		if (response.status != 200) {
			console.log("FEIL I OPPDATERINGEN");
			throw new Error("Error: " + response.status);
		}

		let data = await response.json();
		console.log(data);
	} catch (error) {
		console.log(error);
	}
})

getForm.addEventListener("submit", async (event) => {
	event.preventDefault();

	const formData = new URLSearchParams(new FormData(getForm));

	const requestOptions = {
		method: "GET"
	}

	try {
		let response = await fetch("/user/" + formData.get("id"), requestOptions);

		if (response.status != 200) {
			console.log("FEIL I SØKINGEN");
			throw new Error("Error: " + response.status);
		}

		let data = await response.json();
		console.log(data);
	} catch (error) {
		console.log(error);
	}
})

deleteForm.addEventListener("submit", async (event) => {
	event.preventDefault();

	const formData = new URLSearchParams(new FormData(deleteForm));

	const requestOptions = {
		method: "DELETE"
	}

	try {
		let response = await fetch("/user/" + formData.get("id"), requestOptions);

		if (response.status != 200) {
			console.log("FEIL I SLETTINGEN");
			throw new Error("Error: " + response.status);
		}

		let data = await response.json();
		console.log(data);
	} catch (error) {
		console.log(error);
	}
})

allUsersButton.addEventListener("click", async (event) => {
	const requestOptions = {
		method: "GET"
	}

	try {
		let response = await fetch("/user", requestOptions);

		if (response.status != 200) {
			console.log("FEIL I GET ALL");
			throw new Error("Error: " + response.status);
		}

		let data = await response.json();
		console.log(data);
	} catch (error) {
		console.log(error);
	}
})
*/