import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useRef,
  useState,
} from "react";
import DEFAULT_ICON from "../assets/react.svg";
import "./AssetSelect.css";
import { ValidationObject } from "../utils/types";

type AssetSelectContext = {
  assetName: string;
  assetRef: any;
  files: File[];
  setFiles: (f: File[]) => void;
  validationObject: ValidationObject;
  onError: (e: string) => void;
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
  assetName: string;
  assetRef: any;
  validationObject: ValidationObject;
  onError: (e: string) => void;
  className?: string;
};

const AssetSelect = ({
  children,
  assetRef,
  assetName,
  validationObject,
  onError,
  className,
}: AssetSelectProps) => {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <AssetSelectContext.Provider
      value={{
        assetName,
        assetRef,
        files,
        setFiles,
        validationObject,
        onError,
      }}
    >
      <div className={className}>{children}</div>
    </AssetSelectContext.Provider>
  );
};

AssetSelect.Description = function AssetSelectDescription({
  className,
  maxSize,
  dimension,
  fileType,
}: {
  className?: string;
  maxSize: string;
  dimension: string;
  fileType: string;
}) {
  return (
    <div className={className}>
      <div>{maxSize}</div>
      <div>{dimension}</div>
      <div>{fileType}</div>
    </div>
  );
};

AssetSelect.SingleImagePreview = function AssetSelectSingleImagePreview({
  className,
}: {
  className?: string;
}) {
  const { files } = useAssetSelectContext();
  const filePreview = files[0] ? URL.createObjectURL(files[0]) : DEFAULT_ICON;
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
  const { files } = useAssetSelectContext();
  return (
    <div className={className}>
      {files[0] && (
        <video
          src={URL.createObjectURL(files[0])}
          controls
          className="single-video-preview"
        />
      )}
    </div>
  );
};

AssetSelect.MultipleImagesPreview = function AssetSelectMultipleImagesPreview({
  className,
}: {
  className?: string;
}) {
  const { assetName, assetRef, files, setFiles } = useAssetSelectContext();

  const handleRemove = (indexToRemove: number) => {
    // Remove the file at the specified index
    const updatedFiles = files.filter(
      (_file, index) => index !== indexToRemove
    );
    setFiles(updatedFiles);
    assetRef[assetName] = updatedFiles;
  };

  const filePreviews = files.map((file) => URL.createObjectURL(file));

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
  const { assetRef, assetName, files, setFiles, validationObject, onError } =
    useAssetSelectContext();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(event.target.files || []);
    let updatedFiles = [...files]; // for multiple file case
    const hasError = newFiles.some((file) => {
      if (file.size > (validationObject.maxSize.value as number)) {
        onError(validationObject.maxSize.errorMessage);
        return true;
      }

      if (
        !validationObject.accepted.value.some((type) =>
          file.type.includes(type.trim())
        )
      ) {
        onError(validationObject.accepted.errorMessage);
        return true;
      }

      return false;
    });

    if (hasError) {
      return;
    }

    if (validationObject.customValidation) {
      updatedFiles = [...updatedFiles, ...newFiles]; // persists existing file
      // Use the external validation function if provided
      const validationError = validationObject.customValidation(updatedFiles);
      if (validationError) {
        onError(validationError);
        return;
      }
    }

    const validFiles = multiple ? updatedFiles : newFiles;
    setFiles(validFiles);
    assetRef.current[assetName] = validFiles;
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
        accept={validationObject.accepted.value.join(",")}
        onChange={handleFileChange}
        style={{ display: "none" }} // Hide the input
      />
    </>
  );
};

export default AssetSelect;
