import React, { useState, useEffect } from 'react';
// 1. Importar la nueva función deleteService
import { getServices, createService, deleteService } from '../services/serviceService';
import { useAuth } from '../context/AuthContext';
import './ServiceManager.css';

const ServiceManager = () => {
  const { token } = useAuth();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [newServiceDuration, setNewServiceDuration] = useState(60);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await getServices();
      setServices(data);
    } catch (err) {
      setError('No se pudieron cargar los servicios.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleCreateService = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      const serviceData = {
        nombre: newServiceName,
        descripcion: newServiceDesc,
        duracion: newServiceDuration,
      };
      await createService(serviceData, token);
      
      setNewServiceName('');
      setNewServiceDesc('');
      setNewServiceDuration(60);
      fetchServices(); 

    } catch (err) {
      setError(err.message || 'Error al crear el servicio.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2. Nueva función para manejar la eliminación
  const handleDeleteService = async (serviceId) => {
    // Pedimos confirmación para evitar borrados accidentales
    const confirmDelete = window.confirm('¿Estás seguro de que quieres eliminar este servicio? Esta acción no se puede deshacer.');
    
    if (confirmDelete) {
      try {
        await deleteService(serviceId, token);
        // Si tiene éxito, actualizamos la lista de servicios para que desaparezca el eliminado
        fetchServices();
      } catch (err) {
        setError(err.message || 'Error al eliminar el servicio.');
      }
    }
  };

  return (
    <div className="service-manager-container">
      <h3>Gestionar Servicios</h3>
      
      <div className="form-section">
        <h4>Añadir Nuevo Servicio</h4>
        <form onSubmit={handleCreateService} className="service-form">
          <input
            type="text"
            placeholder="Nombre del servicio"
            value={newServiceName}
            onChange={(e) => setNewServiceName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Descripción (opcional)"
            value={newServiceDesc}
            onChange={(e) => setNewServiceDesc(e.target.value)}
          />
          <input
            type="number"
            placeholder="Duración (minutos)"
            value={newServiceDuration}
            onChange={(e) => setNewServiceDuration(e.target.value)}
            required
            min="10"
          />
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Añadiendo...' : 'Añadir Servicio'}
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>

      <div className="list-section">
        <h4>Servicios Actuales</h4>
        {loading ? (
          <p>Cargando servicios...</p>
        ) : (
          <ul className="service-list">
            {services.length > 0 ? (
              services.map((service) => (
                <li key={service._id} className="service-item">
                  <div className="service-info">
                    <strong>{service.nombre}</strong> ({service.duracion} min)
                    <p>{service.descripcion}</p>
                  </div>
                  {/* 3. Botón para eliminar el servicio */}
                  <button 
                    className="delete-btn" 
                    onClick={() => handleDeleteService(service._id)}
                  >
                    Eliminar
                  </button>
                </li>
              ))
            ) : (
              <p>No hay servicios creados todavía.</p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ServiceManager;
