import { createBucket, DOMAIN } from "../services/bucketServices";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import { copyLinkToClipboard } from "../utils";

interface CreateBucketProps {
  handleSuccess: (newId: string) => void;
  UUIDs: string[];
  successMessage: string;
  currUUID: string;
}

const CreateBucket = ({
  handleSuccess,
  UUIDs,
  successMessage,
  currUUID,
}: CreateBucketProps) => {
  const generateBucket = async () => {
    const bucketID = await createBucket();
    if (bucketID) {
      handleSuccess(bucketID);
    }
  };

  return (
    <div className="window">
      <div className="title-bar">
        <div className="title-bar-text">Create New Bucket</div>
        <div className="title-bar-controls">
          <button aria-label="Minimize"></button>
          <button aria-label="Maximize"></button>
          <button aria-label="Close"></button>
        </div>
      </div>
      <div className="window-body">
        <Sidebar UUIDs={UUIDs} />
        <div className="centered-content">
          <h4>Welcome to Hook Haven!</h4>
          {successMessage && (
            <div className="success">
              <strong>{successMessage}</strong>
              <Link to={`/web/${currUUID}`}>{currUUID}</Link>{" "}
              <span
                onClick={(e) => {
                  copyLinkToClipboard(e, DOMAIN, currUUID);
                }}
                className="material-symbols-outlined"
                style={{ fontSize: "14px", cursor: "pointer" }}
              >
                content_copy
              </span>
            </div>
          )}
          <p>
            Create unique URLs to capture, inspect, and debug HTTP requests with
            ease.
          </p>
          <p>
            Perfect for testing webhooks, APIs, or any incoming requests—get
            started in seconds and take control of your debugging process.
          </p>
          <div className="bucket-button">
            <button onClick={generateBucket}>Create Bucket</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBucket;
