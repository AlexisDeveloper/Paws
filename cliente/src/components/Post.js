import React,{useState} from "react";
import Avatar from '../components/Avatar'
import BotonLike from '../components/BotonLike'
import Comentar from '../components/Comentar'
import {Link} from 'react-router-dom';
import {toggleLike,comentar} from '../helpers/post-helpers'


export default function Post({post,actualizarPost,mostrarError,usuario}){
    const{
        numLikes,
        numComentarios,
        comentarios,
        _id,
        caption,
        url,
        usuario:usuarioDelPost,
        estaLike    
    } = post;
    const[enviadoLike,setEnviandoLike] = useState(false)

    async function onSubmitLike(){
      if(enviadoLike){
        return;
      }
      try {
        setEnviandoLike(true);
        const postAcutalizado = await toggleLike(post);
        actualizarPost(post,postAcutalizado);
        
        setEnviandoLike(false);

        
      } catch (error) {
        setEnviandoLike(false);
        mostrarError('Hubo un problema dando tu apoyo intenta de nuevo');
        console.log(error);
        
      }
    }

    async function onSubmitComentario(mensaje){
      const postAcutalizado = await comentar(post,mensaje,usuario);
      actualizarPost(post,postAcutalizado);
    }

    return(
        <div className="Post-Componente">
            <Avatar usuario={usuarioDelPost}/>
            <img src={url} alt={caption}className="Post-Componente__img" />
            <div className="Post-Componente__acciones">
                <div className="Post-Componente__like-container">
                <BotonLike onSubmitLike={onSubmitLike} like={estaLike}/>
                </div>
                <p>Le importa a {numLikes}</p>
                <ul>
                    <li>
                        <Link to={`/perfil/${usuarioDelPost.username}`}>
                            <b>{usuarioDelPost.username}  </b>
                        </Link>
                        {caption}
                    </li>
                    <VerTodosLosComentarios _id={_id} numComentarios={numComentarios} />
                    <Comentarios comentarios={comentarios}/>
                </ul>
            </div>
            <Comentar onSubmitComentario={onSubmitComentario}></Comentar>
        </div>
    );
}

function VerTodosLosComentarios({ _id, numComentarios }) {
    if (numComentarios < 4) {
      return null;
    }
    return (
      <li className="text-grey-dark">
        <Link to={`/post/${_id}`}>Ver los {numComentarios} comentarios</Link>
      </li>
    );
  }

function Comentarios({ comentarios }) {
    if (comentarios.length === 0) {
      return null;
    }
    return comentarios.map(comentario => {
      return (
        <li key={comentario._id}>
          <Link to={`/perfil/${comentario.usuario.username}`}>
            <b>{comentario.usuario.username}</b>
          </Link>{' '}
          {comentario.mensaje}
        </li>
      );
    });
  }