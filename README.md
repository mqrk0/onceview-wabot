# ONCEVIEW - Bot de WhatsApp

ONCEVIEW es un bot de WhatsApp desarrollado en Node.js con la librería `@whiskeysockets/baileys`. Su función principal es extraer mensajes de tipo "view-once" (imágenes, videos o documentos) y enviarlos a los dueños configurados, con soporte para chats privados y grupales. Es modular, ligero y fácil de personalizar.

## Características
- **Extracción de mensajes view-once**: Descarga y envía imágenes, videos o documentos de mensajes "view-once" a los dueños.
- **Comandos con prefijos**: Usa `!` en chats privados y `?` en grupos.
- **Restricciones en grupos**: Solo administradores pueden usar el comando `onceview`, limitado a una ejecución por grupo.
- **Reconexión automática**: Maneja desconexiones con reintentos automáticos.
- **Base de datos JSON**: Almacena datos en `database.json` para gestionar el estado.
- **Configuración flexible**: Personaliza prefijos, dueños y más en `config.js`.

## Requisitos
- **Node.js**: v18.0.0 o superior.
- **WhatsApp**: Cuenta activa para autenticación vía código QR.
- **Dependencias**: Ver `package.json`.

## Instalación
1. Clona el repositorio:
   ```bash
   git clone https://github.com/mqrk0/onceview-wabot.git
   cd onceview-wabot
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura el archivo `config.js`:
   - Ajusta los JIDs en `bot.owner` y `bot.admins`.
   - Verifica las rutas en `paths` para comandos, manejadores y base de datos.

4. Inicia el bot:
   ```bash
   npm start
   ```
   Para desarrollo con recarga automática:
   ```bash
   npm run dev
   ```

5. Autenticación:
   - Escanea el código QR en la terminal con WhatsApp (Configuración > Dispositivos Vinculados).
   - La sesión se guarda en la carpeta `session`.

## Estructura del Proyecto
```
onceview-wabot/
├── commands/                 # Comandos del bot
│   └── onceview.js          # Extrae mensajes view-once
├── handlers/                # Manejadores de eventos
│   ├── commandHandler.js    # Procesa comandos
│   ├── groupHandler.js      # Maneja mensajes grupales
│   └── messageHandler.js    # Maneja mensajes privados
├── node_modules/            # Dependencias de Node.js
├── session/                 # Datos de la sesión
├── utils/                   # Utilidades
│   ├── database.js          # Gestión de base de datos JSON
│   └── helpers.js           # Logger personalizado
├── config.js                # Configuración del bot
├── database.json            # Base de datos JSON
├── index.js                 # Punto de entrada
└── package.json             # Dependencias y scripts
```

## Uso
- **Comando principal**:
  - `!onceview` (chats privados) o `?onceview` (grupos): Extrae un mensaje view-once y lo envía a los dueños.
  - En grupos, solo administradores pueden usarlo, y está limitado a una ejecución por grupo.

- **Ejemplo**:
  1. Un usuario envía un mensaje view-once en un grupo.
  2. Un administrador responde con `?onceview`.
  3. El bot envía el medio (imagen, video o documento) a los dueños configurados.

## Configuración
El archivo `config.js` permite personalizar:
- **session**: Carpeta y nombre para la sesión.
- **bot**:
  - `prefix`: `!` para chats privados.
  - `groupPrefix`: `?` para grupos.
  - `owner`: JID del dueño principal.
  - `admins`: Lista de JIDs de administradores.
  - `blockedUsers`: Usuarios bloqueados.
- **features**:
  - `silentMode`: Activa/desactiva modo silencioso.
  - `autoRead`: Activa/desactiva lectura automática.
- **paths**: Rutas para comandos, manejadores y base de datos.

## Contribuir
1. Haz un fork del repositorio.
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza cambios y haz commit (`git commit -m 'Añadir funcionalidad'`).
4. Sube la rama (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request.

## Licencia
Licencia ISC (ver `package.json`).

## Aviso Legal
Este bot no está afiliado con WhatsApp. Úsalo bajo tu responsabilidad, respetando las políticas de WhatsApp para evitar bloqueos.
