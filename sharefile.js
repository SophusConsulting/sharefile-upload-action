async function authenticate(clientID, clientSecret, username, password) {
	// Authenticate with ShareFile
	const myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

	const urlencoded = new URLSearchParams();
	urlencoded.append("grant_type", "password");
	urlencoded.append("client_id", clientID);
	urlencoded.append("client_secret", clientSecret);
	urlencoded.append("username", username);
	urlencoded.append("password", password);

	const requestOptions = {
		method: "POST",
		headers: myHeaders,
		body: urlencoded,
		redirect: "follow",
	};

	try {
		const response = await fetch(
			"https://sophusconsulting.sharefile.com/oauth/token",
			requestOptions
		);
		const token = await response.json();
		return token;
	} catch (error) {
		console.log("error", error);
	}
}

async function getUploadLink(file, fileName, folder, token) {
	const myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
	myHeaders.append("Authorization", `Bearer ${token}`);

	const urlencoded = new URLSearchParams();
	urlencoded.append("Method", "standard");
	urlencoded.append("Raw", "false");
	urlencoded.append("FileName", fileName);

	const requestOptions = {
		method: "POST",
		headers: myHeaders,
		body: urlencoded,
		redirect: "follow",
	};

	try {
		const data = await fetch(
			`https://sophusconsulting.sharefile.com/sf/v3/Items(${folder})/Upload `,
			requestOptions
		);
		const response = await data.json();
		return response;
	} catch (error) {
		console.log(error);
	}
}

async function uploadFile(file, fileName, link) {
	const formdata = new FormData();

	formdata.append("filedata", file, fileName);

	const requestOptions = {
		method: "POST",
		body: formdata,
		redirect: "follow",
	};

	try {
		const response = await fetch(link, requestOptions);
		return response.text();
	} catch (error) {
		console.log(error);
	}
}

module.exports = {
	authenticate,
	uploadFile,
	getUploadLink,
};
