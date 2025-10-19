
import React, { useRef } from 'react';
import { PhotoIcon } from './icons/PhotoIcon';

interface ImageUploaderProps {
  id: string;
  label: string;
  imageUrl: string | null;
  onImageSelect: (file: File) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ id, label, imageUrl, onImageSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onImageSelect(event.target.files[0]);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      onImageSelect(event.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <div className="flex flex-col items-center">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">{label}</h3>
      <input
        type="file"
        id={id}
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
      />
      <label
        htmlFor={id}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="w-full h-64 sm:h-80 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-300 ease-in-out relative overflow-hidden"
      >
        {imageUrl ? (
          <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <div className="text-center text-gray-500">
            <PhotoIcon className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p className="font-semibold">Click to upload</p>
            <p className="text-sm">or drag and drop</p>
            <p className="text-xs mt-1">PNG, JPG, WEBP</p>
          </div>
        )}
      </label>
    </div>
  );
};
