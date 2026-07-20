"use client";

import { useState } from "react";
import { GrGallery } from "react-icons/gr";
import FileUpload from "./common/FileUpload";
import { axiosApiInstrector } from "@/helper/helper";
import { RxCross2 } from "react-icons/rx";

export default function MultiImage({ product_id, other_images, api_url }) {
  const [toggle, setToggle] = useState(false);
  const [otherImages, setOtherImages] = useState(other_images);
  const [imageFiles, setImageFiles] = useState([]);
  const [uploadStates, setUploadStates] = useState(false);

  const uploadHendler = () => {
    const formData = new FormData();

    imageFiles.forEach((file) => {
      formData.append("other_images", file);
    });

    formData.append("product_id", product_id);
    setUploadStates(false)

    axiosApiInstrector.post(api_url, formData).then((response) => {
      if (response.data.flag === 0) {
        setOtherImages(response.data.updated_other_images);
        setUploadStates(true);
      }
    });
  };

  const fileChangeHandler = (images) => {
    const files = images.map((img) => img.file);
    setImageFiles(files);
  };

  return (
    <>
      {/* Open Modal Icon */}
      <GrGallery
        onClick={() => setToggle(true)}
        className="cursor-pointer"
        size={18}
      />

      {/* Overlay */}
      {toggle && (
        <div className="fixed inset-0 z-[999999] bg-black/70 flex items-center justify-center">
          
          {/* Modal */}
          <div className="bg-white rounded p-4 w-[700px] max-h-[80vh] overflow-y-auto space-y-4">
            <div className="flex justify-end">
  <button onClick={() => setToggle(false)}>
    <RxCross2
      size={28}
      className="cursor-pointer text-blue-600 hover:text-red-500"
    />
  </button>
</div>

            {/* Existing Images */}
            <div>
              <div className="text-md font-bold mb-2">Existing Images</div>
              <div className="grid grid-cols-4 gap-3">
                {otherImages.map((img) => (
                  <img
                    key={img}
                    src={`http://localhost:5000/img/product/other_image/${img}`}
                    className="w-32 h-20 object-cover rounded"
                  />
                ))}
              </div>
            </div>

            {/* Add Images */}
            <div>
              <div className="text-xl font-bold mb-2">Add Images</div>
              <FileUpload
                className="my-4"
                onFilesChange={fileChangeHandler}
                multiple
                maxSize={2 * 1024 * 1024}
                upload_status={uploadStates}
              />
              <button
                onClick={uploadHendler}
                className="px-4 py-2 bg-blue-500 text-white font-bold rounded"
              >
                Upload
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setToggle(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
