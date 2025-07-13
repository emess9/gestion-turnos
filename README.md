Proyecto: Gestión de Turnos para Peluquería (Stack MERN)
Desarrollado por Ezequiel Messina y Alexander Achacollo
Este proyecto es una aplicación web Full-Stack construida con el stack MERN (MongoDB, Express, React, Node.js). El objetivo fue desarrollar un sistema completo para la gestión de turnos, con funcionalidades diferenciadas para clientes y administradores.

Funcionalidades Principales
Sistema de Autenticación: Registro e inicio de sesión de usuarios con tokens JWT para la seguridad de la API.

Roles de Usuario: Clara diferenciación entre clientes y administradores, cada uno con sus permisos específicos.

Interfaz de Cliente: Los clientes pueden ver los servicios, consultar los turnos disponibles por día y reservar el que deseen. También cuentan con una página para ver su historial de turnos.

Panel de Administrador: Una sección protegida donde el administrador puede generar los horarios de atención, y gestionar los servicios ofrecidos (crear, ver, editar y eliminar).

Tecnologías Utilizadas
Backend: Node.js, Express, MongoDB (con Mongoose), JWT, bcryptjs.

Frontend: React (con Vite), React Router, Context API para el estado, y CSS puro para los estilos.

Cambios Realizados para el Trabajo Final - Por Ezequiel Messina
Para esta entrega final, me enfoqué en pulir la aplicación, mejorar la experiencia de usuario y fortalecer la lógica y seguridad del sistema.

1. Mejoras Visuales y de UI/UX
Rediseño de la Identidad Visual: Se implementó una nueva paleta de colores profesional y se adoptó la tipografía "Poppins" de Google Fonts para darle un aspecto más moderno y elegante a toda la aplicación.

Componentes Rediseñados: Se refactorizó el CSS de componentes clave como la Navbar, los formularios de autenticación, las tarjetas de turnos y el dashboard del administrador para que sigan la nueva línea visual.

Experiencia de Usuario Mejorada: Se eliminaron todos los alert() y confirm() nativos del navegador, reemplazándolos por un sistema de notificaciones "toast" no intrusivas (react-hot-toast), mejorando significativamente la fluidez de la interacción.

2. Mejoras de Lógica y Corrección de Bugs
Prevención de Turnos Duplicados: Se mejoró la lógica en el backend para que, antes de generar los turnos de un día, el sistema verifique proactivamente si ya existen, devolviendo un mensaje de error claro al administrador en lugar de un fallo del servidor.

Corrección de Fechas (Timezone Bug): Se solucionó un bug crítico en el frontend donde la visualización de la fecha de los turnos mostraba el día anterior debido a un mal manejo de las zonas horarias.

3. Validaciones Clave Implementadas
Para asegurar la integridad y seguridad de los datos, se implementaron varias validaciones fundamentales:

Unicidad de Email (Backend): Se garantiza que no puedan existir dos usuarios registrados con el mismo correo electrónico, tanto a nivel de base de datos (unique index) como con una verificación previa en la lógica del controlador.

Autorización por Roles (Backend y Frontend): Se implementó un sistema robusto con middlewares (isAdmin) y rutas protegidas (AdminRoute) para asegurar que solo los usuarios con rol de administrador puedan acceder a las funciones y vistas de gestión.

Confirmación de Contraseña (Frontend): Se añadió un campo "Confirmar Contraseña" en el formulario de registro con una validación en tiempo real para evitar errores de tipeo por parte del usuario al crear su cuenta.

Instalación Rápida
Clonar el repositorio.

Backend:

Navegar a la carpeta /backend.

Crear un archivo .env (basado en el .env.example si existiera, o con las variables MONGODB_URI y JWT_SECRET).

Correr npm install.

Frontend:

Navegar a la carpeta /frontend.

Correr npm install.

Ejecutar:

Correr npm run dev en una terminal para el backend.

Correr npm run dev en otra terminal para el frontend.