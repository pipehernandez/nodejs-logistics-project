import { Router } from "express";
import { promises as fs} from "fs";
import { fileURLToPath } from "url";
import path, { dirname } from "path";

const routerWarehouses = Router();
const _fileName = fileURLToPath(import.meta.url);
const _dirName = path.dirname(_fileName)
const warehousesFilePath = path.join(_dirName, "../../data/warehouses.js")


const readFileWarehouses = async () => {
    const warehouses = await fs.readFile(warehousesFilePath);
    return JSON.parse(warehouses);
}
