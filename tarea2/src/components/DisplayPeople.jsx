import React from 'react';

function DisplayPeople({ listaPersonas }) {
  return (
    <div className='col-lg-5 mx-4 row align-items-start'>
      <h2>Lista de Personas</h2>
      {listaPersonas.map((persona, index) => (
        <ul key={`${persona.nombre}-${persona.apellido}-${index}`} className="list-group mb-3 col-lg-6">
          <li key={`${persona.nombre}-${index}`} className="list-group-item bg-body-tertiary">
            <div>
              <h6 className="my-0">{persona.nombre} {persona.apellido}</h6>
            </div>
          </li>
          <li key={`${persona.correo}-${index}`} className="list-group-item">
            <div>
              <h6 className="my-0">Email: </h6>
              <small className="text-body-secondary">{persona.correo}</small>
            </div>
          </li>
          <li key={`${persona.nacimiento}-${index}`} className="list-group-item">
            <div>
              <h6 className="my-0">Fecha de Nacimiento</h6>
              <small className="text-body-secondary">{persona.nacimiento}</small>
            </div>
          </li>
          <li key={`${persona.telefono}-${index}`} className="list-group-item bg-body-tertiary">
            <div>
              <h6 className="my-0">Teléfono</h6>
              <small className="text-body-secondary">{persona.telefono}</small>
            </div>
          </li>
        </ul>
      ))}
    </div>
  )
}

export default DisplayPeople;
