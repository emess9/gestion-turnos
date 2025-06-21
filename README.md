Gestión de Turnos - Peluquería (Proyecto MERN)
Este es un proyecto Full-Stack desarrollado con el stack MERN (MongoDB, Express, React, Node.js) que simula un sistema de gestión de turnos para una peluquería. La aplicación permite a los clientes ver y reservar turnos disponibles, mientras que los administradores tienen la capacidad de gestionar los servicios y generar los horarios de atención.

 Características Principales
Autenticación y Usuarios
Registro e Inicio de Sesión: Los usuarios pueden crear una cuenta y acceder al sistema.

Autenticación con JWT: La seguridad de la API se gestiona mediante JSON Web Tokens, asegurando que solo usuarios autenticados puedan realizar ciertas acciones.

Roles de Usuario: El sistema diferencia entre roles de cliente y administrador, cada uno con distintos niveles de permisos.

Funcionalidades para Clientes
Visualización de Turnos: Permite seleccionar una fecha y ver una grilla con todos los turnos del día, mostrando su hora y estado ('disponible' o 'reservado').

Reserva de Turnos: Los usuarios que han iniciado sesión pueden reservar cualquier turno que se encuentre disponible.

Funcionalidades para Administradores (vía API)
Generación de Turnos: Un administrador puede generar todos los slots de turnos para un día específico.

Gestión de Servicios: Se ha implementado un CRUD completo en la API para que un administrador pueda crear, leer, actualizar y eliminar los servicios que ofrece la peluquería.

Tecnologías Utilizadas

Backend
Node.js: Entorno de ejecución para JavaScript del lado del servidor.

Express.js: Framework para construir la API REST.

MongoDB (Atlas): Base de datos NoSQL en la nube para almacenar toda la información.

Mongoose: ODM (Object Data Modeling) para modelar y facilitar la interacción con MongoDB.

JSON Web Token (jsonwebtoken): Para la generación y verificación de tokens de acceso.

bcryptjs: Para encriptar de forma segura las contraseñas de los usuarios.

Frontend
React.js: Librería para construir la interfaz de usuario.

Vite: Herramienta de desarrollo y empaquetado ultra rápida.

React Router DOM: Para gestionar el enrutamiento y la navegación entre páginas.

React Context API: Para el manejo del estado global de la autenticación.

CSS3: Para los estilos de la aplicación.

 Puesta en Marcha del Proyecto
Sigue estos pasos para clonar y correr el proyecto en tu entorno local.

Prerrequisitos
Tener instalado Node.js (que incluye npm).

Tener una cuenta de MongoDB Atlas para crear un clúster gratuito.

Instalación
Clonar el repositorio:

git clone [TU_URL_DEL_REPOSITORIO_AQUI]
cd gestion-turnos-app # O el nombre de tu carpeta

Configurar el Backend:

Navega a la carpeta del backend:

cd backend

Instala las dependencias:

npm install

Configurar el Frontend:

Desde la raíz del proyecto, navega a la carpeta del frontend:

cd ../frontend

Instala las dependencias:

npm install

Ejecutar la Aplicación
Necesitarás dos terminales abiertas para correr ambos servidores simultáneamente.

Terminal 1 - Iniciar el Backend:

# Desde la carpeta /backend
npm run dev

El servidor de la API estará corriendo en http://localhost:3001.

Terminal 2 - Iniciar el Frontend:

# Desde la carpeta /frontend
npm run dev

La aplicación de React estará disponible en http://localhost:5173 (o el puerto que indique Vite).

Estructura del Proyecto

El proyecto sigue una estructura monorepo, separando claramente el backend del frontend.

/
├── backend/
│   ├── controllers/  # Lógica de negocio
│   ├── middlewares/  # Funciones intermedias (auth)
│   ├── models/       # Esquemas de Mongoose
│   ├── routes/       # Definición de rutas de la API
│   ├── .env          # (local) Variables de entorno
│   └── server.js     # Punto de entrada del servidor
│
└── frontend/
    └── src/
        ├── components/   # Componentes reutilizables (Navbar)
        ├── context/      # Estado global (AuthContext)
        ├── pages/        # Componentes de página (Home, Login)
        ├── services/     # Lógica de llamadas a la API
        ├── App.jsx       # Componente principal y enrutador
        └── main.jsx      # Punto de entrada de la app React
