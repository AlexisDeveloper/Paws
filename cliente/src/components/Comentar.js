import React, { useState } from 'react';

export default function Comentar({onSubmitComentario,mostrarError}){
    const [mensaje,setMensaje]=useState('');
    const [enviadoComentario, setEnviandoComentario] = useState(false)

    async function onSubmit(e){
        e.preventDefault();

        if  (enviadoComentario){
            return;
        }
        try {
            setEnviandoComentario(true);
            await onSubmitComentario(mensaje);
            setMensaje('');
            setEnviandoComentario(false);
        } catch (error) {
            setEnviandoComentario(false);
            mostrarError('Hubo un problema guardando el comentario, intente de nuevo');
            
        }
    }

    return(
        <form className="Post__comentario-form-container" onSubmit={onSubmit}>
            <input type="text" className="" placeholder="Deja información" required maxLength="180" value={mensaje} onChange={e => setMensaje(e.target.value)}/>

            <button type="submit">Post</button>

        </form>
    )
}