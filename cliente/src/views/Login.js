import React,{useState} from 'react';
import {Link} from 'react-router-dom'
import Main from'../components/Main'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {faPaw} from '@fortawesome/free-solid-svg-icons'

export default function Login({login,mostrarError}){
    const[emailAndPasword,setEmailAndPasword] = useState(
        {
            email:'',           
            password:''            
        }
    )

    function handleInputChange(e){
        setEmailAndPasword({
            ...emailAndPasword,
            [e.target.name]: e.target.value
          });    
    }
    async function handleSubmit(e){
        e.preventDefault();
        try{
           await login(emailAndPasword.email,emailAndPasword.password)

        }catch(error){
            mostrarError(error.response.data);
            console.log(error);

        }

    }

    return(
        <Main center>
            <div className="FormContainer">
                <h1 className="Form__titulo">Paw's <FontAwesomeIcon icon={faPaw}/></h1>
                <div>
                    <form onSubmit={handleSubmit}>
                        <input type="email" className="Form__field"  name="email" placeholder="Email" required onChange={handleInputChange} value={emailAndPasword.email}/>
                        <input type="password" className="Form__field"  name="password" placeholder="Contraseña" required onChange={handleInputChange} value={emailAndPasword.password}/>
                        <button className="Form__submit" type="submit"> Login</button>
                        <p className="FormContainer__info">
                            No tienes una cuenta?<Link to="/signup"> Registrate</Link>
                        </p>
                    </form>
                </div>
            </div>
        </Main>
    )
}