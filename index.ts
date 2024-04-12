import 'dotenv-safe/config'; // Concise import for dotenv-safe

console.log(`[BackEnd]=> Starting...`);

import express, { Request, Response } from 'express';

const app = express();

import http from 'http';

import routes from './src/Routes/routes';

// Use express.json() middleware to parse JSON request bodies
app.use(express.json());

// Define generic route handlers for GET, POST, DELETE, and PUT requests
const handleRequest = (req: Request, res: Response) => routes(req, res);

app.get('*', handleRequest);
app.post('*', handleRequest);
app.delete('*', handleRequest);
app.put('*', handleRequest);

// Create the server and listen on the port
const server = http.createServer(app);

server.listen(process.env.PORT || 3000, () => {
  console.log(`[BackEnd]=> Successfully Loaded!`);
});

// Error handling for the server
server.on('error', (err) => {
  console.error(`[Erro do servidor]:`, err);
});
