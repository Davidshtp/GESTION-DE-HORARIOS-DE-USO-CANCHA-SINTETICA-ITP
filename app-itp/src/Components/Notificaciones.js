import salir from "../assets/images/salir.png"
import { useNavigate, useLocation} from "react-router-dom";
import { useEffect, useState } from 'react';
import axios from 'axios';

export function Notificaciones(){
    const [notificaciones, setNotificaciones] = useState([]);
    const history = useNavigate();
    const location=useLocation();
    const id = location.state?.usuarioId;

    useEffect(() => {
        // Llamar a la API para obtener las notificaciones usando Axios
        axios.get(`http://localhost:3001/api/notificaciones/${id}`)
            .then(response => {
                setNotificaciones(response.data); // Asigna las notificaciones al estado
            })
            .catch(error => {
                console.error('Error al obtener las notificaciones:', error);
            });
    }, [id]);

    return(
        <div className="h-full w-full flex justify-center items-center">
            <div className="bg-slate-600 h-[95%] w-[95%]">
                <div className="bg-stone-300 w-full h-[10%] flex items-center">
                    <img
                        src={salir}
                        alt="Imagen de salir"
                        className="w-[2.5%] mr-[3%] ml-[2%] hover:scale-[1.2] transition-transform duration-300 cursor-pointer"
                        onClick={() => {
                            history("/home");
                        }}
                    ></img>
                    <div className="text-2xl font-medium font-mono">Notificaciones</div>
                </div>
                <div className="p-4 overflow-auto h-[88%]">
                    <ul>
                        {notificaciones.length > 0 ? (
                            
                            notificaciones.map(notificacion => (
                                <li key={notificacion.Id} className="bg-white p-2 mb-2 rounded-lg shadow">
                                    {notificacion.mensaje}
                                </li>
                            ))
                        ) : (
                            <li>No tienes notificaciones.</li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
}