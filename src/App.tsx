import { useState } from "react";
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
  const [assets, setAssets] = useState<AssetsType>(defaultAsset);
  const [singleImage, setSingleImage] = useState("");
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [singleVideo, setSingleVideo] = useState("");

  const handleSuccess = () => {
    // Implement your upload logic here
    const updatedAssets: AssetsType = {
      singleImage,
      screenshots,
      singleVideo,
    };

    setAssets((prev) => ({ ...prev, ...updatedAssets }));
    console.log(assets);
  };

  return (
    <div>
      <AssetSelect
        assetName={"singleImage"}
        file={singleImage}
        setFile={(f) => setSingleImage(f as string)}
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
        file={singleVideo}
        setFile={(f) => setSingleVideo(f as string)}
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
        file={screenshots}
        setFile={(f) => setScreenshots(f as string[])}
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
          <div>Upload Image</div>
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

/* 
  Things to do :
  1. Add different state for each asset [file, setFile] [done]
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

function validateScreenshotsLimit(files: File[] | File | string[]) {
  if (Array.isArray(files)) {
    if (files.length > MAX_SCREENSHOT_COUNT) {
      return "Number of images uploaded exceeds the limit : 8";
    }
  }
}
