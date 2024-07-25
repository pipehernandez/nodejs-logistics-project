import { Router } from "express";
import { promises as fs} from "fs";
import { fileURLToPath } from "url";
import path from "path";

const routerShipments = Router();
const _fileName = fileURLToPath(import.meta.url);
const _dirName = path.dirname(_fileName);
const dataFilePath = path.join(_dirName, "../../data/data.json");

const readShipments = async () => {
    const data = await fs.readFile(dataFilePath);
    return JSON.parse(data);
}

const writeShipments = async (shipments) => {
    await fs.writeFile(dataFilePath, JSON.stringify(shipments, null, 2));
}

routerShipments.get("/", async (req, res) => {
    const data = await readShipments();
    res.status(200).json({shipments: data.shipments});
});

routerShipments.post("/", async (req, res) => {
    const data = await readShipments();
    const newShipment = {
        id: data.shipments.length + 1,
        item: req.body.item,
        quantity: req.body.quantity,
        warehouseId: req.body.warehouseId,
    }
    data.shipments.push(newShipment);
    await writeShipments(data);
    res.status(201).json({message: "Shipment created succesfully", shipment: newShipment});
})

routerShipments.get("/:id", async (req, res) => {
    const data = await readShipments();
    const shipment = data.shipments.find(s => s.id === parseInt(req.params.id));
    if(!shipment){
        return res.status(404).json({message: "Shipment not found"});
    }
    res.status(200).json({shipment: shipment});
});

routerShipments.put("/:id", async (req, res) => {
    const data = await readShipments();
    const shipmentIndex = data.shipments.findIndex(s => s.id === parseInt(req.params.id))
    if(shipmentIndex === -1){
        return res.status(404).json({message: "Shipment not found"});
    }
    const updateShipment = {
        ...data.shipments[shipmentIndex],
        item: req.body.item,
        quantity: req.body.quantity,
        warehouseId: req.body.warehouseId,
    }
    data.shipments[shipmentIndex] = updateShipment;
    await writeShipments(data);
    res.status(201).json({updateShipment})
});

routerShipments.delete("/:id", async (req, res) => {
    const data = await readShipments();
    const shipmentIndex = data.shipments.findIndex(s => s.id === parseInt(req.params.id))
    if(shipmentIndex === -1){
        return res.status(404).json({message: "Shipment not found"});
    }
    data.shipments.splice(shipmentIndex, 1);
    await writeShipments(data);
    res.status(201).json({message: "Shipment deleted succesfully"});
});

export default routerShipments;