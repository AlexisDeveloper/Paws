import react,{useState,useEffect} from 'react';
import {Link} from 'react-router-dom';
import Main from '../components/Main';
import Loading from '../components/Loading';
import {ImagenAvantar} from '../components/Avatar';
import Axios from 'axios';
import Grid from '../components/Grid';



export default function Explore({mostrarError}){
const [posts, setPosts] = useState([]);
const [usuarios, setUsuarios] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {

    async function  cargarPostYUsuarios(){
        try {
            const [posts,usuarios] = await Promise.all([
                Axios.get('/api/posts/explore').then(({data})=>data),
                Axios.get('/api/usuarios/explore').then(({data})=>data),
            ]);
            setPosts(posts);
            setUsuarios(usuarios);
            setLoading(false);
            
        } catch (error) {
            mostrarError('Hubo un problema cargando más');
            console.log(error);
            
        }

    }
    
  cargarPostYUsuarios();
}, [])

if(loading){
    return(
        <Main center>
            <Loading/>
        </Main>
    )
}


    return(
        <Main>
           {/* <div className="Explore__section">
               <h2 className="Explore__title">Descubrir usuarios</h2>
               <div className="Explore__usuarios-container">
                   {usuarios.map(usuario => {
                       return (
                           <div className="Explore__usuario" key={usuario._id}>
                               <ImagenAvantar usuario={usuario}></ImagenAvantar>
                               <p>{usuario.username}</p>
                               <Link to={`/perfil/${usuario.username}`}> Ver perfil</Link>
                           </div>
                       )
                   })}
               </div>
           </div> */}

           <div className="Explore__section">
               <h2 className="Explore__title">Ver más casos</h2>
               <Grid posts={posts}/>

           </div>
        </Main>
    );
}