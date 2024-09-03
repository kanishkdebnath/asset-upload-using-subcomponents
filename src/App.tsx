import { useState } from "react";
import "./App.css";
import AssetSelect, { Asset } from "./components/AssetSelect";

const MAX_SCREENSHOT_COUNT = 8;

type ValidationRule = {
  value: number | string;
  errorMessage: string;
};

export type ValidationObject = {
  maxSize: ValidationRule;
  accepted: ValidationRule;
  customValidation?: (f: File[] | File) => string | undefined;
};

const handleSuccess = (files: File[]) => {
  // Implement your upload logic here
  console.log("Files to upload:", files);
};

const handleError = (error: string) => {
  // Handle any errors that occur during upload
  console.error("Upload error:", error);
};

const defaultAsset = {
  singleImage: "",
  screenshots: [],
  singleVideo: "",
};

function App() {
  const [assets, setAssets] = useState(defaultAsset);
  const [singleImage, setSingleImage] = useState("");
  const [screeshots, setScreenshots] = useState([]);
  const [singleVideo, setSingleVideo] = useState("");

  return (
    <div>
      <AssetSelect
        file={singleImage}
        setFile={(f) => setSingleImage(f as string)}
        validationObject={{
          maxSize: { value: 5000, errorMessage: "Invalid size" },
          accepted: {
            value: "image/jpeg, image/png",
            errorMessage: "Invalid file type",
          },
          customValidation: validateScreenshotsLimit,
        }}
        acceptedTypes="image/jpeg, image/png"
        onError={(e: string) => handleError(e)}
        onSelectSuccess={handleSuccess}
        className="asset-select"
      >
        <AssetSelect.SingleImagePreview className="image-preview" />
        <AssetSelect.Button multiple className="upload-button">
          <div>Upload Image</div>
        </AssetSelect.Button>
        <AssetSelect.Description
          maxSize="5 MB"
          fileType="JPEG | PNG"
          dimension="1080px X 1920px"
        />
      </AssetSelect>
    </div>
  );
}

export default App;

/* 
  Things to do :
  1. Add different state for each asset [file, setFile]
  2. Add details for description directly as props [done]
  3. Must not send asset object and send everything separately as props
  4. Add validateFiles object that takes the following :
    validationObject = {
      maxSize: {value: 5000, errorMessage: "invalid size"}
      accepted: {value: "image/jpeg", errorMessage: "invalid type"}
      customValidation: () => string
    }
  5. onUpload => onSelectSuccess
  6. Create a collection of all these asset in an object which will be updated later assetsObject.
    assetObject = {
      singleImage: "imageUrl",
      screenshots: ["s1","s2","s3","s4"]
      singleVideo: "videoUrl"
    }
  7. Handle error for each asset using error object for each asset
*/

function validateScreenshotsLimit(files: File[] | File) {
  if (Array.isArray(files)) {
    if (files.length > MAX_SCREENSHOT_COUNT) {
      return "Number of images uploaded exceeds the limit : 8";
    }
  }
}
