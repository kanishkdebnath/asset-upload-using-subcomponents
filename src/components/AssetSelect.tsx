import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useRef,
  useState,
} from "react";
import "./AssetSelect.css";
import DEFAULT_ICON from "../assets/react.svg";

export type Asset = {
  files: File[];
  onUpload: (files: File[]) => void;
  onError?: (error: Error) => void;
  validateFiles?: (files: File[]) => string[]; // Validation function
  acceptedTypes: string;
  maxSize?: string;
  height?: string;
  width?: string;
};

type AssetSelectContext = {
  asset: Asset;
  setFiles: React.Dispatch<React.SetStateAction<File[]>>; // New state setter for files
};

const AssetSelectContext = createContext<AssetSelectContext | undefined>(
  undefined
);

function useAssetSelectContext() {
  const context = useContext(AssetSelectContext);
  if (!context) {
    throw new Error("useAssetSelectContext must be used within an AssetSelect");
  }
  return context;
}

type AssetSelectProps = PropsWithChildren & {
  asset: Asset;
  className?: string;
};

const AssetSelect = ({ children, asset, className }: AssetSelectProps) => {
  const [files, setFiles] = useState<File[]>(asset.files);

  return (
    <AssetSelectContext.Provider
      value={{ asset: { ...asset, files }, setFiles }}
    >
      <div className={className}>{children}</div>
    </AssetSelectContext.Provider>
  );
};

AssetSelect.Description = function AssetSelectDescription({
  className,
}: {
  className?: string;
}) {
  const { asset } = useAssetSelectContext();
  const types = getFileExtensions(asset.acceptedTypes);
  return (
    <div className={className}>
      <div>{asset.maxSize}</div>
      <div>
        {asset.height} X {asset.width}
      </div>
      <div>
        {types.map((type) => (
          <span>| {type} |</span>
        ))}
      </div>
    </div>
  );
};

AssetSelect.SingleImagePreview = function AssetSelectSingleImagePreview({
  className,
}: {
  className?: string;
}) {
  const { asset } = useAssetSelectContext();
  const filePreview =
    asset.files.length > 0 ? URL.createObjectURL(asset.files[0]) : DEFAULT_ICON;
  return (
    <div className={className}>
      <img
        src={filePreview}
        alt="Preview Image"
        className="single-image-preview"
      />
    </div>
  );
};

AssetSelect.SingleVideoPreview = function AssetSelectSingleVideoPreview({
  className,
}: {
  className?: string;
}) {
  const { asset } = useAssetSelectContext();
  const filePreview =
    asset.files.length > 0 ? URL.createObjectURL(asset.files[0]) : null;
  return (
    <div className={className}>
      {filePreview && (
        <video src={filePreview} controls className="single-video-preview" />
      )}
    </div>
  );
};

AssetSelect.MultipleImagesPreview = function AssetSelectMultipleImagesPreview({
  className,
}: {
  className?: string;
}) {
  const { asset, setFiles } = useAssetSelectContext();

  const handleRemove = (indexToRemove: number) => {
    // Remove the file at the specified index
    const updatedFiles = asset.files.filter(
      (_file, index) => index !== indexToRemove
    );

    // Update the state with the new array of files
    setFiles(updatedFiles);

    // Call the onUpload function with the updated list of files
    asset.onUpload(updatedFiles);
  };

  const filePreviews = asset.files.map((file) => URL.createObjectURL(file));

  return (
    <div className={"default-multipreview-style " + className}>
      {filePreviews.map((filePreview, index) => (
        <div key={index} className="preview-container">
          <button className="remove-button" onClick={() => handleRemove(index)}>
            X
          </button>
          <img
            src={filePreview}
            alt={`preview-${index}`}
            className="multiple-preview-media"
          />
        </div>
      ))}
    </div>
  );
};

AssetSelect.Button = function AssetSelectButton({
  className,
  children,
  multiple = false, // Accepts a `multiple` prop to control multiple file selection
}: {
  className?: string;
  children: React.ReactNode;
  multiple?: boolean; // Optional prop to enable multiple file selection
}) {
  const { asset, setFiles } = useAssetSelectContext();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(event.target.files || []);
    let validFiles: File[] = [];
    const errors: string[] = [];

    if (asset.validateFiles) {
      // Use the external validation function if provided
      const validationErrors = asset.validateFiles(newFiles);
      if (validationErrors.length > 0) {
        errors.push(...validationErrors);
      } else {
        validFiles = newFiles;
      }
    } else {
      validFiles = newFiles;
    }

    if (errors.length > 0 && asset.onError) {
      asset.onError(new Error(errors.join(", ")));
    }

    if (validFiles.length > 0) {
      // Append new valid files to the existing files
      const allFiles = asset.files.concat(validFiles);
      setFiles(allFiles);

      try {
        asset.onUpload(allFiles);
      } catch (err) {
        if (asset.onError) asset.onError(err as Error);
      }
    }
  };
  return (
    <>
      <button className={className} onClick={handleClick}>
        {children}
      </button>
      <input
        ref={inputRef}
        type="file"
        multiple={multiple} // Controlled by the `multiple` prop
        accept={asset.acceptedTypes}
        onChange={handleFileChange}
        style={{ display: "none" }} // Hide the input
      />
    </>
  );
};

function getFileExtensions(acceptedTypes: string): string[] {
  // Map of MIME types to file extensions
  const mimeToExtension: { [key: string]: string } = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/webp": "webp",
    "video/mp4": "mp4",
    "video/webm": "webm",
    "audio/mp3": "mp3",
    // Add other MIME types and their extensions as needed
  };

  // Split the accepted types string into an array of MIME types
  const mimeTypes = acceptedTypes.split(",");

  // Map the MIME types to their extensions using the mimeToExtension map
  const extensions = mimeTypes
    .map((mimeType) => mimeToExtension[mimeType])
    .filter((extension) => extension !== undefined); // Remove undefined values

  return extensions;
}

export default AssetSelect;
