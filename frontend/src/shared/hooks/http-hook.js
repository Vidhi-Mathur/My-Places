import { useState, useCallback, useRef, useEffect } from "react";

//Handles all data parsing, response status code checking and state management logic.
export const useHttpClient = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState()

//useRef is best for handling data that does not need rendering. Also, useRef will not re-render for any change it will have.
    const activeHttpRequests = useRef([])

    //Takes url, method, which is by default 'GET', body is initially null and headers being an empty object
    //Using callback so that this function isn't recreated when component using this hook rerenders
    const sendRequest = useCallback(async(url, method='GET', body=null, headers={}) => {
        setIsLoading(true)
        const httpAbortCtrl = new AbortController()
        activeHttpRequests.current.push(httpAbortCtrl)
        try{
        //Send to a url with configurations
        const response = await fetch(url, {
            method,
            body,
            headers,
            //Links support controller to requests, and now this abort controller to cancel connect request
            signal: httpAbortCtrl.signal
        })
        //This also returns a new promise, so await this as well
        const responseData = await response.json()

        //To clear abort controllers that belong to request just completed
        activeHttpRequests.current = activeHttpRequests.current.filter(
            reqCtrl => reqCtrl !== httpAbortCtrl
        )
/*While signing in for an existing user, we were still redirected as even if we got 400/ 500 like error code from the backend, it still treats it as not an error because technically you have no error, but back a response for a request send. So after we parsing, we want to check if response is 'ok'. Its a property exists on the response object and it will be true if we have a 200 status code*/
        if(!response.ok){
          //This would make to catch block
          throw new Error(responseData.message)
        }
        setIsLoading(false)
        //Return response data so that component that uses our hook can handle data
        return responseData
        }
        catch (err){
            if (err.message !== 'The user aborted a request.') {
                setError(err.message)
                setIsLoading(false)
                throw err
            }
        }
    }, [])

    const clearError = () => {
        setError(null)
    }

    //Clean up function to never continue with request cancelled
    useEffect(() => {
        return () => {
            activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort())
        }
    }, [])

    return {isLoading, error, sendRequest, clearError}
}