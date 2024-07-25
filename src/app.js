import express from "express";
import dotenv from "dotenv";
import errorHandler from "./middlewares/errorHandler.js"

const app = express();
dotenv.config();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(errorHandler);

app.listen(PORT, () =>{
    console.log(`El puerto esta siendo escuchado correctamente en http://localhost:${PORT}`);
})
