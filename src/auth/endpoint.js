import axios from "axios";
import { context } from "./Context";
import { useContext } from "react";

let user = JSON.parse(localStorage.getItem("user"));
let token = "";
//if there is user in the localstorage get the token
if (user) {
	token = user.token;
	// console.log(token)
}

// console.log("a",process.env)
// console.log("b",process.env.PUBLIC_URL)
// console.log("c",process.env.REACT_APP_PUBLIC_URL)
// console.log("d",process.env.REACT_APP_BACKEND_URL)
// console.log("e",process.env.NODE_ENV)
const instance = axios.create({
	baseURL: process.env.REACT_APP_BACKEND_URL,
	headers: { Authorization: `${token}` },
});

instance.interceptors.response.use((response) => {
	return response;
});
export default instance;
