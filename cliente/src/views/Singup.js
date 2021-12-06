
import React,{useState} from 'react';
import {Link} from 'react-router-dom';
import Main from'../components/Main'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {faPaw} from '@fortawesome/free-solid-svg-icons'
import ImageHome from '../imagenes/home.png'

export default function Signup({ singup ,mostrarError}){
    const[usuario,setUsuario] = useState(
        {
            email:'',
            username:'',
            password:'',
            bio:'',
            nombre:''
        }
    )
    
    function handleInputChange(e){
        setUsuario({
            ...usuario,
            [e.target.name]: e.target.value
          });    
    }

    async function handleSubmit(e){
        e.preventDefault();
        try{
            await singup(usuario);

        }catch(error){
            mostrarError(error.response.data);
            console.log(error);

        }

    }

    return(
        <Main center={true}>
            <div className="Signup">
                <img src={ImageHome} alt="" className="Signup__img" />
                <div className="FormContainer">
                    <h1 className="Form__titulo">
                        Paw's <FontAwesomeIcon icon={faPaw}/>
                    </h1>
                    <p className="FormContainer__info">
                        Registrate para ayudar en Paw's
                    </p>
                    <form onSubmit={handleSubmit}>
                        <input type="email" className="Form__field"  name="email" placeholder="Email" required onChange={handleInputChange} value={usuario.email}/>
                        <input type="text" className="Form__field"  name="nombre" placeholder="Nombre y apellido" required minLength="3" maxLength="100" onChange={handleInputChange} value={usuario.nombre}/>
                        <input type="text" className="Form__field"  name="username" placeholder="Username" required minLength="3" maxLength="30" onChange={handleInputChange} value={usuario.username}/>
                        <input type="text" className="Form__field"  name="bio" placeholder="Cuentanos de tu mascota" required maxLength="150" onChange={handleInputChange} value={usuario.bio}/>
                        <input type="password" className="Form__field"  name="password" placeholder="Contraseña" required onChange={handleInputChange} value={usuario.password}/>

                        <button className="Form__submit" type="submit">Registrar</button>
                        <p className="FormContainer__info">
                            Tienes una cuenta? <Link to="/login">Iniciar</Link>
                        </p>

                    </form>
                </div>
            </div>
        </Main>
    )
}