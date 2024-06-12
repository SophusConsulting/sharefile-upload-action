const core = require("@actions/core");
const github = require("@actions/github");

const { getToken, getUploadLink, uploadFile } = require("./sharefile");
const fs = require("fs");

async function uploadToShareFile() {
	try {
		const clientID = core.getInput("client-name");
		const clientSecret = core.getInput("client-secret");
		const username = core.getInput("username");
		const password = core.getInput("password");
		const filePath = core.getInput("path-to-file");
		const fileName = core.getInput("file-name");
		const folder = core.getInput("folder-to-upload");

		const file = await fs.openAsBlob("filePath");

		const token = await getToken(clientID, clientSecret, username, password);

		const link = await getUploadLink(file, fileName, folder, token);
		const response = await uploadFile(file, fileName, link);
		console.log(response);
	} catch (error) {
		console.log(error);
		core.setFailed(error.message);
	}
}

uploadToShareFile();
