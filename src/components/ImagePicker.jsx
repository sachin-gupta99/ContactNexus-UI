import React, { forwardRef } from "react";
import { useState } from "react";

const ImagePicker = forwardRef(({ label, name }, ref) => {
  const [image, setImage] = useState(null);
  const handlePickClick = (event) => {
    ref.current?.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      setImage(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex items-center gap-6 mb-4">
        <div className="w-32 h-32 border-2 border-gray-300 rounded-lg flex justify-center items-center text-center bg-gray-50 relative overflow-hidden">
          {image && (
            <img
              src={image}
              alt="Preview"
              className="w-full h-full object-cover rounded-md"
            />
          )}
          {!image && (
            <p className="text-gray-400 text-sm p-4">
              No image selected
            </p>
          )}
        </div>
        <input
          className="hidden"
          type="file"
          id={name}
          accept="image/png, image/jpeg, image/jpg, image/gif"
          name={name}
          ref={ref}
          onChange={handleImageChange}
        />
        <button
          type="button"
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-lg"
          onClick={handlePickClick}
        >
          Choose Image
        </button>
      </div>
    </div>
  );
});

export default ImagePicker;
