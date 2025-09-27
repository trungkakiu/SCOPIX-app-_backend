import express from "express";
import bodyParser from "body-parser";
import CORSconfig from "./Src/config/corssetting.js";
import cors from "cors";
import { connect } from "@ngrok/ngrok";
import InitApiRoute from "./Src/Services/Routes/InitApiRoute.js";
import path from "path";
import { fileURLToPath } from "url";
import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import http from "http";
import { WebSocketServer } from "ws";
import userClients from "./Src/Services/Singleton/userClients.js";

dotenv.config();
const app = express();
const PORT = 3001;

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: "/ws" });

wss.on("connection", (ws, req) => {
  console.log("New client connected:", req.socket.remoteAddress);

  ws.on("message", (msg) => {
    console.log("Received raw message:", msg.toString());
    try {
      const data = JSON.parse(msg);
      if (data.userId) {
        userClients.set(String(data.userId), ws);
        ws.userId = String(data.userId);
      }
    } catch (err) {
      console.error("Invalid WS message:", err);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    if (ws.userId) {
      userClients.delete(ws.userId);
      console.log("Deleted userId:", ws.userId, "Map size:", userClients.size);
    }
  });
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors(CORSconfig.CORSsetting()));
app.use(express.json());
app.use(bodyParser.json());

InitApiRoute(app);

app.use(
  "/ImgStorage",
  express.static(path.join(__dirname, "Src", "Access", "ImgStorage"))
);

app.use(
  "/Frame_avatar",
  express.static(path.join(__dirname, "Src", "Access", "Frame_avatar"))
);
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    logging: false,
  }
);

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Kết nối database thành công.");

    server.listen(PORT, "0.0.0.0", async () => {
      console.log(`Server đang chạy tại http://0.0.0.0:${PORT}`);

      const tunnel = await connect({
        addr: PORT,
        authtoken: process.env.NGROK_AUTH_TOKEN,
        subdomain: process.env.NGROK_SUBDOMAIN,
      });

      console.log(`Ngrok đang online tại: ${tunnel.url()}`);
    });
  } catch (error) {
    console.error("Lỗi kết nối DB:", error.message);
    process.exit(1);
  }
}

startServer();
export { app, userClients };
