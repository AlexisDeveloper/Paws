import React, {useState,useEffect} from 'react';
import {BrowserRouter as Router,Route,Switch} from'react-router-dom';
import {setToken,deleteToken,getToken,initAxiosInterceptors} from './helpers/auth-helpers'
import Axios from 'axios';
import Nav from './components/Nav';

// Componentes
import Loading from './components/Loading';
import Error from './components/Error';
import Singup from  './views/Singup';
import Login from './views/Login';
import Explore from './views/Explore';

import Upload from './views/upload'
import Feed from './views/Feed'
import Main from './components/Main';
import Post from './views/Post'
import Perfil from './views/Perfil';


initAxiosInterceptors();

export default function App() {
  
  const[usuario,setUsuario] = useState(null); // no sabemos si esta autenticado
  const [cargandoUsuario,setCargandoUsuario] = useState(true);
  
  const [error, setError] = useState(null);

  useEffect(() => {
    async function cargarUsuario(){
      if(!getToken()){
        setCargandoUsuario(false);
        return;
      }
      try {
        const {data:usuario}= await Axios.get('/api/usuarios/whoami');
        setUsuario(usuario);
        setCargandoUsuario(false);
        
      } catch (error) {
        console.log(error);
      }
    }
    cargarUsuario();
  },[]);
  
  async function login (email,password){    
    const { data } = await Axios.post('/api/usuarios/login', {
      email,
      password
    });
    setUsuario(data.usuario);
    setToken(data.token);
    //console.log(data.usuario);

  }
  async function singup (usuario){
    
    const { data } = await Axios.post('/api/usuarios/signup', usuario);
    setUsuario(data.usuario);
    setToken(data.token);
  }

  function logout(){ 

    setUsuario(null);
    deleteToken();

  }
  function mostrarError(mensaje) {
      if (mensaje && mensaje.message) {
      setError(mensaje.message);
      } else {
      setError(mensaje);
}  }

  function esconderError(){
    setError(null);
  }
  if (cargandoUsuario) {
    return (
      <Main center>
        <Loading />
      </Main>
    );
  }
  return(
    <Router>
          <Nav usuario={usuario}/>
          <Error mensaje={error} esconderError={esconderError}></Error>
          {usuario ?(<LoginRoutes mostrarError={mostrarError} usuario={usuario} logout={logout} />):(<LogoutRoutes login={login} singup={singup} mostrarError={mostrarError} />)}          
    </Router> 
  )
}

function LoginRoutes({mostrarError,usuario,logout}){
  return(
    <Switch>

      <Route
        path="/upload/"
        render={props => (
          <Upload {...props}  mostrarError={mostrarError} />
          )}
      />
    
      <Route
        path="/post/:id"
        render={props => (
          <Post {...props}  mostrarError={mostrarError} usuario={usuario} />
          )}
      />

      <Route
        path="/explore"
        render={props => (
          <Explore {...props}  mostrarError={mostrarError} />
          )}
      />

 

        <Route
        path="/perfil/:username"
        render={props => (
          <Perfil
            {...props}
            mostrarError={mostrarError}
            usuario={usuario}
            logout={logout}
          />
        )}
       />
   
      
      <Route
        path="/"
        render={props => (
          <Feed {...props}  mostrarError={mostrarError} usuario={usuario} default />
          )}
      />
    </Switch>
  )

}
function LogoutRoutes({login,singup,mostrarError}){
  return(
    <Switch> 
      {/* <Route path="/login/" render={props =><Login {...props}login={login}></Login>}></Route> */}
      <Route
        path="/login/"
        render={props => (
          <Login {...props} login={login} mostrarError={mostrarError} />
        )}
      />
      {/* <Route render={(props) =><Singup {...props}singup={singup}></Singup>} default></Route> */}
      <Route
        render={props => (
          <Singup {...props} singup={singup} mostrarError={mostrarError} />
        )}
        default
      />
    </Switch>
  )

}
