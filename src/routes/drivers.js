import { Router } from "express";
import { promises as fs} from "fs";
import { fileURLToPath } from "url";
import path from "path";

const routerDrivers = Router();
const _fileName = fileURLToPath(import.meta.url);
const _dirName = path.dirname(_fileName);
const dataFilePath = path.join(_dirName, "../../data/data.json");

const readDrivers = async () => {
    const data = await fs.readFile(dataFilePath);
    return JSON.parse(data);
};

const writeDrivers = async (drivers) => {
    await fs.writeFile(dataFilePath, JSON.stringify(drivers, null, 2));
};

routerDrivers.get("/", async (req, res) => {
    const data = await readDrivers();
    res.status(200).json({drivers: data.drivers});
});

routerDrivers.post("/", async (req, res) => {
    const data = await readDrivers();
    const newDriver = {
        id: data.drivers.length + 1,
        name: req.body.name
    }
    data.drivers.push(newDriver);
    await writeDrivers(data);
    res.status(201).json({message: "Driver created successfully", driver: newDriver});
});

routerDrivers.get("/:id", async (req, res) => {
    const data = await readDrivers();
    const driver = data.drivers.find(d => d.id === parseInt(req.params.id));
    if(!driver){
        return res.status(404).json({message: "Driver not found"});
    }
    res.status(200).json({driver: driver});
});

routerDrivers.put("/:id", async (req, res) => {
    const data = await readDrivers();
    const driverIndex = data.drivers.findIndex(d => d.id === parseInt(req.params.id))
    if(driverIndex === -1){
        return res.status(404).json({message: "Driver not found"});
    }
    const updateDriver = {
        ...data.drivers[driverIndex],
        name: req.body.name,
    }
    data.drivers[driverIndex] = updateDriver;
    await writeDrivers(data);
    res.status(201).json({updateDriver})
});

routerDrivers.delete("/:id", async (req, res) => {
    const data = await readDrivers();
    const driverIndex = data.drivers.findIndex(d => d.id === parseInt(req.params.id))
    if(driverIndex === -1){
        return res.status(404).json({message: "Driver not found"});
    }
    data.drivers.splice(driverIndex, 1);
    await writeDrivers(data);
    res.status(201).json({message: "Driver deleted succesfully"});
});

export default routerDrivers;