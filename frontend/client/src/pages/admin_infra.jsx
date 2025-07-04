import React, { useEffect, useState } from 'react';
import './estilo/hoteles_admin.css';
import './estilo/admin_infra.css';
import './estilo/inicio.css'
import { ToastContainer, toast } from "react-toastify";

const notifyCreated = () => {
  toast.success("Contenedor creado!", {
      pauseOnHover: false,
      autoClose: 2000,
  })
}

const notifyCreationError = () => {
  toast.error("Hubo un error al crear el contenedor!", {
      pauseOnHover: false,
      autoClose: 2000,
  })
}

const notifyStopped = () => {
  toast.success("Contenedor parado!", {
      pauseOnHover: false,
      autoClose: 2000,
  })
}

const notifyStoppingError = () => {
  toast.error("Hubo un error al parar el contenedor!", {
      pauseOnHover: false,
      autoClose: 2000,
  })
}

const notifyRemove = () => {
  toast.success("Contenedor elimnado!", {
      pauseOnHover: false,
      autoClose: 2000,
  })
}

const notifyRemotionError = () => {
  toast.error("Hubo un error al eleimar el contenedor!", {
      pauseOnHover: false,
      autoClose: 2000,
  })
}

const notifyStarted = () => {
  toast.success("Contenedor iniciado!", {
      pauseOnHover: false,
      autoClose: 2000,
  })
}

const notifyStartError = () => {
  toast.error("Hubo un error al iniciar el contenedor!", {
      pauseOnHover: false,
      autoClose: 2000,
  })
}


