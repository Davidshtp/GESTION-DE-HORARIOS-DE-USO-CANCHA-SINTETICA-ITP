//se importan todos los componentes al archivo principal asi como herramientas para el funcionamiento del modulo principal
import React from 'react';
import ReactDOM from 'react-dom/client';
import "./index.css"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { InicioSesion } from './Components/Inicio_sesion';
import { HomePage } from './Components/Home_page';
import { PageFound } from './Components/Page_found';
import { Notificaciones } from './Components/Notificaciones';

//realizamos la conexion con el html de nuestra pagina web para empezar a renderizar todo alli

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(//renderizamos lo que queramos
  //establecemos todas las rutas de nuestro proyecto aqui
  <div className="fondo">
    <Router>
      <Routes>
        <Route path="/" element={<InicioSesion />} />
        <Route path="/home" element={<HomePage />} />
        <Route path='/Notificaciones' element={<Notificaciones/>}/>
        <Route path="*" element={<PageFound/>}/>
      </Routes>
    </Router>
  </div>
);

