import { Router } from "express";
import { promises as fs, read} from "fs";
import { fileURLToPath } from "url";
import path, { dirname } from "path";

const routerVehicles = Router();
const _fileName = fileURLToPath(import.meta.url);
const _dirName = path.dirname(_fileName);
const dataFilePath = path.join(_dirName, "../../data/data.json");

const readVehicles = async () => {
    const data = await fs.readFile(dataFilePath);
    return JSON.parse(data);
};

const writeVehicles = async (vehicles) => {
    await fs.writeFile(dataFilePath, JSON.stringify(vehicles, null, 2));
};

routerVehicles.get("/", async (req, res) => {
    const data = await readVehicles();
    res.status(200).json({vehicles: data.vehicles});
});

routerVehicles.post("/", async (req, res) => {
    const data = await readVehicles();
    const newVehicle = {
        id: data.vehicles.length + 1,
        model: req.body.model,
        year: req.body.year
    }
    data.vehicles.push(newVehicle);
    await writeVehicles(data);
    res.status(200).json({message: "Vehicle created succesfully", vehicle: newVehicle});
});

routerVehicles.get("/:id", async (req, res) => {
    const data = await readVehicles();
    const vehicle = data.vehicles.find(v => v.id === parseInt(req.params.id));
    if(!vehicle){
        res.status(404).json({message: "Vehicle not found"});
    }
    res.status(200).json({vehicle: vehicle});
});

routerVehicles.put("/:id", async (req, res) => {
    const data = await readVehicles();
    const vehicleIndex = data.vehicles.findIndex(v => v.id === parseInt(req.params.id));
    if(vehicleIndex === -1){
        res.status(404).json({message: "Vehicle not found"});
    }
    const updateVehicle = {
        ...data.vehicles[vehicleIndex],
        model: req.body.model,
        year: req.body.year
    }
    data.vehicles[vehicleIndex] = updateVehicle;
    await writeVehicles(data);
    res.status(201).json({message: "Vehicle updated succesfully", updateVehicle});
})

routerVehicles.delete("/:id", async (req, res) => {
    const data = await readVehicles();
    const vehicleIndex = data.vehicles.findIndex(v => v.id === parseInt(req.params.id));
    if (vehicleIndex === -1){
        return res.status(404).json({message: "Vehicle not found"});
    }
    data.vehicles.splice(vehicleIndex, 1);
    await writeVehicles(data);
    res.status(201).json({message: "Vehicle deleted succesfully"});
})

export default routerVehicles;