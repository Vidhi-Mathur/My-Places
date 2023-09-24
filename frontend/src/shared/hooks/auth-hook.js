import { useState, useEffect, useCallback } from "react";
let logoutTimer;

export const useAuth = () => {
    const [token, setToken] = useState(false)
    const [tokenExpiry, setTokenExpiry] = useState()
    const [userId, setUserId] = useState(false)
  
    //For login, expecting a userId,, and setting it while for logout again setting it as null. Along eith userId, now expecting token too
    const login = useCallback((uid, token, expirationDate) => {
                  setToken(token)
                  setUserId(uid)
                  //Generates token expiry as current time + 1hour. Set new if login done through form
                  const expiry = expirationDate || new Date(new Date().getTime() + 1000*60*60)
                  setTokenExpiry(expiry)
                  //Set as key value pair
                  localStorage.setItem('userData', JSON.stringify({userId: uid, token: token, expiry: expiry.toISOString()}))
    },[])
    const logout = useCallback(() => {
                  setToken(null)
                  setTokenExpiry(null)
                  setUserId(null)
                  localStorage.removeItem('userData')
    }, [])
  
      /* This app is rendered as my root component. Whenever this component renders for the first time, we can
  use useEffect() and add a function to it that should check local storage for a token.
  Now, the dependencies of this function will be an empty array, which means this function here will only run once when the component mounts when it rendered for the first time. useEffect() always runs after the render cycle */
  useEffect(() => {
    //Converts JSON strings back to JS objects. Opp. to stringify()
    const storedData = JSON.parse(localStorage.getItem('userData'))
    //Checks if userData with a token exists in local storage and token isn't expired yet
    if(storedData && storedData.token && new Date(storedData.expiry) > new Date()){
      login(storedData.userId, storedData.token, new Date(storedData.expiry))
    }
  }, [login])
  
  //Logout the user once token expires
  useEffect(() => {
      if(token && tokenExpiry){
        const remaining = tokenExpiry.getTime() - new Date().getTime()
        logoutTimer = setTimeout(logout, remaining)
      }
      else {
        //Reset if token changes
        clearTimeout(logoutTimer)
      }
  }, [token, tokenExpiry, logout])

  return {token, login, logout, userId}

}