import Service from '../models/ServiceModel.js'; 

// Crea un nuevo servicio
export const createService = async (req, res) => {
  try {
    const { nombre, descripcion, duracion } = req.body;

    if (!nombre || !duracion) {
      return res.status(400).json({ message: 'El nombre y la duración son obligatorios.' });
    }

    const serviceExists = await Service.findOne({ nombre });
    if (serviceExists) {
      return res.status(400).json({ message: 'El servicio ya existe.' });
    }

    const service = await Service.create({ nombre, descripcion, duracion });

    res.status(201).json(service);
  } catch (error) {
    console.error('Error al crear el servicio:', error);
    res.status(500).json({ message: 'Error del servidor al crear el servicio.' });
  }
};

// Obtiene la lista de todos los servicios 
export const getServices = async (req, res) => {
  try {
    const services = await Service.find({});
    res.status(200).json(services);
  } catch (error) {
    console.error('Error al obtener los servicios:', error);
    res.status(500).json({ message: 'Error del servidor al obtener los servicios.' });
  }
};

// Actualiza un servicio existente 
export const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Servicio no encontrado.' });
    }

    service.nombre = req.body.nombre || service.nombre;
    service.descripcion = req.body.descripcion || service.descripcion;
    service.duracion = req.body.duracion || service.duracion;

    const updatedService = await service.save();
    res.status(200).json(updatedService);
  } catch (error) {
    console.error('Error al actualizar el servicio:', error);
    res.status(500).json({ message: 'Error del servidor al actualizar el servicio.' });
  }
};

// Elimina un servicio 
export const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Servicio no encontrado.' });
    }

    await service.deleteOne();
    res.status(200).json({ message: 'Servicio eliminado correctamente.' });
  } catch (error) {
    console.error('Error al eliminar el servicio:', error);
    res.status(500).json({ message: 'Error del servidor al eliminar el servicio.' });
  }
};
