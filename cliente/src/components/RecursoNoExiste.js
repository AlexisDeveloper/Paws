import React from 'react';
import {Link} from 'react-router-dom';
import Main from '../components/Main';

export default function RecursoNoExiste({mensaje}){
    return(
        <Main center>
                <h2 className="RecursoNoExiste__mensajee" >
                    {mensaje}
                </h2>
                <p className="RecursoNoExiste__link-container">
                    Ir al <Link to="/">inicio</Link>

                </p>
        </Main>
    );

}