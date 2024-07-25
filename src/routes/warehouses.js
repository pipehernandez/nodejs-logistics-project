import { Router } from "express";
import { promises as fs} from "fs";
import { fileURLToPath } from "url";
import path from "path";

const routerWarehouses = Router();
const _fileName = fileURLToPath(import.meta.url);
const _dirName = path.dirname(_fileName);
const dataFilePath = path.join(_dirName, "../../data/data.json");

const readWarehouses = async () => {
    const data = await fs.readFile(dataFilePath);
    return JSON.parse(data);
}

const writeWarehouses = async(warehouses) => {
    await fs.writeFile(dataFilePath, JSON.stringify(warehouses, null, 2));
};

routerWarehouses.get("/", async (req, res) => {
    const data = await readWarehouses();
    res.status(200).json({warehouses: data.warehouses});
});

routerWarehouses.post("/", async (req, res) => {
    const data = await readWarehouses();
    const newWarehouse = {
        id: data.warehouses.length + 1,
        name: req.body.name,
        location: req.body.location
    }
    data.warehouses.push(newWarehouse);
    await writeWarehouses(data);
    res.status(201).json({message: "Warehouse created succesfully", warehouse: newWarehouse});
});

routerWarehouses.get("/:id", async (req, res) => {
    const data = await readWarehouses();
    const warehouse = data.warehouses.find(w => w.id === parseInt(req.params.id));
    if(!warehouse){
        return res.status(404).json({message: "Warehouse not found"});
    }
    res.status(200).json({warehouse: warehouse});
});

routerWarehouses.put("/:id", async (req, res) => {
    const data = await readWarehouses();
    const warehouseIndex = data.warehouses.findIndex(w => w.id === parseInt(req.params.id))
    if(warehouseIndex === -1){
        return res.status(404).json({message: "Warehouse not found"});
    }
    const updateWarehouse = {
        ...data.warehouses[warehouseIndex],
        name: req.body.name,
        location: req.body.location
    }
    data.warehouses[warehouseIndex] = updateWarehouse;
    await writeWarehouses(data);
    res.status(201).json({updateWarehouse})
})

routerWarehouses.delete("/:id", async (req, res) => {
    const data = await readWarehouses();
    const warehouseIndex = data.warehouses.findIndex(w => w.id === parseInt(req.params.id))
    if(warehouseIndex === -1){
        return res.status(404).json({message: "Warehouse not found"});
    }
    data.warehouses.splice(warehouseIndex, 1);
    await writeWarehouses(data);
    res.status(201).json({message: "Warehouse deleted succesfully"});
})

export default routerWarehouses;