const AdminInfra = () => {
  const [contenedores, setContenedores] = useState([]);
  
 function isEmpty(str) {
    return !str.trim().length;
  }

  function isJSONEmpty(obj){
    return Object.keys(obj).length === 0;
  }  

  const getContenedores = async () => {
    try {
      // const request = await fetch("http://localhost:8091/cliente/hoteles");
      const request = await fetch("http://localhost:8040/containers");
      //const request = await fetch("http://localhost:8070/hotel");
      const response = await request.json();
      setContenedores(response);
    } catch (error) {
      console.log("No se pudieron obtener los contenedores:", error);
    }
  };

  useEffect(() => {
    getContenedores();
  }, []);

  const Cuenta = () => {
    window.location.href = '/cuenta';
  }

  const Home = () => {
    window.location.href = '/';
  }

  const handleVolver = () => {
    window.history.back();
  };

  const handleCrear = (imageName, containerNames, containerNumber, runningContainerId) => {
  // Extraer información del contenedor
  const fullContainerName = containerNames[0].replace('/', '');
  const serviceName = fullContainerName.split('-').slice(-2, -1)[0];
  
  const currentNumber = parseInt(containerNumber) || 1;
  const newNumber = currentNumber + 1;
  const projectPrefix = fullContainerName.split('-')[0];
  const newContainerName = `${projectPrefix}-${serviceName}-${newNumber}`;
  
  console.log('Creating container:', {
    serviceName,
    imageName,
    newContainerName,
    runningContainerId,
    currentNumber,
    newNumber
  });

  // Codificar parámetros para URL (importante para caracteres especiales)
  const encodedImageName = encodeURIComponent(imageName);
  const encodedContainerName = encodeURIComponent(newContainerName);
  const encodedContainerId = encodeURIComponent(runningContainerId);

  // Usar la URL con parámetros que espera tu backend actual
  const url = `http://localhost:8040/containers/${encodedImageName}/${encodedContainerName}/${encodedContainerId}`;
  
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    // El body puede estar vacío ya que los datos van en la URL
    body: JSON.stringify({})
  })
  .then(response => {
    if (!response.ok) {
      return response.text().then(text => {
        console.error('Server response:', text);
        throw new Error(`Server error: ${response.status} - ${text}`);
      });
    }
    return response.json();
  })
  .then(data => {
    console.log("Container creation response:", data);
    notifyCreated();
    
    // Buscar el ID del nuevo contenedor en la respuesta
    const newContainerId = data.containerId || data.container_id || data.id;
    if (newContainerId) {
      console.log("Starting new container:", newContainerId);
      handleStartContainer(newContainerId);
    } else {
      console.log("No container ID returned, refreshing list");
      setTimeout(() => {
        getContenedores();
      }, 1000);
    }
  })
  .catch(error => {
    console.error("Error creating container:", error);
    notifyCreationError();
  });
};
  const handleStartContainer = (containerId) => {
    fetch(`http://localhost:8040/containers/start/${containerId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(response => {
      if (!response.ok) {
        throw new Error('Failed to start container');
      }
      console.log("Started container:", containerId);
      getContenedores()
    }).catch(error => {
      console.error("Error starting container:", error);
      alert("Error al iniciar el contenedor");
    });
  };

  const handleApagar = (contenedorId) => {
    
    console.log(contenedorId);

    fetch(`http://localhost:8040/containers/stop/${contenedorId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(response => {
      if (response.status === 400 || response.status === 401 || response.status === 403 || response.status === 500) {
        notifyStoppingError();
        // alert("Error al parar el contenedor");
      }

      notifyStopped();

      getContenedores();

    }).catch(error => {
      console.error("Error stopping container:", error);
      notifyStoppingError();
      // alert("Error al parar el contenedor");
    });
  };

  const handlePrender = (contenedorId) => {

    fetch(`http://localhost:8040/containers/start/${contenedorId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(response => {
      if (response.status === 400 || response.status === 401 || response.status === 403 || response.status === 500) {
        // alert("Error al iniciar el contenedor");
        notifyStartError();
      }

      notifyStarted();

      getContenedores();

    }).catch(error => {
      console.error("Error stopping container:", error);
      notifyStartError();
      // alert("Error al iniciar el contenedor");
    });
  };

  const handleBorrar = (contenedorId) => {

    fetch(`http://localhost:8040/containers/remove/${contenedorId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(response => {
      if (response.status === 400 || response.status === 401 || response.status === 403 || response.status === 500) {
        notifyRemotionError();
        // alert("Error al iniciar el contenedor");
      }

      notifyRemove();

      getContenedores();

    }).catch(error => {
      console.error("Error stopping container:", error);
     // alert("Error al iniciar el contenedor");
      notifyRemotionError();
    });
  };

  return (
    <div className="bodyinicio">
     <div className="header-content-infra">
        <div className="admin-button-container">
            <button className="admin-button" onClick={Home}>
                Inicio
            </button>
        </div>
        <div className="cuenta-button-container">
            <button className="cuenta-button" onClick={Cuenta}>
                Tu Cuenta
            </button>
            </div>
        <div className="admin-button-container">
            <button className="admin-button" onClick={handleVolver}>
                Volver
            </button>
        </div>
      </div>
      <div className="containerIni">
        <div className="hotels-containerH">
          {contenedores.length ? (
            contenedores.map((contenedor) => (
            <div className="hotel-cardH" key={contenedor.Id}>
                <div className='img-name'>
                  <div className="hotel-infoH">
                    <h4> Contenedor: {contenedor.Names} </h4>
                    <div className="hotel-descriptionH">
                    <label htmlFor={`description-${contenedor.Id}`}> Imagen: {contenedor.Image} </label>
                    <label htmlFor={`description-${contenedor.Id}`}> Estado: {contenedor.State}</label>
                    </div>
                    {contenedor.Names && contenedor.Names[0].slice(-1) !== "1" && contenedor.State !== "exited" && (
                      <button className="botonAC" onClick={() => handleApagar(contenedor.Id)}>Apagar</button>
                    )}
                    {contenedor.State === "exited" && (
                      <button className="botonAC" onClick={() => handlePrender(contenedor.Id)}>Prender</button>
                    )}
                    {contenedor.Names && contenedor.Names[0].slice(-1) !== "1" && (
                      <button className="botonAC" onClick={() => handleBorrar(contenedor.Id)}>Borrar</button>
                    )}
                    <button className="botonAC" onClick={() => handleCrear(contenedor.Image, contenedor.Names, contenedor.Labels["com.docker.compose.container-number"], contenedor.Id)}> Crear nueva instancia </button>
                  </div>
                </div> 
            </div>
            ))
          ) : (
            <p>No hay contenedores disponibles</p>
          )}
        </div>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default AdminInfra;