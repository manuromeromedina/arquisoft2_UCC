import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import './estilo/reservar.css';
import { AuthContext } from './login/auth';

const notifyBooked = () => {
  toast.success("Reservado!", {
    pauseOnHover: false,
    autoClose: 2000,
  });
};

const notifyError = (message = "Hotel no disponible para reserva en fecha seleccionada!") => {
  toast.error(message, {
    pauseOnHover: false,
    autoClose: 3000,
  });
};

const notifyWarning = (message) => {
  toast.warning(message, {
    pauseOnHover: false,
    autoClose: 3000,
  });
};

const errorNotAClient = () => {
  toast.error("Los administradores no pueden realizar reservas.", {
    pauseOnHover: false,
    autoClose: 2000,
  });
};

function convertirFecha(fecha) {
  let fechaString = fecha.toString();
  let year = fechaString.substring(0, 4);
  let month = fechaString.substring(5, 7);
  let day = fechaString.substring(8, 10);
  let yearPlusMonth = year.concat("", month);
  let fechaStringFinal = yearPlusMonth.concat("", day);
  var fechaEntero = Number(fechaStringFinal);

  return fechaEntero;
}

const ReservaPage = () => {
  const { hotelId } = useParams();
  const [hotelData, setHotelData] = useState({});
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const accountId = localStorage.getItem("user_id");
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleReserva = async (e) => {
    e.preventDefault();
    
    if (auth.userType === false) {
      // Primero verificar disponibilidad antes de intentar reservar
      const startDateParsed = convertirFecha(startDate);
      const endDateParsed = convertirFecha(endDate);

      try {
        // Verificar disponibilidad primero
        const availabilityResponse = await fetch(`http://localhost/user-res-api/hotel/availability/${hotelId}/${startDateParsed}/${endDateParsed}`);
        const availability = await availabilityResponse.json();

        if (availability === 0) {
          notifyError("No hay disponibilidad para las fechas seleccionadas");
          return;
        }

        // Si hay disponibilidad, proceder con la reserva
        const userIdNum = parseInt(accountId);

        const formData = {
          booked_hotel_id: hotelId,
          user_booked_id: userIdNum,
          start_date: startDateParsed,
          end_date: endDateParsed,
        };

        console.log('Datos a enviar:', formData);

        const response = await fetch('http://localhost/user-res-api/booking', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        console.log('Response status:', response.status);

        if (response.status === 201) {
          notifyBooked();
          setTimeout(() => {
            navigate('/ver-reservas');
          }, 2500);
        } else {
          const errorData = await response.json();
          console.log('Error del backend:', errorData);
          
          if (errorData.message) {
            notifyError(errorData.message);
          } else {
            notifyError("Error al procesar la reserva");
          }
        }
      } catch (error) {
        console.error('Error de red:', error);
        notifyError("Error de conexión. Inténtalo de nuevo.");
      }
    } else {
      errorNotAClient();
    }
  };

  useEffect(() => {
    if (hotelId) {
      fetch(`http://localhost/hotels-api/hotels/${hotelId}`)
        .then(response => response.json())
        .then(data => {
          if (data.images && typeof data.images === 'string') {
            data.images = data.images.split(','); // Separar las imágenes en un array
          }
          setHotelData(data);
        })
        .catch(error => {
          console.error('Error al obtener datos del hotel: ', error);
        });
    }
  }, [hotelId]);

  const handleStartDateChange = (event) => {
    const selectedStartDate = event.target.value;
    setStartDate(selectedStartDate);
    const startDateObj = new Date(selectedStartDate);
    const endDateObj = new Date(endDate);
    if (endDate && startDateObj > endDateObj) {
      setEndDate('');
    }
    // Verificar disponibilidad cuando ambas fechas estén seleccionadas
    if (selectedStartDate && endDate) {
      setTimeout(() => filterHotels(), 500); // Pequeño delay para que se actualice el estado
    }
  };

  const handleEndDateChange = (event) => {
    const selectedEndDate = event.target.value;
    setEndDate(selectedEndDate);
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(selectedEndDate);
    if (startDate && startDateObj > endDateObj) {
      setStartDate('');
    }
    // Verificar disponibilidad cuando ambas fechas estén seleccionadas
    if (startDate && selectedEndDate) {
      setTimeout(() => filterHotels(), 500); // Pequeño delay para que se actualice el estado
    }
  };

  console.log(hotelData);

  const filterHotels = async () => {
    if (!startDate || !endDate) return;
    
    const startDateParsed = convertirFecha(startDate);
    const endDateParsed = convertirFecha(endDate);

    try {
      const request = await fetch(`http://localhost/user-res-api/hotel/availability/${hotelId}/${startDateParsed}/${endDateParsed}`);
      const response = await request.json();

      console.log('Disponibilidad:', response);

      if (response === 0) {
        notifyWarning("No hay disponibilidad para las fechas seleccionadas. Prueba con otras fechas.");
      } else {
        toast.success(`Disponible! Hay ${response} habitaciones disponibles`, {
          pauseOnHover: false,
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error('Error verificando disponibilidad:', error);
      notifyError("Error al verificar disponibilidad");
    }
  };

  const handleVolver = () => {
    navigate('/');
  };

  const today = new Date().toISOString().split('T')[0];

  const images = hotelData.images ? hotelData.images.map(image => ({
    original: image,
    thumbnail: image,
  })) : [];

  function capitalizeWords(str) {
    if (!str) return ''; // Si str es undefined o null, retorna una cadena vacía
    return str.replace(/\b\w/g, char => char.toUpperCase());
  }

  return (
    <div className="bodyReserva">
      <div>
        {typeof hotelData === 'undefined' ? (
          <>CARGANDO...</>
        ) : (
          <div className="container45">
            <div className="informacion">
              <div className="cuadroImag">
                {images.length > 0 ? (
                  <ImageGallery items={images} showPlayButton={false} showThumbnails={true} additionalClass="custom" />
                ) : (
                  <p>No hay imágenes disponibles</p>
                )}
              </div>
              <div className="descripcion">
                <p className="titulo">Descripción:</p>
                <p>{hotelData.description}</p>
              </div>
              <div className="direccion">
                <p className="titulo">Dirección:</p>
                <p>{capitalizeWords(hotelData.address)}, {capitalizeWords(hotelData.city)}, {capitalizeWords(hotelData.country)}</p>
              </div>
              <div className="amenities">
                <p className="titulo">Amenities:</p>
                <ul>
                  {hotelData.amenities && hotelData.amenities.map((amenity, index) => (
                    <li key={index}>{capitalizeWords(amenity.trim())}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="reserva-form">
              <h6>Realice reserva del Hotel</h6>
              <h6>{hotelData.nombre}</h6>
              <form onSubmit={handleReserva}>
                <div className="form-group">
                  <label htmlFor="fechaInicio">Fecha de inicio:</label>
                  <input
                    type="date"
                    id="fechaInicio"
                    min={today}
                    value={startDate}
                    onChange={handleStartDateChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="fechaFin">Fecha de fin:</label>
                  <input
                    type="date"
                    id="fechaFin"
                    min={today}
                    value={endDate}
                    onChange={handleEndDateChange}
                    required
                  />
                </div>
                <div>
                  <button type="submit" className="confReserva">Confirmar</button>
                  <button type="button" className="confReserva" onClick={handleVolver}>Volver</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default ReservaPage;