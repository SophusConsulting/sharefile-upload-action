const core = require("@actions/core");
const github = require("@actions/github");

const {
	getToken,
	getUploadLink,
	uploadFile,
	createFolder,
} = require("./sharefile");
const fs = require("fs");

async function uploadToShareFile() {
	try {
		const clientID = core.getInput("client-id");
		const clientSecret = core.getInput("client-secret");
		const username = core.getInput("username");
		const password = core.getInput("password");
		const filePath = core.getInput("path-to-file");
		const fileName = core.getInput("file-name");
		let folder = core.getInput("folder-to-upload");
		const newFolderName = core.getInput("new-folder-name");
		const parentID = core.getInput("folder-parent-id");
		const tag = core.getInput("tag");

		const file = await fs.openAsBlob(filePath);

		const token = await getToken(clientID, clientSecret, username, password);
		if (!token) {
			core.setFailed("Authentication failed.");
			return;
		}

		if (newFolderName && parentID) {
			folder = await createFolder(newFolderName, parentID, token);
			if (!folder) {
				core.setFailed("Error creating folder.");
				return;
			}
		}
		core.setOutput("upload-folder-id", folder);

		const fileExtension = filePath.split(".").pop() || "t";
		const uploadName = tag ? `${fileName}_${tag}.${fileExtension}` : fileName;

		const link = await getUploadLink(uploadName, folder, token);
		if (!link) {
			core.setFailed("Error getting upload link.");
			return;
		}

		await uploadFile(file, fileName, link);
	} catch (error) {
		console.log(error);
		core.setFailed(error.message);
	}
}

uploadToShareFile();
