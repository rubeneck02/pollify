"use strict";

import {WebSocketServer} from 'ws';
import * as HTTP from 'http';
import * as Vite from 'vite';
import {default as Express} from 'express';
import {svelte} from '@sveltejs/vite-plugin-svelte';
import Database from 'better-sqlite3';
import fs from 'fs';
import { CONFIG } from './constants.js';

// Read configuration from environment variables
const host = process.env.HOST || CONFIG.DEFAULT_HOST;
const port = parseInt(process.env.PORT) || CONFIG.DEFAULT_PORT;
const databaseFile = process.env.DATABASE_FILE || CONFIG.DATABASE_FILE;

// Create a web server.
const httpServer = HTTP.createServer();

// Create a WebSocket /api server, and attach it to the web server.
export const webSocketServer = new WebSocketServer({noServer: true});
httpServer.on('upgrade', function(req, socket, head) {
	if (req.url === CONFIG.WS_PATH) {
		webSocketServer.handleUpgrade(req, socket, head, (ws) => {
			webSocketServer.emit('connection', ws, req)
		});
	}
});

// If you want to reset to a clean database, uncomment this line for a second or two:
// fs.unlinkSync(databaseFile);
export const db = new Database(databaseFile);

process.env.ALLOW_RESET_DATABASE = false

function applySchema(){
    // Make sure tables and initial data exist in the database
	db.exec(fs.readFileSync('./backend/schema.sql').toString());
    db.prepare('PRAGMA foreign_keys = ON').run();
}

function dropAllTables(){
    db.prepare('PRAGMA foreign_keys = OFF').run();
    for(let row of db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name != 'sqlite_sequence'").all()) {
      db.prepare(`drop table "${row['name']}"`).run();
    }
}



async function start() {
	// Import api.js after creating webSocketServer, so that the API may use it.
	const API = await import('./api.js');

	// Create an express app, and attach it to the web server.
	const app = Express();
	httpServer.on('request', app);

	// Parse body as json as default, must be removed after completely use of websocket.
	app.use(Express.json());

	// We're using the Better-SQLite3 NPM module as a database.
	// Documentation: https://github.com/JoshuaWise/better-sqlite3/wiki/API

	applySchema()

	if (process.env.ALLOW_RESET_DATABASE) {
		app.put('/reset_database', function(req,rsp) {
			dropAllTables();
			applySchema();
		rsp.json({});
		});
	
	}
	// Make sure tables and initial data exist in the database
	db.exec(fs.readFileSync('./backend/schema.sql').toString());
	// Attach the /api router to the express app.
	app.use('/api', API.router);


	// Configure express to use Vite with the Svelte plugin.
	app.use((await Vite.createServer({
		logLevel: 'info',
		server: {
			middlewareMode: true,
			hmr: {server: httpServer}
		},
		plugins: [
			svelte(),
		],
		appType: 'spa',
	})).middlewares);

	// Bind the web server to a TCP port.
	httpServer.listen(port, host, () => {
		console.log(`Running at http://${host}:${port}`);
	});
}

start();
