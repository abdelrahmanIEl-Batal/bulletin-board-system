export const uploadImage = async (img: any) : Promise<string> => {
    const formData = new FormData();
    formData.append("file", img);
    formData.append("upload_preset", process.env.REACT_APP_CLOUDINARY_PRESET!);
    const response = await (await fetch(process.env.REACT_APP_CLOUDINARY_URL!, {
      method: "POST",
      body: formData,
    })).json();
    return response.url
}