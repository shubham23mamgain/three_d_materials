import express from "express";
import { createMaterial, deleteMaterial, getAllMaterials, getMaterialById, updateMaterial } from "src/controllers/material";
import fileParser from "src/middleware/fileParser";

const router = express.Router();

router.post('/', fileParser, createMaterial);
router.get('/', getAllMaterials);
router.get('/:id', getMaterialById);
router.delete('/:id', deleteMaterial);
router.put('/:id', fileParser, updateMaterial);
// router.put('/update-image/:id', fileParser, updateMaterialImage);

export default router;