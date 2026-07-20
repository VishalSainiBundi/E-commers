"use client";

import { Images } from "lucide-react";
import { useState } from "react";

import FileUpload from "@/components/common/FileUpload";
import { axiosApiInstance } from "@/helper/helper";

export default function MultipleImage({ api_url, product_id, other_images }) {
  const [upload_status, setUploadStatus] = useState(false);
  const [otherImages, setOtherImages] = useState(other_images);
  const [toggle, setToggle] = useState(false);
  const [image_files, setImageFile] = useState([]);

  const uploadHandler = () => {
    const formData = new FormData();
    for (const imgFile of image_files) {
      formData.append("other_images", imgFile);
    }
    formData.append("product_id", product_id);
    setUploadStatus(false);

    axiosApiInstance
      .post(api_url, formData)
      .then((response) => {
        if (response.data.flag == 1) {
          setUploadStatus(true);
          setOtherImages(response.data.updated_other_images);
        }
      })
      .catch(() => {});
  };

  const fileChangeHandler = (images) => {
    const temp = [];
    if (images.length != 0) {
      for (const img of images) {
        temp.push(img.file);
      }
      setImageFile(temp);
    }
  };

  return (
    <>
      <Images onClick={() => setToggle(true)} />
      <div
        className={`${toggle ? "flex" : "hidden"} gap-3 justify-center items-center fixed z-9999999 top-0 bg-red-500 left-0 w-full min-h-screen`}
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <div className="min-w-[700px] max-w-[700px] bg-white rounded p-3">
          <div className="text-xl font-bold my-3">Existing Images</div>
          <div className="gap-2 grid grid-cols-4">
            {otherImages.map((img) => (
              <div className="h-[70px]" key={img}>
                <img
                  className="w-full h-full"
                  src={`http://localhost:5000/images/product/other_images/${img}`}
                  alt=""
                />
              </div>
            ))}
          </div>
        </div>
        <div className="min-w-[700px] max-w-[700px] bg-white rounded p-3">
          <div className="text-xl font-bold">Add More Images</div>
          <FileUpload
            upload_status={upload_status}
            onFilesChange={fileChangeHandler}
            maxFiles={5}
            maxSize={1 * 1024 * 1024}
            className="my-7"
            multiple={true}
          />
          <button onClick={uploadHandler} className="px-3 py-2 bg-blue-400 text-white rounded">
            Upload
          </button>
        </div>
      </div>
    </>
  );
}
