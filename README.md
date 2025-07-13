Proyecto: Gestión de Turnos para Peluquería (Stack MERN)
Este proyecto es una aplicación web Full-Stack construida con el stack MERN (MongoDB, Express, React, Node.js). El objetivo fue desarrollar un sistema completo para la gestión de turnos, con funcionalidades diferenciadas para clientes y administradores.

📝 Cambios Realizados para el Trabajo Final - Por Ezequiel Messina
Para esta entrega final, el foco estuvo en pulir la aplicación, mejorar la experiencia de usuario y fortalecer la lógica y seguridad del sistema.

1. Mejoras Visuales y de UI/UX
Rediseño de la Identidad Visual: Se implementó una nueva paleta de colores profesional (gris carbón, blanco hueso y acentos en dorado) y se adoptó la tipografía "Poppins" para darle un aspecto más moderno y elegante.

Componentes Rediseñados: Se refactorizó el CSS de componentes clave como la Navbar, formularios, tarjetas de turnos y el dashboard del administrador.

Experiencia de Usuario Mejorada: Se reemplazaron los alert() y confirm() por notificaciones "toast" no intrusivas, mejorando significativamente la fluidez de la interacción.

2. Mejoras de Lógica y Corrección de Bugs
Prevención de Turnos Duplicados: Se mejoró la lógica en el backend para que, antes de generar los turnos, el sistema verifique proactivamente si ya existen, devolviendo un mensaje de error claro al administrador.

Corrección de Fechas (Timezone Bug): Se solucionó un bug en el frontend donde la visualización de la fecha de los turnos mostraba el día anterior debido a un mal manejo de las zonas horarias.

3. Validaciones Clave Implementadas
Para asegurar la integridad y seguridad de los datos, se implementaron varias validaciones fundamentales:

Unicidad de Email (Backend): Se garantiza que no puedan existir dos usuarios registrados con el mismo correo electrónico, tanto a nivel de base de datos (unique index) como con una verificación previa en la lógica del controlador.

Autorización por Roles (Backend y Frontend): Se implementó un sistema robusto con middlewares (isAdmin) y rutas protegidas (AdminRoute) para asegurar que solo los usuarios con rol de administrador puedan acceder a las funciones y vistas de gestión.

Confirmación de Contraseña (Frontend): Se añadió un campo "Confirmar Contraseña" en el formulario de registro con una validación en tiempo real para evitar errores de tipeo por parte del usuario.

✨ Funcionalidades Principales
Autenticación y Usuarios
Registro e Inicio de Sesión: Los usuarios pueden crear una cuenta y acceder al sistema.

Autenticación con JWT: La seguridad de la API se gestiona mediante JSON Web Tokens, asegurando que solo usuarios autenticados puedan realizar ciertas acciones.

Roles de Usuario: El sistema diferencia entre roles de cliente y administrador, cada uno con distintos niveles de permisos.

Funcionalidades para Clientes
Visualización de Turnos: Permite seleccionar una fecha y ver una grilla con todos los turnos del día, mostrando su hora y estado ('disponible' o 'reservado').

Reserva de Turnos: Los usuarios que han iniciado sesión pueden reservar cualquier turno que se encuentre disponible.

Historial de Turnos: Una página dedicada para que los clientes puedan ver un listado de todos sus turnos reservados.

Funcionalidades para Administradores
Dashboard Protegido: Un panel de control accesible únicamente para usuarios con rol de administrador.

Generación de Turnos: Un administrador puede generar todos los slots de turnos para un día específico desde la interfaz.

Gestión de Servicios: Se ha implementado un CRUD completo (Crear, Ver, Editar y Eliminar) para que un administrador pueda gestionar los servicios que ofrece la peluquería.

🛠️ Tecnologías Utilizadas
Backend
Node.js: Entorno de ejecución para JavaScript del lado del servidor.

Express.js: Framework para construir la API REST.

MongoDB (Atlas): Base de datos NoSQL en la nube.

Mongoose: ODM para modelar y facilitar la interacción con MongoDB.

JSON Web Token (jsonwebtoken): Para la generación y verificación de tokens de acceso.

bcryptjs: Para encriptar de forma segura las contraseñas.

Frontend
React.js: Librería para construir la interfaz de usuario.

Vite: Herramienta de desarrollo y empaquetado.

React Router DOM: Para gestionar el enrutamiento y la navegación.

React Context API: Para el manejo del estado global de la autenticación.

react-hot-toast: Para mostrar notificaciones modernas y no intrusivas.

CSS3: Para los estilos de la aplicación.

🚀 Puesta en Marcha del Proyecto
Instrucciones resumidas para correr el proyecto en un entorno local.

Roles de Usuario: El sistema diferencia entre roles de cliente y administrador, cada uno con distintos niveles de permisos.

Funcionalidades para Clientes
Visualización de Turnos: Permite seleccionar una fecha y ver una grilla con todos los turnos del día, mostrando su hora y estado ('disponible' o 'reservado').

Reserva de Turnos: Los usuarios que han iniciado sesión pueden reservar cualquier turno que se encuentre disponible.

Historial de Turnos: Una página dedicada para que los clientes puedan ver un listado de todos sus turnos reservados.

Funcionalidades para Administradores
Dashboard Protegido: Un panel de control accesible únicamente para usuarios con rol de administrador.

Generación de Turnos: Un administrador puede generar todos los slots de turnos para un día específico desde la interfaz.

Gestión de Servicios: Se ha implementado un CRUD completo (Crear, Ver, Editar y Eliminar) para que un administrador pueda gestionar los servicios que ofrece la peluquería.

🛠️ Tecnologías Utilizadas
Backend
Node.js: Entorno de ejecución para JavaScript del lado del servidor.

Express.js: Framework para construir la API REST.

MongoDB (Atlas): Base de datos NoSQL en la nube.

Mongoose: ODM para modelar y facilitar la interacción con MongoDB.

JSON Web Token (jsonwebtoken): Para la generación y verificación de tokens de acceso.

bcryptjs: Para encriptar de forma segura las contraseñas.

Frontend
React.js: Librería para construir la interfaz de usuario.

Vite: Herramienta de desarrollo y empaquetado.

React Router DOM: Para gestionar el enrutamiento y la navegación.

React Context API: Para el manejo del estado global de la autenticación.

react-hot-toast: Para mostrar notificaciones modernas y no intrusivas.

CSS3: Para los estilos de la aplicación.

🚀 Puesta en Marcha del Proyecto
Instrucciones resumidas para correr el proyecto en un entorno local.

Clonar el repositorio.

Backend:

Navegar a la carpeta /backend.

Crear un archivo .env con las variables MONGODB_URI y JWT_SECRET.
Crear un archivo .env con las variables MONGODB_URI y JWT_SECRET.

Correr npm install.

Frontend:

Navegar a la carpeta /frontend.

Correr npm install.

Ejecutar:

Correr npm run dev en una terminal para el backend.

Correr npm run dev en otra terminal para el frontend.

