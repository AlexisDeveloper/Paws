import React,{useEffect,useState} from 'react';
import {Link} from 'react-router-dom';
import Main from '../components/Main';
import Loading from '../components/Loading';
import Post from '../components/Post'
import Axios from 'axios';

async function cargarPosts(fechaDelUltimoPost){
    const query = fechaDelUltimoPost ? `?fecha=${fechaDelUltimoPost}`:'';
    const {data: nuevosPosts} = await Axios.get(`/api/posts/feed${query}`)
    return nuevosPosts;
}
const NUMERO_DE_POSTS_POR_LLAMADA = 3;

export default function Feed({mostrarError,usuario}){
    const [posts, setPosts] = useState([]);
  const [cargandoPostIniciales, setCargandoPostIniciales] = useState(true);
  const [cargandoMasPosts, setCargandoMasPosts] = useState(false);
  const [todosLosPostsCargados, setTodosLosPostsCargados] = useState(false);

    useEffect(() => {
       async  function cargarPostIniciales(){
           try {
               const nuevosPosts = await cargarPosts();
               setPosts(nuevosPosts);
               console.log(nuevosPosts);
               setCargandoPostIniciales(false);
               revisarSiHayMasPosts(nuevosPosts);
           } catch (error) {
                mostrarError('Opps! acá nada puede malir sal')
                console.log(error);               
           }

       }
       cargarPostIniciales()
       
    }, [])

    function actualizarPost(postOriginal, postActualizado) {
        setPosts(posts => {
          const postsActualizados = posts.map(post => {
            if (post !== postOriginal) {
              return post;
            }
            return postActualizado;
          });
          return postsActualizados;
        });
      }

      async function cargarMasPosts() {
        if (cargandoMasPosts) {
          return;
        }
        try {
          setCargandoMasPosts(true);
          const fechaDelUltimoPost = posts[posts.length - 1].fecha_creado;
          const nuevosPosts = await cargarPosts(fechaDelUltimoPost);
          setPosts(viejosPosts => [...viejosPosts, ...nuevosPosts]);
          setCargandoMasPosts(false);
          revisarSiHayMasPosts(nuevosPosts);
          
        } catch (error) {
          mostrarError('Hubo un problema cargando los siguientes posts.');
          setCargandoMasPosts(false);
        }
      }

      function revisarSiHayMasPosts(nuevosPosts){
          if (nuevosPosts.length < NUMERO_DE_POSTS_POR_LLAMADA ){
              setTodosLosPostsCargados(true);
            }
            

      }

    if (cargandoPostIniciales){
        return(
            <Main center>
                <Loading/>
            </Main>

        )
    }
    if(!cargandoPostIniciales && posts.length==0){
        return <NoSiguesANadie />;
    }
return(
    <Main center>
        <div className="Feed" >
            {
                posts.map(post =>(<Post key={post.id} post={post} actualizarPost={actualizarPost} mostrarError={mostrarError} usuario={usuario}/>))
            }
       <CargarMasPosts onClick={cargarMasPosts} todosLosPostsCargados={todosLosPostsCargados} />
        </div> 
    </Main>

    
);
}

function NoSiguesANadie(){
    return(
        <Main center>
            <div className="NoSiguesANadie">
                <p className="NoSiguesANadie__mensaje">No se han publicado fotos :c</p>
                <div className="text-center">
                    <Link to="/explorer/" className="NoSiguesANadie__boton">Explorar</Link>
                </div>
            </div>
        </Main>
    );
}

function CargarMasPosts({onClick,todosLosPostsCargados}){
    if(todosLosPostsCargados){
        return <div className="Feed__no-hay-mas-posts">No hay más publicaciones</div>
    }
    return(
        <button className="Feed__cargar-mas" onClick={onClick} >Ver más</button>
    )

}