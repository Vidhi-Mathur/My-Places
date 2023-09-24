//Context allows to share data between components without having to manually pass props down the component tree. Solve the problem of prop drilling, which occurs when you need to pass data through multiple levels of components without using explicit props for each intermediate component.
import { createContext } from "react";

//islogged in is a property here, initially false, and login and logout as methods
export const AuthContext = createContext({
    isLoggedIn: false,
    userId: null, 
    token: null,
    login: () => {}, 
    logout: () => {}
})