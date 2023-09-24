import React, { useEffect, useState } from 'react'
import UserList from '../components/UserList'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import { useHttpClient } from '../../shared/hooks/http-hook'

const Users = () => {
  const [loadedUsers, setLoadedUsers] = useState()
  const {isLoading, error, sendRequest, clearError} = useHttpClient()
    //The request is send whenever component rerenders(like response data is received or something on page changes), creating infinite loop. Hence, we useEffect() hook that allows us to run a certain code only when certain dependencies change. Using async directly with useEffect() isn't recommended. Hence, we created a immediately executing function having fetch command
    useEffect(() => {
//Default type for fetch() request is GET. Also, don't need to add a content type header because we're not attaching any data, we're not attaching any content to the outgoing request, and we also therefore don't need to attach anybody.
      const fetchUsers = async() => {
        try{
          const responseData = await sendRequest(process.env.REACT_APP_URL + '/users')
          //In backend, we expect users[] as response in res.json
          setLoadedUsers(responseData.users)
        }
        catch (err){  
          
        }
      }
      fetchUsers()
    }, [sendRequest])

    return (
      <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <div className='center'><LoadingSpinner /></div>}
     {/* Users() passed items props having USERS[] to UserList component
     Loaded only if not loaded and users exist */}
      {!isLoading && loadedUsers && <UserList items={loadedUsers}/>}
      </>
    )
}

export default Users