//Se importan los componentes y herramientas que se usaran en este modulo
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";


export function InicioSesion(){
    //realizamos los correspondientes manejos de estados 
    const [usuario, setUsuario] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [mensaje, setMensaje] = useState("");

    //es para el manejo de rutas y ridereccionamientos
    const history= useNavigate();

   
    //Manejo para el envio del formulario
    const manejarEnvio = (e) => {
        e.preventDefault();//evita que el formulario se envie antes de tiempo o tenga errores
        //verificar si hay datos en los campos
        if(!usuario || !contrasena){
            setMensaje("Ingrese todos los datos")

        }else{//de lo contrario procede a hacer la peticion al backend para saber si el usuario y contraseña ingresados coinciden con lo de la base de datos
            Axios.post("http://localhost:3001/api/login",{
                identificacion:usuario,
                contrasena:contrasena
            }).then((response)=>{
                setMensaje(response.data.message)
                setUsuario("");
                setContrasena("");
                setTimeout(() => {//se redirige a la pagina de home y a su vez se envian los nombres y apellidos de la persona que ingreso para poder mostrarlos en el navabr de la pagina home
                    // Guardar los datos del usuario en localStorage
                    const { nombre, apellido, ID_Rol, id } = response.data;
                    localStorage.setItem("usuario", JSON.stringify({ nombre, apellido, ID_Rol, id }));
                    history("/home", { state: { nombre: response.data.nombre, apellido: response.data.apellido, ID_Rol:response.data.ID_Rol, id:response.data.id } })
                }, 1000);
            }).catch((error) => {
                console.log(error)
                if (error.response) {
                    setMensaje(error.response.data.message); // Mostrar mensaje de error de credenciales
                    setTimeout(()=>{
                        setUsuario("");
                        setContrasena("");
                        setMensaje("");
                    },1000)
                } else {
                    setMensaje("Error de conexión"); // Manejar errores de conexión
                }
            });
        }
    };
    
return <div className="bg-white size-adjusted">
    <div className="subfondo"></div>
    <div className="logo_itp "></div>
    <div className=" absolute bottom-0  left-1/2 transform -translate-x-1/2 mobile-sm:bottom-[7%] mobile-md:bottom-[2%] w-[85%] desktop-md:bottom-[9%]">
    <form onSubmit={manejarEnvio}>
        <div className="flex flex-col mobile-sm:space-y-2 mobile-sm:w-[80%] mx-auto mobile-md:w-[70%] smart-lg:w-[58%] laptop-md:w-[50%] desktop-md:w-[45%] desktop-lg:w-[43%]">
                <div className="flex items-center justify-center mobile-sm:space-x-3">
                    <div className="text-right font-semibold font-mono mobile-sm:text-xxs mobile-sm:w-[40%] mobile-md:text-xs laptop-md:text-sm">Numero De Documento</div>
                    <input className="rounded-xl focus:outline-none border-gray-300 border-2 placeholder:text-center   mobile-sm:placeholder:text-xxxs mobile-sm:p-1 mobile-sm:w-[75%] mobile-md:placeholder:text-xxs laptop-md:placeholder:text-xs px-4 " 
                    placeholder="Ingrese Su Numero De Documento "  
                    onChange={(e) => setUsuario(e.target.value)}
                    value={usuario}
                    ></input>
                </div>
                <div className="flex items-center justify-center space-x-6 mobile-sm:space-x-3">
                    <div className="text-right font-semibold font-mono mobile-sm:text-xxs mobile-sm:w-[40%] mobile-md:text-xs laptop-md:text-sm">Contraseña</div>
                    <input className="rounded-xl focus:outline-none border-gray-300 border-2 placeholder:text-center   mobile-sm:placeholder:text-xxxs mobile-sm:p-1 mobile-sm:w-[75%] mobile-md:placeholder:text-xxs laptop-md:placeholder:text-xs " 
                    placeholder="Ingrese Su Contraseña " 
                    type="password" 
                    onChange={(e) => setContrasena(e.target.value)}
                    value={contrasena}
                    ></input>
                </div>
                <div className="text-right  text-green-600 mobile-sm:text-xxxs mobile-md:text-xxs laptop-md:text-xs hover:underline"><a href="recuperar contraseña">Olvide mi contraseña</a></div>
                <button className="bg-green-800  rounded-lg  text-white font-mono mobile-sm:text-xxs mobile-sm:p-1 mobile-md:text-xs laptop-md:text-sm hover:bg-green-900">Ingresar</button>
                <p className="text-center text-gray-400 mobile-sm:text-xxxs mobile-md:mx-[5%] mobile-md:text-xxs laptop-md:text-xs">El ingreso solo esta permitido para Estudiantes <strong className="text-black">Admitidos y Matriculados</strong></p>
                {mensaje && (
                    <p className={`text-center mt-4 text-sm ${mensaje.includes("exitoso") ? "text-green-600" : "text-red-600"}`}>
                        {mensaje}
                    </p>
                )}
     </div>

    </form>
        
    </div>
</div>
}