import "./App.css";
import AssetSelect, { Asset } from "./components/AssetSelect";

const validateFiles = (files: File[]): string[] => {
  const errors: string[] = [];
  const acceptedTypes = "image/jpeg,image/png,video/mp4"; // Example accepted types
  const maxSize = 5242880; // 5MB
  // const maxSize = 1048576; // 1MB

  files.forEach((file) => {
    if (
      !acceptedTypes.split(",").some((type) => file.type.includes(type.trim()))
    ) {
      errors.push(`Invalid format: ${file.name}`);
    } else if (file.size > maxSize) {
      errors.push(`Size bigger than allowed: ${file.name}`);
    }
  });

  return errors;
};

const handleUpload = (files: File[]) => {
  // Implement your upload logic here
  console.log("Files to upload:", files);
};

const handleError = (error: Error) => {
  // Handle any errors that occur during upload
  console.error("Upload error:", error.message);
};

const asset: Asset = {
  files: [],
  validateFiles,
  onUpload: handleUpload,
  onError: handleError,
  acceptedTypes: "image/jpeg,image/png,image/jpg",
  maxSize: "5 MB",
  height: "300px",
  width: "600px",
};

function App() {
  return (
    <div>
      <AssetSelect asset={asset} className="asset-select">
        <AssetSelect.SingleImagePreview className="image-preview" />
        {/* <AssetSelect.MultipleImagesPreview className="image-preview" /> */}
        {/* <AssetSelect.SingleVideoPreview className="image-preview" /> */}
        <AssetSelect.Button multiple className="upload-button">
          <div>Upload Asset</div>
        </AssetSelect.Button>
        <AssetSelect.Description />
      </AssetSelect>
    </div>
  );
}

export default App;
