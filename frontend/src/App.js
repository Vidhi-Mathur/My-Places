import React from 'react';
//Renamed to Router
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
import Users from './users/pages/Users';
import NewPlace from './places/pages/NewPlace'
import {UserPlaces} from './places/pages/UserPlaces';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import UpdatePlace from './places/pages/UpdatePlace';
import Auth from './users/pages/Auth';
import { AuthContext } from './shared/context/auth-context';
import { useAuth } from './shared/hooks/auth-hook';
let routes;

const App = () => {
  //Extract from useAuth hook
  const { token, login, logout, userId } = useAuth()

  //To specify routes for both authenticated and unauthenticated users
  if(token){
    routes = (
      <>
      <Route path="/" element={<Users />}/>
      <Route path="/places/new" element={<NewPlace />}/>
      <Route path='/:userId/places' element={<UserPlaces />}/>
      <Route path='/places/:placeId' element={<UpdatePlace />}/>
      {/* Would always redirect to '/' for all unspecified route */}
      <Route path="*" element={<Navigate to="/" />} />
      </>
    );
  }
  else{
    routes = (
      <>
      <Route path="/" element={<Users />}/>
      <Route path='/:userId/places' element={<UserPlaces />}/>
      <Route path='/users/auth' element={<Auth />} />
      {/* Would always redirect to '/' for all unspecified route */}
      <Route path="*" element={<Navigate to="/users/auth" />} />
      </>
    );
  }
  return (
//Wrapped around what components can use this context. Provider provides initial data to descendant components. It also takes 'value' which binds initial value to a new value, when it changes, all the components that listen to context will re-render
//Key from AuthContext and value we set here. Sharing token as may need to access through other places
  <AuthContext.Provider value={{isLoggedIn: !!token, token: token, userId: userId, login: login, logout: logout}}>
  <Router>
    <MainNavigation />
    <main>
    <Routes>
{/* Wrap routes around route. element prop is used to define component that should be rendered when route's path matches current url.
 Can also used 'component' instead of 'element', but in 'component', react-router-dom will create a new instance of the specified component every time the route is matched. This means that the component's state will be reset on every match.
 In 'element', it will render the provided element directly. This will keep the state of the component persistent as the same instance will be reused for subsequent matches.
In react-router-dom version 5 or earlier, the <Switch> component was used to ensure that only the first matching route is rendered. Once a match was found, the <Switch> would stop further matching and rendering.
However, in version 6, the <Routes> component handles the matching and rendering behavior implicitly, and it only renders the first matching route by default. So, you no longer need to wrap your routes in a <Switch> to achieve the same behavior.
 */}
      {routes}
    </Routes>
    </main>
  </Router>
  </AuthContext.Provider>
  )
}

export default App;