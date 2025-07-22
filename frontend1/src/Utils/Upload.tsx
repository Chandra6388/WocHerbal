import axios from "axios";

export const handleImageUpload = async (e: { target: { files: any[] } }) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "my_unsigned_preset"); // Your actual unsigned preset name

  try {
    const response = await axios.post(
      "https://api.cloudinary.com/v1_1/dlpeqbowx/image/upload",
      formData
    );

    const imageUrl = response.data.secure_url;
    console.log("Uploaded Image URL:", imageUrl);

    return imageUrl;
  } catch (error) {
    console.error("Image upload failed:", error);
  }
};
