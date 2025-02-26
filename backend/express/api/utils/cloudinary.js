import {v2 as cloudinary} from 'cloudinary';
import fs from "fs"

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary=async(localFilePath)=>{
    try {
        if(!localFilePath) return null
        // upload the file on cloudinary
        const response =await cloudinary.uploader.upload(localFilePath,{
            resource_type:'auto',
            secure: true,                // Ensures HTTPS delivery
            fetch_format: 'auto',         // Optimizes image format
            quality: 'auto'
        })
        
        console.log("File has been uploaded on Cloudinary successfully",response)
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        // remove the locally saved temporary file as the uploade operation got failed
        console.log("Error: ",error)
        fs.unlinkSync(localFilePath)
        return null;
    }
}

export {uploadOnCloudinary}