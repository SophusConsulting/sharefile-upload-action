const core = require("@actions/core");

async function getToken(clientID, clientSecret, username, password) {
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

		if (response.status !== 200) {
			console.log("Error getting auth token:", response.statusText);
			return null;
		}

		const auth = await response.json();
		const token = auth.access_token;
		console.log("Auth Token successfully retrieved");
		return token;
	} catch (error) {
		console.log("Error getting auth token:", error);
	}
}

async function getUploadLink(fileName, folder, token) {
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

	console.log("Getting upload link for ", fileName, " in folder ", folder);

	try {
		const data = await fetch(
			`https://sophusconsulting.sharefile.com/sf/v3/Items(${folder})/Upload`,
			requestOptions
		);
		const response = await data.json();

		if (data.status !== 200) {
			console.log("Error getting upload link:", response.message);
			return null;
		}

		const link = response.ChunkUri;
		console.log("Upload link successfully retrieved", link);

		return link;
	} catch (error) {
		console.log("Error getting upload link:", error);
		core.setFailed("Error getting upload link: ", error);
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
		if (response.status !== 200) {
			console.log("Error uploading file:", response.statusText);
			core.setFailed("Error uploading file: ", response.statusText);
		}

		const responseText = await response.text();
		console.log("File successfully uploaded: ", responseText);
		return responseText;
	} catch (error) {
		console.log("Error uploading file:", error);
		core.setFailed("Error uploading file: ", error);
	}
}

module.exports = {
	getToken,
	uploadFile,
	getUploadLink,
};
