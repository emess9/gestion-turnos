import { useState, useEffect } from 'react';
// 1. Importa funciones
import { getServices, createService, deleteService, updateService } from '../services/serviceService';
import { useAuth } from '../context/AuthContext';
import './ServiceManager.css';

const ServiceManager = () => {
  const { token } = useAuth();

  // Estados existentes
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [newServiceDuration, setNewServiceDuration] = useState(60);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- NUEVOS ESTADOS PARA LA EDICIÓN ---
  const [editingServiceId, setEditingServiceId] = useState(null); 
  const [editFormData, setEditFormData] = useState({ nombre: '', descripcion: '', duracion: '' });

  // Carga inicial de servicios
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

  // EVENTOS 
  const handleCreateService = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      await createService({ nombre: newServiceName, descripcion: newServiceDesc, duracion: newServiceDuration }, token);
      setNewServiceName(''); setNewServiceDesc(''); setNewServiceDuration(60);
      fetchServices(); 
    } catch (err) { setError(err.message || 'Error al crear el servicio.'); }
    finally { setIsSubmitting(false); }
  };

  const handleDeleteService = async (serviceId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este servicio?')) {
      try {
        await deleteService(serviceId, token);
        fetchServices();
      } catch (err) { setError(err.message || 'Error al eliminar el servicio.'); }
    }
  };
  
  // EDICIÓN 
  const handleEditClick = (service) => {
    setEditingServiceId(service._id);
    setEditFormData({ nombre: service.nombre, descripcion: service.descripcion, duracion: service.duracion });
  };

  const handleCancelEdit = () => {
    setEditingServiceId(null);
  };

  const handleUpdateChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleUpdateSubmit = async (serviceId) => {
    try {
      await updateService(serviceId, editFormData, token);
      setEditingServiceId(null);
      fetchServices();
    } catch (err) {
      setError(err.message || 'Error al actualizar el servicio.');
    }
  };


  return (
    <div className="service-manager-container">
      <h3>Gestionar Servicios</h3>
      
      {/* ... (el formulario de crear servicio sigue igual) ... */}
      <div className="form-section">
        <h4>Añadir Nuevo Servicio</h4>
        <form onSubmit={handleCreateService} className="service-form">
          <input type="text" placeholder="Nombre del servicio" value={newServiceName} onChange={(e) => setNewServiceName(e.target.value)} required />
          <input type="text" placeholder="Descripción (opcional)" value={newServiceDesc} onChange={(e) => setNewServiceDesc(e.target.value)} />
          <input type="number" placeholder="Duración (minutos)" value={newServiceDuration} onChange={(e) => setNewServiceDuration(e.target.value)} required min="10" />
          <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Añadiendo...' : 'Añadir Servicio'}</button>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>

      <div className="list-section">
        <h4>Servicios Actuales</h4>
        {loading ? <p>Cargando servicios...</p> : (
          <ul className="service-list">
            {services.map((service) => (
              <li key={service._id} className="service-item">
                {editingServiceId === service._id ? (
                  // --- VISTA DE EDICIÓN ---
                  <div className="service-edit-form">
                    <input type="text" name="nombre" value={editFormData.nombre} onChange={handleUpdateChange} />
                    <input type="text" name="descripcion" value={editFormData.descripcion} onChange={handleUpdateChange} />
                    <input type="number" name="duracion" value={editFormData.duracion} onChange={handleUpdateChange} />
                    <div className="edit-actions">
                      <button className="save-btn" onClick={() => handleUpdateSubmit(service._id)}>Guardar</button>
                      <button className="cancel-edit-btn" onClick={handleCancelEdit}>Cancelar</button>
                    </div>
                  </div>
                ) : (
                  // --- VISTA NORMAL ---
                  <>
                    <div className="service-info">
                      <strong>{service.nombre}</strong> ({service.duracion} min)
                      <p>{service.descripcion}</p>
                    </div>
                    <div className="service-actions">
                      <button className="edit-btn" onClick={() => handleEditClick(service)}>Editar</button>
                      <button className="delete-btn" onClick={() => handleDeleteService(service._id)}>Eliminar</button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ServiceManager;
