const core = require("@actions/core");
const github = require("@actions/github");

const { authenticate, getUploadLink, uploadFile } = require("./sharefile");
const fs = require("fs");

async function uploadToShareFile() {
	try {
		// const clientID= core.getInput('client-name');
		// const clientSecret = core.getInput('client-secret');
		// const username = core.getInput('username');
		// const password = core.getInput('password');
		// const file = core.getInput('file-to-upload');
		// const fileName = core.getInput('file-name');
		// const folder = core.getInput('folder-to-upload');

		const clientID = "R50umZYpGdPSuJBYBaURYBaYJPfSGjz2";
		const clientSecret = "ioTYqA1wTiSdy074Wi2r9eLylP5itCfvnjLFOP0bcOXWapxX";
		const username = "asamuel@sophusconsulting.com";
		const password = "mmyt qmln nzee 2trq";
		const file = await fs.openAsBlob("./pdf-test.pdf");
		const fileName = "pdf-test.pdf";
		console.log("file", file);
		const folder = "fod1458a-d2ec-43d3-bf68-4430e3b48011";

		const auth = await authenticate(clientID, clientSecret, username, password);
		const token = auth.access_token;

		console.log("token", token);
		const uploadLocation = await getUploadLink(file, fileName, folder, token);
		const link = uploadLocation.ChunkUri;
		console.log("link", link);
		const response = await uploadFile(file, fileName, link);
		console.log("response", response);
	} catch (error) {
		console.log(error);
		core.setFailed(error.message);
	}
}

uploadToShareFile();
