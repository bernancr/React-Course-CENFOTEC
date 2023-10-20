// import PropTypes from 'prop-types';
import React, { Component } from 'react';
import listaEstudiantes from './listaEstudiantes';

class EstudiantesClase extends Component {
  
    constructor(props)
    {
        super(props);
    }

    render() {
        
    return (
    
        <div>
                <h1>Lista de Estudiantes (Con Clase)</h1>
                <ul>
                    {listaEstudiantes.map((alumno, index) => (
                        <li key={index}>
                            <span>{alumno.nombre}</span> <span>{alumno.apellido}</span> | <span>Edad: {alumno.edad} años</span>
                        </li>
                    ))}
                </ul>
            </div>

    )
  }
}

export default EstudiantesClase;

