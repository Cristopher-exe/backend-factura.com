import dotenv from "dotenv";
import express from "express";
import httpProxy from "http-proxy";
import axios from "axios";
import bodyParser from "body-parser";
import cors from "cors";

//Inicializa Express
const app = express();
dotenv.config();

// Middleware para parsear el body de las peticiones POST
app.use(bodyParser.json());
app.use(cors());
const port = 3000;

app.all("/api/*", async (req, res) => {
  const fullPath = `${process.env.HOST_FACTURA}${req.originalUrl}`;
  const HEADERS = {
    "Content-Type": "application/json",
    "F-PLUGIN": process.env.F_PLUGIN,
    "F-Api-Key": process.env.F_API_KEY,
    "F-Secret-Key": process.env.F_SECRET_KEY,
  };

  //-------------------
  try {
    let response;

    switch (req.method) {
      case "GET":
        if (req.originalUrl.includes("/cfdi/list")) {
          console.log(`URL: ${fullPath}`);
          response = await axios.get(fullPath, { headers: HEADERS });
        } else if (req.originalUrl.includes("/v1/clients")) {
          console.log(`URL: ${fullPath}`);
          response = await axios.get(fullPath, { headers: HEADERS });
        } else if (req.originalUrl.includes("/email")) {
          console.log(`URL: ${fullPath}`);
          response = await axios.get(fullPath, { headers: HEADERS });
        }
        break;
      case "POST":
        const postData = req.body;
        console.log(`BACK: ${postData}`);
        response = await axios.post(fullPath, postData, { headers: HEADERS });
        break;
    }

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en la petición a la API externa" });
  }
});

app.listen(port, () => {
  console.log(`Servidor proxy corriendo en http://localhost:${port}`);
});
