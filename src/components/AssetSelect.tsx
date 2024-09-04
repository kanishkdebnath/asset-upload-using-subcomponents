import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useRef,
} from "react";
import { ValidationObject } from "../App";
import DEFAULT_ICON from "../assets/react.svg";
import "./AssetSelect.css";

type AssetSelectContext = {
  file: string | string[];
  setFile: (f: string | string[]) => void;
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
  file: string | string[];
  setFile: (f: string | string[]) => void;
  validationObject: ValidationObject;
  onError: (e: string) => void;
  className?: string;
};

const AssetSelect = ({
  children,
  file,
  setFile,
  validationObject,
  onError,
  className,
}: AssetSelectProps) => {
  return (
    <AssetSelectContext.Provider
      value={{ file, setFile, validationObject, onError }}
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
  const { file } = useAssetSelectContext();
  const filePreview = (file as string) || DEFAULT_ICON;
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
  const { file } = useAssetSelectContext();
  return (
    <div className={className}>
      {file && (
        <video src={file as string} controls className="single-video-preview" />
      )}
    </div>
  );
};

AssetSelect.MultipleImagesPreview = function AssetSelectMultipleImagesPreview({
  className,
}: {
  className?: string;
}) {
  const { file, setFile } = useAssetSelectContext();

  const handleRemove = (indexToRemove: number) => {
    // Remove the file at the specified index
    const updatedFiles = (file as string[]).filter(
      (_file, index) => index !== indexToRemove
    );

    // Update the state with the new array of files
    setFile(updatedFiles);

    // Call the onUpload function with the updated list of files
    // asset.onUpload(updatedFiles); TODO
  };

  const filePreviews = file as string[];

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
  const { setFile, validationObject, onError } = useAssetSelectContext();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(event.target.files || []);
    // Internal validations
    newFiles.forEach((file) => {
      console.log(file);

      if (file.size > (validationObject.maxSize.value as number)) {
        onError(validationObject.maxSize.errorMessage);
        return;
      }
      if (
        !(validationObject.accepted.value as string)
          .split(",")
          .some((type) => file.type.includes(type.trim()))
      ) {
        onError(validationObject.accepted.errorMessage);
        return;
      }
    });

    if (validationObject.customValidation) {
      // Use the external validation function if provided
      const validationError = validationObject.customValidation(newFiles);
      if (validationError) {
        //TODO:  do onError and return
        return;
      }
    }
    const validFiles = newFiles.map((file) => URL.createObjectURL(file));
    setFile(multiple ? validFiles : validFiles[0]);
    // TODO: select success should update my main assets object
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
        accept={validationObject.accepted.value as string}
        onChange={handleFileChange}
        style={{ display: "none" }} // Hide the input
      />
    </>
  );
};

export default AssetSelect;
