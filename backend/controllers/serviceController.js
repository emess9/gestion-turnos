const Service = require('../models/ServiceModel'); // Importamos el modelo de Servicio

// @desc    Crear un nuevo servicio
// @route   POST /api/services
// @access  Private/Admin
const createService = async (req, res) => {
  try {
    const { nombre, descripcion, duracion } = req.body;

    // Validación básica
    if (!nombre || !duracion) {
      return res.status(400).json({ message: 'El nombre y la duración son obligatorios.' });
    }

    // Verificar si el servicio ya existe por su nombre
    const serviceExists = await Service.findOne({ nombre });
    if (serviceExists) {
      return res.status(400).json({ message: 'El servicio ya existe.' });
    }

    // Crear el nuevo servicio
    const service = await Service.create({
      nombre,
      descripcion,
      duracion,
    });

    res.status(201).json(service);

  } catch (error) {
    console.error('Error al crear el servicio:', error);
    res.status(500).json({ message: 'Error del servidor al crear el servicio.' });
  }
};

// @desc    Obtener todos los servicios
// @route   GET /api/services
// @access  Public
const getServices = async (req, res) => {
  try {
    const services = await Service.find({}); // find({}) trae todos los documentos de la colección
    res.status(200).json(services);
  } catch (error) {
    console.error('Error al obtener los servicios:', error);
    res.status(500).json({ message: 'Error del servidor al obtener los servicios.' });
  }
};

// @desc    Actualizar un servicio
// @route   PUT /api/services/:id
// @access  Private/Admin
const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Servicio no encontrado.' });
    }

    // Actualizar los campos que vengan en el body de la petición
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

// @desc    Eliminar un servicio
// @route   DELETE /api/services/:id
// @access  Private/Admin
const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Servicio no encontrado.' });
    }

    await service.deleteOne(); // Nuevo método recomendado en Mongoose v6+
    res.status(200).json({ message: 'Servicio eliminado correctamente.' });

  } catch (error) {
    console.error('Error al eliminar el servicio:', error);
    res.status(500).json({ message: 'Error del servidor al eliminar el servicio.' });
  }
};

module.exports = {
  createService,
  getServices,
  updateService,
  deleteService,
};
