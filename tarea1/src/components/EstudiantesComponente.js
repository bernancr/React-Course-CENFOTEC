import React from 'react'
import listaEstudiantes from './listaEstudiantes';

function EstudiantesComponente() {
    return(
        <div>
            <h1>Lista de Estudiantes (Con Componente)</h1>
            <ul>
                {listaEstudiantes.map(
                    (alumno,index) => (<li key={index}><span>{alumno.nombre}</span> <span>{alumno.apellido}</span> | <span>Edad: {alumno.edad} años</span></li>)
                ) }
            </ul>
        </div>
    )
}

export default EstudiantesComponente;