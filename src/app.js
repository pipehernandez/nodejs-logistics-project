import express from "express";
import dotenv from "dotenv";
import errorHandler from "./middlewares/errorHandler.js"
import routerWarehouses from "./routes/warehouses.js";
import routerShipments from "./routes/shipments.js";
import routerDrivers from "./routes/drivers.js";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(errorHandler);
app.use("/warehouses", routerWarehouses);
app.use("/shipments", routerShipments);
app.use("/drivers", routerDrivers);

app.listen(PORT, () =>{
    console.log(`El puerto esta siendo escuchado correctamente en http://localhost:${PORT}`);
})
