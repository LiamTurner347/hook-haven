// Expected arguments
// Array containing objects representing requests to bucket
// We need to pass in UUID separately
import { DOMAIN } from "../services/bucketServices";
import { useState, useEffect } from "react";
import { EmptyBucket } from "./EmptyBucket";
import { RequestData } from "../types";
import { useParams } from "react-router-dom";
import { getBucketData } from "../services/bucketServices";
import { List } from "./List";
import { copyLinkToClipboard } from "../utils";

const BucketPage = () => {
  const uuid = useParams().uuid;
  const [requests, setRequests] = useState<RequestData[]>([]);

  useEffect(() => {
    if (uuid) {
      const fetchData = async () => {
        try {
          const data = await getBucketData(uuid);

          setRequests(data);
        } catch (e: unknown) {
          console.error(e);
        }
      };
      fetchData();
    }
  }, [uuid]);

  return (
    <>
      <div>
        <div className="window" style={{ marginTop: "50px" }}>
          <div className="title-bar">
            <div className="title-bar-text">Bucket Central</div>
            <div className="title-bar-controls">
              <button aria-label="Minimize"></button>
              <button aria-label="Maximize"></button>
              <button aria-label="Close"></button>
            </div>
          </div>
          <div className="window-body">
            <div className="centered-content">
              <h4>Welcome to your bucket: {uuid}</h4>
              <h4>
                Requests : <span id="requests_count">{requests.length}</span>
              </h4>
              <p>
                Requests are collected at {DOMAIN}/api/{uuid}
                <kbd className="copy-url-btn">
                  <span
                    onClick={(e) => {
                      if (typeof uuid === "string")
                        copyLinkToClipboard(e, DOMAIN, uuid);
                    }}
                    className="material-symbols-outlined"
                    style={{ fontSize: "14px", cursor: "pointer" }}
                  >
                    content_copy
                  </span>
                </kbd>
              </p>
              <p>
                Scroll through your requests, inspect the headers, and body
                content
              </p>
            </div>
          </div>
        </div>
      </div>
      <hr></hr>
      {requests && <List requests={requests} />}
      {!requests && <EmptyBucket uuid={uuid!} />}
    </>
  );
};

export default BucketPage;
