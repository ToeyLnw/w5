import http from "http";
import { app } from "./app";

const port = process.env.port || 3000;
const server = http.createServer(app);

server.listen(port, () => {
  console.log("Server is started");
});
//npx ts-node server.ts 

//restart after saved
// npx nodemon server.ts