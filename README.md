# Lettro - Frontend

Este directorio contiene el Frontend del proyecto L3TTRO, es decir, toda la parte visual y la interfaz gráfica de usuario con la que los visitantes y creadores de contenido interactúan.

## ¿Qué contiene?

El Frontend de esta aplicación ha sido desarrollado en **React** apoyado de las siguientes tecnologías principales:
- **Vite**: Funciona como el empaquetador y entorno de desarrollo rápido principal debido a su alto rendimiento.
- **React**: Biblioteca sobre la que se construyen los componentes que conforman las vistas.
- **Tailwind CSS**: Framework de utilidades CSS altamente flexible que permite generar un estilo responsivo y estético para la aplicación web rápidamente.
- **Tiptap**: El núcleo del editor de texto que incorpora la plataforma, provee potentes capacidades para la creación y edición estructurada del contenido y las historias en formato "texto enriquecido".
- **Axios**: Estructura las llamadas HTTP y permite un sencillo flujo en las peticiones que se lanzan contra los endpoints de la API en el backend.
- **React Router Dom**: Gestor interno para manejar las distintas rutas del navegador asegurando transiciones fluidas de Single Page Application (SPA).

## ¿Cómo funciona?

El frontend funciona como un cliente interactivo independiente. Su flujo operativo principal es:
1. Estructura el cliente principal, proporcionando el renderizado de la interfaz visual directamente en el navegador de los usuarios a medida que navegan en la plataforma.
2. Cada vez que es necesario obtener los géneros de la base de datos o solicitar la lista de historias para cargarlas en interfaz, ejecuta peticiones asíncronas HTTP (mediante Axios) a la API del servidor (soluciones bajo el prefijo `/api/...`).
3. Permite, a través de herramientas avanzadas (`Tiptap`), la escritura rica de historias directamente desde una vista web para facilitar el ingreso de nueva información a la base de datos.

## Comandos para el desarrollo

Para levantar el entorno del cliente localmente, es necesario tener instalado [Node.js](https://nodejs.org) en tu equipo.

1. Instala todas las dependencias listadas en el fichero `package.json` mediante:
   ```bash
   npm install
   ```
2. Inicializa el servidor web en modo de desarrollo:
   ```bash
   npm run dev
   ```

El proyecto típicamente se abrirá y correrá en el navegador bajo la dirección `http://localhost:5173`.
*Para que la aplicación logre cargar de forma correcta los datos o historias es imprescindible contar con el proyecto de **Backend** corriendo simultáneamente.*
