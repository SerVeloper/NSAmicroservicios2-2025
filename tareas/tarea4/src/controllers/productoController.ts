import { Request, Response } from 'express';
import { Producto } from '../entities/Producto';
import { AppDataSource } from '../config/database';

const productoRepository = AppDataSource.getRepository(Producto);

//crear producto
export const crearProducto = async (req: Request, res: Response) => {
    try {
        const producto = productoRepository.create(req.body);
        await productoRepository.save(producto);
        res.status(201).json(producto);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el producto', error });
    }
};