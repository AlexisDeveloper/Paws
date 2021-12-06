import React, {useState,useEffect}  from 'react';
import Main from '../components/Main';
import {Link} from 'react-router-dom';
import Loading from '../components/Loading';
import Avatar from '../components/Avatar';
import Comentar from '../components/Comentar';
import BotonLike from '../components/BotonLike';
import RecursoNoExiste from '../components/RecursoNoExiste';
import Axios from 'axios';

import {toggleLike,comentar} from '../helpers/post-helpers'

export default function PostVista({mostrarError,match,usuario}){
    const postId = match.params.id;
    const [post,setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [postNoExiste, setPostNoExiste] = useState(false);
    const[enviadoLike,setEnviandoLike] = useState(false);

    useEffect(() => {
        async function cargarPost() {
          try {
            const { data: post } = await Axios.get(`/api/posts/${postId}`);
            setPost(post);
            setLoading(false);
          } catch (error) {
            if (
              error.response &&
              (error.response.status === 404 || error.response.status === 400)
            ) {
              setPostNoExiste(true);
            } else {
              mostrarError('Hubo un problema cargando este post.');
            }
            setLoading(false);
          }
        }
        cargarPost();
      }, [postId]);


      async function onSubmitComentario(mensaje){
        const postAcutalizado = await comentar(post,mensaje,usuario);
        setPost(postAcutalizado);
      }

      async function onSubmitLike(){
        if(enviadoLike){
          return;
        }
        try {
          setEnviandoLike(true);
          const postAcutalizado = await toggleLike(post);
          setPost(postAcutalizado);          
          setEnviandoLike(false);

        } catch (error) {
          setEnviandoLike(false);
          mostrarError('Hubo un problema dando tu apoyo intenta de nuevo');
          console.log(error);
          
        }
      }



    if (loading){
        return(
            <Main center> <Loading /> </Main>
        )
    }

  if(post==null){
      return;
  }

    if (postNoExiste) {
        return (
          <RecursoNoExiste mensaje="El post que estas intentando ver no existe" />
        );
      }

    return (
        <Main center>
            <Post {...post} onSubmitComentario={onSubmitComentario} onSubmitLike={onSubmitLike}/>
        </Main>

    );

}

function Post({
    comentarios,
    caption,
    url,
    usuario,
    estaLike,
    onSubmitLike,
    onSubmitComentario
}){
    return(
        <div className="Post">
            <div className="Post__image-container">
                <img src={url} alt={caption} />
            </div>
            <div className="Post__side-bar">
                <Avatar  usuario={usuario}/>
                <div className="Post__comentarios-y-like">
                    <Comentarios usuario={usuario} caption={caption} comentarios={comentarios}></Comentarios>
                    <div className="Post__like">
                        <BotonLike onSubmitLike={onSubmitLike} like={estaLike}></BotonLike>
                    </div>
                    <Comentar onSubmitComentario={onSubmitComentario}></Comentar>
                </div>
            </div>
        </div>
    );

}


function Comentarios({usuario,caption,comentarios}){
    return (
        <ul className="Post__comentarios">
        <li className="Post__comentario">
          <Link
            to={`/perfil/${usuario.username}`}
            className="Post__autor-comentario"
          >
            <b>{usuario.username}</b>
          </Link>{' '}
          {caption}
        </li>
        {comentarios.map(comentario => (
          <li className="Post__comentario" key={comentario._id}>
            <Link
              to={`/perfil/${comentario.usuario.username}`}
              className="Post__autor-comentario"
            >
              <b>{comentario.usuario.username}</b>
            </Link>{' '}
            {comentario.mensaje}
          </li>
        ))}
      </ul>
    );
}