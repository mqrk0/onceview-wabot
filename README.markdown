# Funkdebeleza WhatsApp Bot

A lightweight WhatsApp bot built with Node.js and the `@whiskeysockets/baileys` library, designed to extract and forward "view-once" messages (images, videos, or documents) to designated owner numbers. The bot supports both private chats and groups, with specific restrictions for group usage.

## Features

- **Command: `onceview` (`!ov` or `?ov`)**:
  - **Private Chats**: Any user can use `!ov` by quoting a view-once message (image, video, or document). The media is silently forwarded to the owner numbers without any response to the user.
  - **Groups**: Only group admins can use `?ov`, and the command can only be executed **once per group**. The media is forwarded to the owners silently.
  - Owners receive the media with a caption indicating the source (group or private chat).
- **Silent Operation**: The bot does not send any confirmation or error messages to the user executing the command.
- **Database Tracking**: Uses a simple JSON database (`database.json`) to track command usage in groups, ensuring the once-per-group restriction.
- **Logging**: Comprehensive logging with `pino` for debugging and monitoring.

## Project Structure

```
├── commands
│   └── onceview.js        # Command to handle view-once message extraction
├── handlers
│   ├── commandHandler.js  # Processes commands with prefix
│   ├── groupHandler.js    # Handles group messages
│   └── messageHandler.js  # Handles private chat messages
├── utils
│   ├── database.js        # JSON-based database for tracking group command usage
│   └── helpers.js         # Logging utility using pino
├── config.js              # Bot configuration (prefixes, owners, paths)
├── index.js               # Main entry point for the bot
├── package.json           # Project dependencies and scripts
└── README.md              # Project documentation (this file)
```

## Prerequisites

- **Node.js**: Version 18.0.0 or higher (tested with v22.14.0).
- **WhatsApp Account**: A phone number to connect the bot via QR code scanning.
- **Dependencies**: Listed in `package.json`.

## Installation

1. **Clone or Set Up the Project**:
   - If you have a repository, clone it:
     ```bash
     git clone <repository-url>
     cd funkdebeleza
     ```
   - Otherwise, create the project directory and add the files as described.

2. **Install Dependencies**:
   - Ensure `package.json` is configured as below, then run:
     ```bash
     npm install
     ```

3. **Configure the Bot**:
   - The configuration is hardcoded in `config.js`. Key settings:
     - **Prefixes**: `!` for private chats, `?` for groups.
     - **Owners**: Numbers (`593978619941`, `593967532598`, `528342711468`) to receive forwarded view-once messages.
     - **Database**: Stores command usage in `database.json`.

## `package.json`

```json
{
    "name": "funkdebeleza",
    "version": "1.0.0",
    "description": "WhatsApp Bot de funkdebeleza",
    "main": "index.js",
    "type": "module",
    "scripts": {
        "start": "node index.js",
        "dev": "nodemon index.js"
    },
    "author": "Xd",
    "license": "ISC",
    "dependencies": {
        "@whiskeysockets/baileys": "^6.7.18",
        "pino": "^8.21.0",
        "pino-pretty": "^13.1.1",
        "qrcode-terminal": "^0.12.0"
    },
    "devDependencies": {
        "nodemon": "^3.1.0"
    },
    "engines": {
        "node": ">=18.0.0"
    }
}
```

## Usage

1. **Start the Bot**:
   - Run the bot in production mode:
     ```bash
     npm start
     ```
   - Or in development mode (with auto-restart):
     ```bash
     npm run dev
     ```

2. **Connect to WhatsApp**:
   - A QR code will appear in the terminal. Scan it with your WhatsApp account (Settings > Linked Devices > Link a Device).
   - Once connected, the bot will log: `Conectado como <number>` and send a confirmation message to the connected number.

3. **Using the `onceview` Command**:
   - **Private Chat**:
     - Send `!ov` while quoting a view-once message (image, video, or document).
     - The media is forwarded to the owner numbers silently.
   - **Group Chat**:
     - Send `?ov` while quoting a view-once message.
     - Only works for group admins and only once per group.
     - The media is forwarded to the owners silently.

4. **Owner Notifications**:
   - Owners (`593978619941`, `593967532598`, `528342711468`) receive the media with a caption like:
     - `📸 View-once recuperado\n📍 Grupo: <group-id>` (for groups)
     - `📸 View-once recuperado\n📍 Chat: <user-id>` (for private chats)

## Development Notes

- **ES Modules**: The project uses ES Modules (`"type": "module"` in `package.json`), so all imports use `import` syntax.
- **Logging**: Logs are generated using `pino` and `pino-pretty`. Check the console for debugging information.
- **Database**: The `database.js` module manages a JSON file (`database.json`) to track the usage of the `onceview` command in groups.
- **Error Handling**: Errors are logged silently without notifying the user, as per the requirement for silent operation.

## Troubleshooting

- **QR Code Not Showing**:
  - Ensure `qrcode-terminal` is installed (`npm install qrcode-terminal`).
  - Verify that `index.js` uses `import qrcode from 'qrcode-terminal'` and not `require`.
- **Command Not Working**:
  - Check logs for errors (`pino` output in the console).
  - Ensure the message being quoted is a valid view-once message.
  - In groups, verify that the user is an admin and the command hasn’t been used before.
- **Dependency Issues**:
  - Remove `node_modules` and `package-lock.json`, then run `npm install`:
    ```bash
    rm -rf node_modules package-lock.json
    npm install
    ```

## Modifications History

- **Removed `.env` Dependency**: Configuration is now hardcoded in `config.js` for simplicity.
- **Restricted Commands**: Only the `onceview` command is available. Other commands (`ping`, `sticker`, `toimg`) were removed.
- **Silent Operation**: The `onceview` command does not send any responses or error messages to the user.
- **Group Restriction**: The command is limited to one use per group, enforced via `database.json`.
- **Private Chat Access**: Any user can use `!ov` in private chats, not just owners.

## Contributing

Feel free to fork the repository and submit pull requests for improvements. Ensure any changes maintain the silent operation and group restrictions.

## License

This project is licensed under the ISC License. See the `package.json` for details.