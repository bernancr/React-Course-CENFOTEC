import React, { useState } from 'react';
import DisplayPeople from './DisplayPeople';

function FormPeople() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [nacimiento, setNacimiento] = useState("");
  const [telefono, setTelefono] = useState("");
  const [listaPersonas, setListaPersonas] = useState([]);

  const handleNameChange = (event) => {
    setNombre(event.target.value);
  }

  const handleLastNameChange = (event) => {
    setApellido(event.target.value);
  }

  const handleEmailChange = (event) => {
    setCorreo(event.target.value);
  }

  const handleBirthChange = (event) => {
    setNacimiento(event.target.value);
  }

  const handlePhoneChange = (event) => {
    setTelefono(event.target.value);
  }

  const handleButtonClick = () => {
    if (nombre !== '' && apellido !== '' && correo !== '' && nacimiento !== '' && telefono !== '') {
      const nuevaPersona = {
        nombre: nombre,
        apellido: apellido,
        correo: correo,
        nacimiento: nacimiento,
        telefono: telefono,
      };
      setListaPersonas([nuevaPersona, ...listaPersonas]);
      setNombre("");
      setApellido("");
      setCorreo("");
      setNacimiento("");
      setTelefono("");
    }
    else{
      alert("REVISE BIEN SU FORMULARIO. Para incluir datos a la lista de personas debe llenar todos los campos")
    }
  }

  return (
    <div className='mt-4 container d-flex flex-wrap align-items-start justify-content-center'>
      <div className='col-lg-4 mx-4'>
        <h2>Formulario</h2>
        <form className='row'>
          <label className="form-label" htmlFor="nombre">Nombre:</label>
          <input onChange={handleNameChange} className='form-control' type="text" id="nombre" required value={nombre} />

          <label className="form-label" htmlFor="apellido">Apellido:</label>
          <input onChange={handleLastNameChange} className='form-control' type="text" id="apellido" required value={apellido} />

          <label className="form-label" htmlFor="correo">Correo:</label>
          <input onChange={handleEmailChange} className='form-control' type="email" id="correo" required value={correo} />

          <label className="form-label" htmlFor="fechaNacimiento">Fecha de nacimiento:</label>
          <input onChange={handleBirthChange} className='form-control' type="date" id="fechaNacimiento" required value={nacimiento} />

          <label className="form-label"  htmlFor="telefono">Teléfono:</label>
          <input onChange={handlePhoneChange} className='form-control' type="tel" id="telefono" required value={telefono} />

          <hr className="my-4"></hr>
          <button onClick={handleButtonClick} className="mb-4 w-100 btn btn-primary btn-lg" type="button">Incluir persona</button>
        </form>
      </div>
      <DisplayPeople listaPersonas={listaPersonas} />
    </div>
  )
}

export default FormPeople;
