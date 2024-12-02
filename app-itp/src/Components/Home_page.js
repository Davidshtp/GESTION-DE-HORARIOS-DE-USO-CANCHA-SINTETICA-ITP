//Se importan los componentes y herramientas que se usaran en este modulo
import avatar from "../assets/images/avatar.png"
import flecha from "../assets/images/flecha.png"
import salir from "../assets/images/salir.png"
import { useNavigate} from "react-router-dom";
import { Calendario } from "./Calendar";
import { useState, useEffect } from "react";
import axios from "axios";
import { useCallback } from 'react';
import Swal from 'sweetalert2';


export function HomePage(){
    const [userRole, setUserRole] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);
    const [reservas, setReservas] = useState([]);
    const [diasCompletamenteReservados, setDiasCompletamenteReservados] = useState([]);
    const [menuVisible, setmenuVisible] = useState(false); // Estado para el menú desplegable
    const [nombre, setNombre] = useState(null);
    const [apellido, setApellido] = useState(null);
    const [ID_Rol, setID_Rol] = useState(null);
    const [id, setId] = useState(null);

    //realizamos los correspondientes manejos de estados 
    const history=useNavigate();

    useEffect(() => {
        const user = localStorage.getItem("usuario");
        if (user) {
            const { nombre, apellido, ID_Rol, id } = JSON.parse(user);
            setNombre(nombre);
            setApellido(apellido);
            setID_Rol(ID_Rol);
            setId(id);
        } else {
            history("/"); // Si no hay usuario, redirige al login
        }
    }, [history]);
    


    
    


    const mostrarMenu = () => {
        setmenuVisible(!menuVisible);
    };

    // Función para obtener los días reservados
    const obtenerDiasReservados = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/dias-completamente-reservados'); 
            setDiasCompletamenteReservados(response.data);
        } catch (error) {
            console.error('Error al obtener los días reservados:', error);
        }
    };


    useEffect(() => {
        obtenerDiasReservados();
    }, []);
    

    // Función para obtener el rol del usuario
    const fetchUserRole = useCallback(async () => {
        try {
        const response = await axios.get(`http://localhost:3001/api/rol/${ID_Rol}`); 
        setUserRole(response.data.rol);
        } catch (error) {
        console.error("Error al obtener el rol del usuario:", error);
        }
    }, [ID_Rol]);

    
    useEffect(() => {
        if (ID_Rol) {
            fetchUserRole(); 
        }
    }, [ID_Rol, fetchUserRole]); 



    // Función para cargar reservas para una fecha específica
    const fetchReservasPorFecha = async (fecha) => {
        try {
            const response = await axios.get(`http://localhost:3001/api/reservas/${fecha}`);
            const reservasFiltradas = response.data.filter(reserva => reserva.Estado !== 'cancelado');//filtramos las reservas para que solo se muestren las reservadas
            setReservas(reservasFiltradas); // Almacena las reservas en el estado
         
            
        } catch (error) {
            if (error.response) {
                console.error('Error al obtener las reservas:', error.response.data.message);
            } else if (error.request) {
                console.error('No se recibió respuesta:', error.request);
            } else {
                console.error('Error:', error.message);
            }
        }
    };

    // Inicializa selectedDay con la fecha actual y carga las reservas del día
    useEffect(() => {
        const hoy = new Date();
        const fechaActual = hoy.toISOString().split('T')[0]; // Obtiene la fecha en formato YYYY-MM-DD
        setSelectedDay(fechaActual); // Establece la fecha actual como seleccionada
        fetchReservasPorFecha(fechaActual); // Carga las reservas para la fecha actual
        
        if (ID_Rol) {
            fetchUserRole();
        }
    }, [ID_Rol, fetchUserRole]);



    // Función que maneja el clic en un día del calendario
    const handleDayClick = (arg) => {
        setSelectedDay(arg.dateStr); // Guardar el día seleccionado
        fetchReservasPorFecha(arg.dateStr); // Carga las reservas para la fecha seleccionada
    };

    // Función para crear una reserva
    const crearReserva = async (hora) => {
        if (!selectedDay) {
            alert("Por favor, selecciona un día antes de reservar.");
            return;
        }

        const fechaCompleta = `${selectedDay} ${hora}:00`; // Combina fecha y hora
        try {
            const response = await axios.post("http://localhost:3001/api/reservas", {
                Fecha_hora: fechaCompleta,
                Persona_id: id, 
                rol:userRole
            }); 
            Swal.fire({
                position: "center",
                icon: "success",
                title: response.data.message, 
                showConfirmButton: false,
                timer: 1500
            });
            fetchReservasPorFecha(selectedDay); // Recarga las reservas
            obtenerDiasReservados(); // Actualiza los días completamente reservados
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                // Mostrar el mensaje de error enviado desde el backend
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: error.response.data.error, 
                });
            } else {
                // Si no hay un mensaje de error específico, muestra un mensaje genérico
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Ha ocurrido un error inesperado.",
                });
            }
        }
    };
    // Función para cancelar una reserva
    const cancelarReserva = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:3001/api/reservas/${id}`,{
                data: { rol: userRole }  
            });
            Swal.fire({
                title: "Cancelada",
                text: response.data.message,
                icon: "success"
              });
            fetchReservasPorFecha(selectedDay); // Recarga las reservas
            obtenerDiasReservados(); // Actualiza los días completamente reservados
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error,
            });
        }
    };

    const renderHorasDelDia = () => {
        const horas = [];
        const fechaSeleccionada = new Date(selectedDay);
        const dia = fechaSeleccionada.toISOString().split('T')[0]; 
    
        for (let i = 6; i <= 22; i++) {
            const hora = `${i.toString().padStart(2, '0')}:00`; 
            const fechaCompleta = `${dia} ${hora}:00`;
    
            const reservada = reservas.find((reserva) => {
                const fechaReserva = reserva.Fecha_hora; 
                return fechaReserva === fechaCompleta;
            });
    
            horas.push(
                <div 
                    key={i} 
                    className={`p-[1%] m-[2%] bg-slate-200 rounded-xl flex items-center cursor-pointer 
                        ${reservada ? 'bg-red-200' : 'hover:bg-green-100'}`}
                    onClick={() => {
                        if (!reservada) {
                            crearReserva(hora);
                        } else {

                            return
                        }
                    }}
                >
                    <div>
                        <div className="bg-white rounded-xl font-mono font-extrabold p-1">{hora}</div></div>
    
                    {reservada ? (
                        <div className="text-red-400 font-bold ml-[5%]">
                            Reservada por: {reservada.NOMBRE} {reservada.APELLIDO}
                        </div>
                    ) : (
                        <div className="text-green-400 font-bold ml-auto mr-[1%]">
                            Disponible para reservar
                        </div>
                    )}
    
                    {userRole === "Administrador" && reservada && (
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                if (reservada.Persona_id) {
                                    Swal.fire({
                                        title: "Quieres cancelar la reserva?",
                                        text: "Las demas personas podran reservarla!",
                                        icon: "warning",
                                        showCancelButton: true,
                                        confirmButtonColor: "#3085d6",
                                        cancelButtonColor: "#d33",
                                        confirmButtonText: "Si,Cancelar!"
                                      }).then((result) => {
                                        if (result.isConfirmed) {
                                            cancelarReserva(reservada.ID_Reserva);
                                        }
                                      });
                                } else {
                                    console.error("Error: Persona_id no disponible en la reserva.");
                                }
                            }} 
                            className="bg-red-400 text-white p-2 rounded-xl ml-auto mr-[1%]"
                        >
                            Cancelar Reserva
                        </button>
                    )}
    
                    {userRole !== "Administrador" && reservada && reservada.Persona_id === id && (
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                if (reservada.Persona_id) {
                                    Swal.fire({
                                        title: "Quieres cancelar la reserva?",
                                        text: "Las demas personas podran reservarla!",
                                        icon: "warning",
                                        showCancelButton: true,
                                        confirmButtonColor: "#3085d6",
                                        cancelButtonColor: "#d33",
                                        confirmButtonText: "Si,Cancelar!"
                                      }).then((result) => {
                                        if (result.isConfirmed) {
                                            cancelarReserva(reservada.ID_Reserva);
                                        }
                                      });
                                } else {
                                    console.error("Error: Persona_id no disponible en la reserva.");
                                }
                            }} 
                            className="bg-red-400 text-white p-2 rounded-xl ml-auto mr-[1%]"
                        >
                            Cancelar mi Reserva
                        </button>
                    )}
                </div>
            );
        }
        return horas;
    };
    
    
    

    //metodo para llevar a pagina de inicio
    const inicio=()=>{
        history("/")
    }
    
    

    return <>
        <div className="w-full h-[10%] flex bg-gray-500 bg-opacity-25 backdrop-blur-lg">
            <div className="flex items-center space-x-2 ml-[2%]">
                <img src={flecha} alt="flecha" className={`h-[30%] cursor-pointer laptop-md:h-[45%] smart-lg:h-[43%] transition-transform duration-300 ${
                    menuVisible ? "rotate-90" : "rotate-0"
                }`}  onClick={mostrarMenu}></img>
                <h1 className="font-mono text-xs font-extrabold  smart-lg:text-xl laptop-md:text-[3,5vh] ">Gestion De Horarios De Uso Cancha Sintetica</h1>
            </div>
            {/* Menú desplegable */}
            {menuVisible && (
                    <div className=" flex flex-col absolute top-[100%]  w-[18%] h-[900%] bg-stone-400 rounded-tr-3xl rounded-br-3xl z-50">
                        <div className="bg-stone-50 h-[6%] mt-[10%] ml-[15%] mr-[15%] rounded-lg flex justify-center items-center cursor-pointer" onClick={()=>{
                            history("/Notificaciones", { state: { usuarioId: id } })
                            }}>
                            <h1 className="font font-mono  font-medium ">Notificaciones</h1>
                        </div>
                        <div className=" h-[6%] mt-auto  ml-[15%] mr-[15%] mb-[5%] flex justify-center bg-slate-200 rounded-lg items-center cursor-pointer "onClick={()=>{
                             localStorage.removeItem("usuario");
                             inicio()
                        }}>
                            <h1 className="font-mono mr-[5%] text-xl font-medium">Salir</h1>
                            <img src={salir} alt="icono salir" className="h-[70%] hover:scale-[1.2] transition-transform duration-300"></img>
                        </div>
                    </div>
                )}
            
            <div className="flex space-x-2 items-center ml-auto mobile-md:mr-[5%] smart-lg:mr-[3%] laptop-md:mr-[4%] desktop-md:space-x-5">
                <img src={avatar} alt="imagen avatar" className="h-[40%] laptop-md:h-[45%] smart-lg:h-[43%]"></img>
                <h1 className="font-mono font-extrabold text-xs  smart-lg:text-xl laptop-md:text-[3,5vh] ">{nombre} {apellido}</h1>
            </div>
        </div>
        <div className="h-[90%] flex items-center justify-end pr-[3%] ">
            <div className=" bg-white bg-opacity-30 backdrop-blur-lg h-[90%] w-[80%] flex">
                <div className="w-[40%] overflow-auto">
                {selectedDay && (
                    <div className="mt-[4%]">
                        <h2 className="font-mono text-2xl text-center font-extrabold">{selectedDay}</h2>
                        <div>{renderHorasDelDia(userRole)}</div>
                    </div>
                )}
                </div>
                <div className="w-[60%] bg-gray-600 bg-opacity-25 flex justify-center ">
                    <div className="h-[83%] w-[80%] pt-[5%]">
                        {<Calendario onDayClick={handleDayClick} selectedDay={selectedDay} diasReservados={diasCompletamenteReservados}/>}
                        <div className="font-semibold font-mono text-base pt-[3%]">Selecciona el dia que quieres reservar!!</div>
                    </div>
                </div>
            </div>
        </div>
        
    </>
}