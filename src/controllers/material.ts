import { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";
import { sendErrorRes } from "src/utils/helper";
import cloudUploader from "src/cloud";
import Material from "../models/material";
import { UploadApiResponse } from "cloudinary";


const uploadImage = (filePath: string): Promise<UploadApiResponse> => {
    return cloudUploader.upload(filePath, {
        width: 1080,
        height: 1080,

    });
};


export const createMaterial: RequestHandler = async (req, res) => {
    const { name, technology, colors, pricePerGram, applicationTypes } = req.body;

    const { imageUrl } = req.files;
    if (Array.isArray(imageUrl)) {
        return sendErrorRes(res, "Multiple files are not allowed!", 422);
    }

    if (!imageUrl.mimetype?.startsWith("image")) {
        return sendErrorRes(res, "Invalid image file!", 422);
    }

    const { secure_url: url, public_id: id } = await cloudUploader.upload(
        imageUrl.filepath,
        {
            width: 1080,
            height: 1080,
        }
    );


    const newMaterial = new Material(
        {
            name,
            technology,
            colors,
            pricePerGram,
            applicationTypes,
            imageUrl: {
                id,
                url
            }
        }
    );

    await newMaterial.save();

    res.status(201).json({ success: true, message: "Added new material", newMaterial });

}

export const getAllMaterials: RequestHandler = async (req, res) => {
    const { pageNo = "1", limit = "10" } = req.query as {
        pageNo: string;
        limit: string;
    };

    const materials = await Material.find().sort("-createdAt").skip((+pageNo - 1) * +limit)
        .limit(+limit);

    let count = 0;
    const listings = materials.map((n) => {
        count += 1;
        return {
            id: n._id,
            name: n.name,
            technology: n.technology,
            colors: n.colors,
            applicationTypes: n.applicationTypes,
            //  imageUrl: n.iamgeUrl,              Not Showing Iamge URL
            pricePerGram: n.pricePerGram,
        };
    });

    res.json({ total: count, materials: listings });
}


export const getMaterialById: RequestHandler = async (req, res) => {
    const materialId = req.params.id;
    if (!isValidObjectId(materialId)) {
        return sendErrorRes(res, "Invalid Material id!", 422);
    }

    const material = await Material.findById(materialId);
    if (!material) {
        return sendErrorRes(res, "Material not found!", 404);
    }

    res.json({
        material: {
            id: material._id,
            name: material.name,
            technology: material.technology,
            colors: material.colors,
            applicationTypes: material.applicationTypes,
            pricePerGram: material.pricePerGram,
            imageUrl: material.imageUrl

        },
    });
};


export const deleteMaterial: RequestHandler = async (req, res) => {
    const materialId = req.params.id;
    if (!isValidObjectId(materialId)) {
        return sendErrorRes(res, "Invalid Material id!", 422);
    }

    const material = await Material.findByIdAndDelete(materialId);
    if (!material) {
        return sendErrorRes(res, "Material not found!", 404);
    }

    if (material.imageUrl?.id) {
        await cloudUploader.destroy(material.imageUrl.id);
    }

    res.json({ message: "Product removed successfully." });
}

export const updateMaterial: RequestHandler = async (req, res) => {


    const { name, technology, colors, pricePerGram, applicationTypes } = req.body;

    const materialId = req.params.id;
    if (!isValidObjectId(materialId)) {
        return sendErrorRes(res, "Invalid Material id!", 422);
    }

    // If Image then update it first
    if (req.files) {
        const { imageUrl } = req.files;
        if (Array.isArray(imageUrl)) {
            return sendErrorRes(res, "Multiple files are not allowed!", 422);
        }

        if (!imageUrl.mimetype?.startsWith("image")) {
            return sendErrorRes(res, "Invalid image file!", 422);
        }

        const findMaterial = await Material.findById(materialId);
        if (!findMaterial) {
            return sendErrorRes(res, "Material not found!", 404);
        }

        // Deleting previous image if it is present 
        if (findMaterial.imageUrl?.id) {
            await cloudUploader.destroy(findMaterial.imageUrl.id);
        }

        const { secure_url: url, public_id: id } = await cloudUploader.upload(
            imageUrl.filepath,
            {
                width: 1080,
                height: 1080,
            }
        );
        findMaterial.imageUrl = { url, id };
        await findMaterial.save();

    }

    const material = await Material.findByIdAndUpdate(
        materialId,
        {
            name,
            technology,
            colors,
            pricePerGram,
            applicationTypes,

        }, { new: true }
    );

    if (!material) return sendErrorRes(res, "Material not found!", 404);

    res.status(201).json({ message: "Material updated successfully.", material });
}



// In case seperate Upload Image of Material is required


// export const updateMaterialImage: RequestHandler = async (req, res) => {
//     const materialId = req.params.id;
//     if (!isValidObjectId(materialId)) {
//         return sendErrorRes(res, "Invalid Material id!", 422);
//     }

//     const { imageUrl } = req.files;
//     if (Array.isArray(imageUrl)) {
//         return sendErrorRes(res, "Multiple files are not allowed!", 422);
//     }

//     if (!imageUrl.mimetype?.startsWith("image")) {
//         return sendErrorRes(res, "Invalid image file!", 422);
//     }

//     const material = await Material.findById(materialId);
//     if (!material) {
//         return sendErrorRes(res, "Material not found!", 404);
//     }

//     if (material.imageUrl?.id) {
//         await cloudUploader.destroy(material.imageUrl.id);
//     }

//     const { secure_url: url, public_id: id } = await cloudUploader.upload(
//         imageUrl.filepath,
//         {
//             width: 1080,
//             height: 1080,
//         }
//     );
//     material.imageUrl = { url, id };
//     await material.save();

//     res.json({ profile: { imageUrl: material.imageUrl.url } });
// }