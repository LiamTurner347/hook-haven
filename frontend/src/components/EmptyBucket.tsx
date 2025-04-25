import { DOMAIN } from "../services/bucketServices";

interface EmptyBucketProps {
  uuid: string;
}

export const EmptyBucket = ({ uuid }: EmptyBucketProps) => {
  return (
    <>
      <div className="centered-content" id="empty_basket">
        <h2>Empty bucket!</h2>
        <p>
          This basket is empty, send requests to {DOMAIN}/api/${uuid} and they
          will appear here.
        </p>
      </div>
    </>
  );
};
