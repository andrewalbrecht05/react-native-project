import {Account, Avatars, Client, Databases, ID} from 'react-native-appwrite';
import {ENDPOINT_URL,PLATFORM_NAME,PROJECT_ID,DATABASE_ID,USER_COLLECTION_ID,VIDEO_COLLECTION_ID,STORAGE_ID} from '@env';

export const config = {
	endpoint: ENDPOINT_URL,
	platform: PLATFORM_NAME,
	projectId: PROJECT_ID,
	databaseId: DATABASE_ID,
	userCollectionId: USER_COLLECTION_ID,
	videoCollectionId: VIDEO_COLLECTION_ID,
	storageId: STORAGE_ID,
}
// Init your React Native SDK
const client = new Client();

client
	.setEndpoint(config.endpoint)
	.setProject(config.projectId)
	.setPlatform(config.platform)
;

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export const createUser = async (email, password, username) => {
	try {
		const newAccount = await account.create(
			ID.unique(),
			email,
			password,
			username
		)

		if( !newAccount ) throw Error;

		const avatarUrl = avatars.getInitials(username);

		await signIn(email, password);

		const newUser = await databases.createDocument(
			config.databaseId,
			config.userCollectionId,
			ID.unique(),
			{
				accountId: newAccount.$id,
				email,
				username,
				avatar: avatarUrl
			}
		)
		return newUser;
	} catch (error) {
		console.log(error);
		throw new Error(error);
	}
}

export async function signIn(email, password) {
	try {
		const session = await account.createEmailPasswordSession(email, password);
		return session;
	} catch (error) {
		throw new Error(error)
	}
}

