#  Plataforma de Destinos Turísticos (Frontend)

Este repositorio contiene el código fuente del **Frontend** para una aplicación social de turismo. La plataforma permite a los usuarios compartir destinos, visualizarlos en un mapa interactivo, gestionar perfiles y cuenta con un sistema de moderación para asegurar la calidad del contenido.

Desarrollado con **React**, **Vite** y gestionado con **Yarn**.


##  Características Principales

* **Mapa Interactivo:** Visualización de destinos geolocalizados utilizando `Leaflet` y `React-Leaflet`.
* **Roles de Usuario:**
    * **Viajero (Usuario):** Puede crear destinos, subir fotos, gestionar su perfil (público/privado) y ver sus reseñas.
    * **Moderador/Admin:** Panel dedicado para aprobar o rechazar destinos pendientes y gestionar usuarios.
* **Gestión de Destinos:** Formulario para crear nuevos destinos con subida de imágenes y selección de visibilidad (público/privado).
* **Perfiles Sociales:**
    * Perfil privado para gestión personal.
    * Perfil público para ver el nivel, puntos y destinos compartidos de otros usuarios.
* **Búsqueda y Filtrado:** Buscador integrado y filtrado visual por provincias.

##  Stack Tecnológico

* **Core:** [React 18](https://reactjs.org/) + [Vite](https://vitejs.dev/)
* **Enrutamiento:** [React Router DOM v7](https://reactrouter.com/)
* **Mapas:** [Leaflet](https://leafletjs.com/) + [React Leaflet](https://react-leaflet.js.org/)
* **Peticiones HTTP:** Axios
* **Estado y Auth:** React Context API + React Cookie
* **UI/Notificaciones:** React Toastify
* **Estilos:** CSS Modules / CSS estándar

##  Requisitos Previos

Asegúrate de tener instalado:
* [Node.js](https://nodejs.org/) 
* [Yarn](https://yarnpkg.com/)
* [repo-back](https://github.com/sedagame01/Proyecto-Personal-back.git)

##  Instalación y Puesta en Marcha

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/sedagame01/Proyecto-Personal-front.git
    cd cliente
    ```

2.  **Instalar dependencias:**
    ```bash
    yarn install
    ```

3.  **Configurar Variables de Entorno:**
    Crea un archivo `.env` en la raíz del proyecto basado en la configuración de tu API Backend.
    ```env
    VITE_API_URL=http://localhost:tu_puerto_backend/api
    ```

4.  **Ejecutar en modo desarrollo:**
    ```bash
    yarn dev
    ```
    La aplicación estará disponible en `http://localhost:3000` 
##  Estructura del Proyecto

```text
src/
├── api/            # Configuración de Axios (connect.js)
├── components/     # Componentes reutilizables (Map, Modal, Cards)
│   └── profile/    # Componentes específicos de perfil (Header, Reviews)
├── context/        # Contexto global (AuthContext)
├── pages/          # Vistas principales
│   ├── CreateDestino.jsx  # Formulario de alta
│   ├── Home.jsx           # Landing page con mapa
│   ├── Moderator.jsx      # Panel de administración
│   ├── Profile.jsx        # Perfil privado
│   └── PublicProfile.jsx  # Perfil público
├── styles/         # Archivos CSS globales y específicos
└── main.jsx        # Punto de entrada

### Herramientas de desarrollo
- Git y GitHub  
- Nodemon  
- Postman para pruebas de endpoints
- Multer para subida de imágenes

## Roles y permisos
### Usuario
- Crear destinos
- Editar destinos propios
- Comentar en destinos
- Eliminar destinos Propios

### Administrador
- Gestion de Solicitud de destinos
- Cambio de rol de usuarios
- CRUD destinos
- Eliminacion de comentarios en destinos
