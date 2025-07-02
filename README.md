# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
# Scavenger Hunt Web Application - README

## Descripción

This web application is a scavenger hunt game built with React. It allows users to participate in a series of location-based challenges in Medellín, Colombia. The application includes user registration, a clue-solving interface, an admin panel for managing clues, and a map to visualize the hunt.

## Funcionalidades Implementadas

### 1. Tema Claro y Oscuro

*   **Descripción:** Permite a los usuarios cambiar entre un tema visual claro y oscuro para una mejor experiencia de uso según sus preferencias y condiciones de luz.
*   **Implementación:** Se utilizaron variables CSS y un interruptor en la esquina superior derecha de la aplicación para gestionar los temas.
*   **Persistencia:** El tema seleccionado se guarda en `localStorage` para que se recuerde al volver a cargar la página.

### 2. Reinicio de la Carrera

*   **Descripción:** Los administradores pueden reiniciar la carrera, borrando toda la información del equipo del `localStorage`.
*   **Implementación:** Se añadió un botón "Reiniciar Carrera" en el panel de administración que, previa confirmación, borra los datos del equipo y redirige a la pantalla de registro.

### 3. Pistas con Acertijos y Ayudas

*   **Descripción:** Los jugadores resuelven una serie de pistas con acertijos, coordenadas y palabras de seguridad. Las ayudas se pueden mostrar y ocultar.
*   **Implementación:** Se utiliza un arreglo de objetos de pistas que contienen los datos del acertijo, ayuda, coordenadas y respuesta.

### 4. Registro de Equipo

*   **Descripción:** Los equipos se registran antes de comenzar la carrera, proporcionando su nombre, integrantes, grupo scout y una foto.
*   **Implementación:** Se creó un formulario de registro que guarda la información del equipo en el `localStorage`.

### 5. Foto del Equipo

*   **Descripción:** Permite cargar una foto del equipo desde la cámara web del celular durante el registro.
*   **Implementación:** Se utiliza la API `getUserMedia` para acceder a la cámara y capturar la foto, que se guarda como una URL `base64` en el `localStorage`.

### 6. Módulo de Administración

*   **Descripción:** Un panel de administración protegido por contraseña permite gestionar las pistas.
*   **Implementación:** Se creó un componente `Admin` que permite agregar, editar, eliminar y reordenar las pistas.

### 7. Vista del Mapa de Ruta

*   **Descripción:** Muestra un mapa con el trazado de las pistas.
*   **Implementación:** Se utiliza la librería `Leaflet` para mostrar un mapa con marcadores en las coordenadas de cada pista.

### 8. Confirmación de Finalización de Pista por Correo

*   **Descripción:** Al completar una pista, se envía un correo electrónico a una dirección configurada.
*   **Implementación:** Se utiliza la función `mailto:` para abrir el cliente de correo del usuario con un correo pre-redactado que incluye el nombre del equipo, la hora de finalización del reto y el tiempo total desde que se inició el reto hasta que se ingresó la clave de la pista.

### 9. Tiempos de Pista y Tiempo Total

*   **Descripción:** Se registran y envían por correo electrónico los tiempos tomados en completar cada pista y el tiempo total transcurrido.
*   **Implementación:** Se calcula y guarda el tiempo entre pistas y el tiempo total, mostrándolos en el correo electrónico de confirmación.

### 10. Persistencia del Progreso

*   **Descripción:** Si el usuario refresca la página, la aplicación recordará la pista en la que se quedó.
*   **Implementación:** Se guarda el índice de la última pista completada en el `localStorage` y se utiliza para reiniciar la carrera en la pista correcta.

### 11. Reordenamiento de Pistas con Drag and Drop

*   **Descripción:** Los administradores pueden cambiar el orden de las pistas arrastrándolas y soltándolas en el panel de administración.
*   **Implementación:** Se utiliza la librería `react-beautiful-dnd` para implementar la funcionalidad de arrastrar y soltar.

### 12. Previsualización de Pistas

*   **Descripción:** Los administradores pueden obtener una vista previa de cada pista antes de modificarla.
*   **Implementación:** Al hacer clic en el botón "Mostrar" de una pista en el panel de administración, se muestra un popup con la información completa de la pista.

### 13. Clave de Seguridad

*   **Descripción:** Se requiere autenticación para acceder a los módulos de administración y mapa.
*   **Implementación:** Se implementó un sistema de autenticación sencillo con una clave única.

### 14. Mensaje de Confirmación de Guardado

*   **Descripción:** Se muestra un mensaje de confirmación al guardar los cambios en el panel de administración.
*   **Implementación:** Se utiliza un estado local para controlar la visibilidad del mensaje, que desaparece automáticamente después de unos segundos.

### 15. Modificar Registro

*   **Descripción:** Los usuarios pueden modificar la información del equipo después de haberla ingresado inicialmente.
*   **Implementación:** Se añadió un botón "Modificar Registro" en el panel izquierdo que lleva al formulario de registro con la información precargada.

### 16. Información del Equipo en la Vista Principal

*   **Descripción:** Se muestra la información del equipo (nombre, integrantes) en la vista principal de la carrera.
*   **Implementación:** Se lee la información del equipo del `localStorage` y se muestra en la vista principal.

### 17. Tabla de Tiempos en el Registro

*   **Descripción:** Al modificar el registro, se muestra una tabla con los tiempos de cada pista completada hasta el momento.
    *   La aplicación ahora guarda en `localStorage` la hora en que se inscribe un equipo, y para cada pista, se guarda el tiempo entre pistas y el tiempo total transcurrido.
*   **Implementación:** Se lee la información del equipo del `localStorage` y se muestra en la vista principal.

## Próximos Pasos

*   Implementar la funcionalidad de "Agregar Pista" en el componente Admin, incluyendo la generación de un ID único y la persistencia en `localStorage`.
*   Añadir un campo de búsqueda en el panel de administración para filtrar las pistas por acertijo o ID.
*   Añadir un icono de sol/luna al interruptor de tema.
*   Hacer que el mapa se centre y ajuste el zoom automáticamente para mostrar todas las pistas.
*   Implementa un sistema de autenticación más seguro, por ejemplo, utilizando un backend con Node.js y una base de datos.
*   Implementa tests unitarios para los componentes principales
*   Implementar la lógica faltante para el guardado de datos, agregar nuevas pistas (generar IDs únicos), reordenar pistas (posiblemente con una librería externa), validación de datos.
*   Implementa una base de datos para almacenar los datos de los usuarios y las pistas
*   Mejorar la seguridad de la contraseña de administrador
*   Implementa la funcionalidad de "Agregar Pista" en el componente Admin, incluyendo la generación de un ID único y la persistencia en `localStorage`

