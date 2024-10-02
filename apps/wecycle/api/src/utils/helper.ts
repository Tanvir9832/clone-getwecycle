// import axios from "axios";
// import { firebase } from "../firebase/index";

import { UserType } from "@tanbel/homezz/types";

// export const verifyGoogleToken = async (token) => {
// 	try {
// 		const { data } = await axios("https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=" + token);
// 		return data;
// 	} catch (error) {
// 		return false;
// 	}
// };

// export const verifyPhoneToken = async (token) => {
// 	try {
// 		const data = firebase.auth().verifyIdToken(token)
// 		return data;
// 	} catch (error) {
// 		console.log(error);
// 		return false;
// 	}
// };

export const parseYupError = (error) => {
	const err = {};
	error.inner.forEach((e) => {
		err[e.path] = e.message;
	});
	return err;
}

export const checkAccess = (userType: UserType[], lookingFor: UserType[]) => {
	return userType.some((type) => lookingFor.includes(type));
}
