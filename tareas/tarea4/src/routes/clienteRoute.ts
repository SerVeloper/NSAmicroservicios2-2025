import { Router } from "express";
import { getRepository } from "typeorm";
import { Cliente } from "../entities/Cliente";

const router = Router();

// Crear un nuevo cliente
router.post("/", async (req, res) => {
    const clienteRepo = getRepository(Cliente);
    const nuevoCliente = clienteRepo.create(req.body);
    const resultado = await clienteRepo.save(nuevoCliente);
    res.status(201).json(resultado);
});