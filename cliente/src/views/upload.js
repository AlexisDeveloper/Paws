import React,{useState} from 'react';
import Main from '../components/Main';
import Loading from '../components/Loading';
import Axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faUpload} from '@fortawesome/free-solid-svg-icons';

export default function Upload({history,mostrarError}) {
    const [imageUrl,setImageUrl] = useState('');
    const [subiendoImagen,setSubiendoImagen]=useState(false);
    const [enviandoPost,setEnviandoPost] = useState(false);
    const [caption,setCaption]= useState('');
        
    async function handleImagenSeleccionada(evento){
        try {
            setSubiendoImagen(true);
            const file = evento.target.files[0];

            const config={
                headers:{
                    'Content-Type':file.type
                }
            }

            const {data} = await Axios.post	('api/posts/upload',file,config);

            setImageUrl(data.url);
            setSubiendoImagen(false);

            
        } catch (error) {
            setSubiendoImagen(false);
            mostrarError(error.response.data);            
        }
        

    }

    async function handleSubmit(evento){
        evento.preventDefault();
        if (enviandoPost){
                return;
        }
        if (subiendoImagen){
            mostrarError('Un momento, no se ha terminado de subir la publicación');
            return;
        }
        if(!imageUrl){
            mostrarError('Debe cargar una imagen');
            return;
        }

        try {
            setEnviandoPost(true);
            const body = {
              caption,
              url: imageUrl
            };
            await Axios.post('/api/posts', body);
            setEnviandoPost(false);
            history.push('/');
          } catch (error) {
            mostrarError(error.response.data);
          }

    }


    return(
        <Main center>
        <div className="Upload">
            <form onSubmit={handleSubmit}>
                <div className="Upload__image-section">
                    <SeccionSubirImagen imageUrl={imageUrl} subiendoImagen={subiendoImagen} handleImagenSeleccionada={handleImagenSeleccionada}/>
                    
                </div>
                <textarea name="caption" className="Upload__caption" required maxLength="180" 
                placeholder="Describe los detalles y donde lo encontraste" value={caption} 
                onChange={e =>setCaption(e.target.value)}></textarea>
                <button className="Upload__submit" type="submit">Post</button>

            </form>
        </div>
        </Main>
    );
}

function SeccionSubirImagen({subiendoImagen,imageUrl,handleImagenSeleccionada}){
    if(subiendoImagen){
        return <Loading/>;
    }
    else if(imageUrl){
        return <img src={imageUrl} alt=""/>
    }
    else{
        return (
            <label className="Upload__image-label">
                <FontAwesomeIcon icon={faUpload}/> 
                <span>Sube tu foto</span>
                <input type="file"  className="hidden" name="imagen" onChange={handleImagenSeleccionada}/>
            </label>
        )
    }
  
}