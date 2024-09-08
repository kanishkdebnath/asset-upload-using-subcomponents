import { useRef, useState } from "react";
import "./App.css";
import AssetSelect from "./components/AssetSelect";

const MAX_SCREENSHOT_COUNT = 2;

const handleError = (error: string) => {
  // Handle any errors that occur during upload
  console.error("Upload error:", error);
};

type AssetsType = {
  singleImage: string;
  screenshots: string[];
  singleVideo: string;
};

const defaultAsset: AssetsType = {
  singleImage: "",
  screenshots: [],
  singleVideo: "",
};

function App() {
  const assetRef = useRef(defaultAsset);

  const handleSuccess = () => {
    console.log("Uploading this asset state to backend : ", assetRef.current);
  };

  return (
    <div>
      <AssetSelect
        assetName={"singleImage"}
        assetRef={assetRef}
        validationObject={{
          maxSize: { value: 5242880, errorMessage: "Invalid size" },
          accepted: {
            value: ["image/jpeg", "image/png"],
            errorMessage: "Invalid file type",
          },
        }}
        onError={(e: string) => handleError(e)}
        className="asset-select"
      >
        <AssetSelect.SingleImagePreview className="image-preview" />
        <AssetSelect.Button className="upload-button">
          <div>Upload Image</div>
        </AssetSelect.Button>
        <AssetSelect.Description
          maxSize="5 MB"
          fileType="JPEG | PNG"
          dimension="1080px X 1920px"
        />
      </AssetSelect>

      <AssetSelect
        assetName={"singleVideo"}
        assetRef={assetRef}
        validationObject={{
          maxSize: { value: 10485760, errorMessage: "Invalid size" },
          accepted: {
            value: ["video/mp4"],
            errorMessage: "Invalid file type",
          },
        }}
        onError={(e: string) => handleError(e)}
        className="asset-select"
      >
        <AssetSelect.SingleVideoPreview className="image-preview" />
        <AssetSelect.Button className="upload-button">
          <div>Upload Video</div>
        </AssetSelect.Button>
        <AssetSelect.Description
          maxSize="10 MB"
          fileType="MP4"
          dimension="1080px X 1920px"
        />
      </AssetSelect>

      <AssetSelect
        assetName={"screenshots"}
        assetRef={assetRef}
        validationObject={{
          maxSize: { value: 5242880, errorMessage: "Invalid size" },
          accepted: {
            value: ["image/jpeg", "image/png"],
            errorMessage: "Invalid file type",
          },
          customValidation: validateScreenshotsLimit,
        }}
        onError={(e: string) => handleError(e)}
        className="asset-select"
      >
        <AssetSelect.MultipleImagesPreview className="image-preview" />
        <AssetSelect.Button multiple className="upload-button">
          <div>Upload Images</div>
        </AssetSelect.Button>
        <AssetSelect.Description
          maxSize="5 MB"
          fileType="JPEG | PNG"
          dimension="1080px X 1920px"
        />
      </AssetSelect>
      <button onClick={handleSuccess}>Save</button>
    </div>
  );
}

export default App;

function validateScreenshotsLimit(files: File[] | File | string[]) {
  if (Array.isArray(files)) {
    if (files.length > MAX_SCREENSHOT_COUNT) {
      return "Number of images uploaded exceeds the limit : 8";
    }
  }
}
