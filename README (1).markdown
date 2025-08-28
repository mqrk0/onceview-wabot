# ONCEVIEW - Bot de WhatsApp

ONCEVIEW es un bot de WhatsApp desarrollado en Node.js utilizando la librería `@whiskeysockets/baileys`. Este bot permite extraer y gestionar mensajes de tipo "view-once" (imágenes, videos o documentos) en chats privados y grupales, enviándolos a los dueños configurados. Está diseñado para ser ligero, modular y fácil de extender con nuevos comandos.

## Características
- **Extracción de mensajes view-once**: Descarga y envía imágenes, videos o documentos de mensajes "view-once" a los dueños del bot.
- **Gestión de comandos**: Soporte para comandos con prefijos (`!` para chats privados y `?` para grupos).
- **Restricciones de uso**: Limita el uso del comando `onceview` en grupos a administradores y a una sola ejecución por grupo.
- **Reconexión automática**: Maneja desconexiones y reintentos automáticos para mantener el bot en línea.
- **Base de datos simple**: Almacena datos en un archivo JSON (`database.json`) para gestionar el estado del bot.
- **Configuración modular**: Usa un archivo `config.js` para personalizar prefijos, dueños, administradores y más.

## Requisitos
- **Node.js**: Versión 18.0.0 o superior.
- **WhatsApp**: Una cuenta de WhatsApp para autenticar el bot mediante un código QR.
- **Dependencias**: Listadas en `package.json`.

## Instalación
1. **Clona el repositorio**:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd ONCEVIEW
   ```

2. **Instala las dependencias**:
   ```bash
   npm install
   ```

3. **Configura el entorno**:
   - Asegúrate de que el archivo `config.js` esté correctamente configurado con los JIDs de los dueños y administradores.
   - Revisa las rutas en `config.js` para asegurarte de que apunten a los directorios correctos (`commands`, `handlers`, `database.json`).

4. **Inicia el bot**:
   ```bash
   npm start
   ```
   O para desarrollo con recarga automática:
   ```bash
   npm run dev
   ```

5. **Autenticación**:
   - Escanea el código QR que aparece en la terminal con tu aplicación de WhatsApp (Configuración > Dispositivos Vinculados > Vincular un dispositivo).
   - La sesión se guardará en la carpeta `session` para evitar autenticaciones futuras.

## Estructura del Proyecto
```
ONCEVIEW/
├── commands/                  # Comandos del bot
│   └── onceview.js           # Comando para extraer mensajes view-once
├── handlers/                 # Manejadores de eventos
│   ├── commandHandler.js     # Procesa comandos
│   ├── groupHandler.js       # Maneja mensajes en grupos
│   └── messageHandler.js     # Maneja mensajes en chats privados
├── node_modules/             # Dependencias de Node.js
├── session/                  # Almacena datos de la sesión
├── utils/                    # Utilidades
│   ├── database.js           # Funciones para manejar la base de datos JSON
│   └── helpers.js            # Logger personalizado
├── config.js                 # Configuración del bot
├── database.json             # Base de datos JSON
├── index.js                  # Punto de entrada del bot
└── package.json              # Dependencias y scripts
```

## Uso
- **Comandos**:
  - `!onceview` (en chats privados) o `?onceview` (en grupos): Extrae un mensaje view-once y lo envía a los dueños configurados.
  - Solo los administradores pueden usar el comando en grupos, y solo una vez por grupo.

- **Ejemplo**:
  1. Un usuario envía un mensaje view-once en un grupo.
  2. Un administrador escribe `?onceview` respondiendo al mensaje.
  3. El bot descarga el medio (imagen, video o documento) y lo envía a los dueños configurados en `onceview.js`.

## Configuración
El archivo `config.js` contiene las siguientes opciones:
- **session**: Configura la carpeta y el nombre para almacenar la sesión.
- **bot**:
  - `prefix`: Prefijo para comandos en chats privados (`!`).
  - `groupPrefix`: Prefijo para comandos en grupos (`?`).
  - `owner`: JID del dueño principal.
  - `admins`: Lista de JIDs de administradores.
  - `blockedUsers`: Lista de usuarios bloqueados.
- **features**:
  - `silentMode`: Habilita/desactiva el modo silencioso.
  - `autoRead`: Habilita/desactiva la lectura automática de mensajes.
  - `limits.stickerSize`: Límite de tamaño para stickers.
- **paths**: Rutas para comandos, manejadores y base de datos.

## Contribuir
¡Las contribuciones son bienvenidas! Sigue estos pasos:
1. Haz un fork del repositorio.
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus cambios y haz commit (`git commit -m 'Añadir nueva funcionalidad'`).
4. Sube tus cambios (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request.

## Licencia
Este proyecto está bajo la licencia ISC. Consulta el archivo `package.json` para más detalles.

## Aviso Legal
Este bot no está afiliado, autorizado, ni respaldado por WhatsApp o sus afiliados. El uso de este bot es bajo tu propio riesgo, y los desarrolladores no se hacen responsables por posibles bloqueos de cuentas. Usa con precaución y respeta las políticas de WhatsApp.