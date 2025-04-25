interface RequestHeaderInfoProps {
  headers: string;
}

export const RequestHeaderInfo = ({ headers }: RequestHeaderInfoProps) => {
  if (headers.length > 0) {
    const parsed = JSON.parse(headers); // object
    const entries = Object.entries(parsed);
    return (
      <>
        <ul>
          {entries.map((entry, index) => {
            return (
              <li key={index}>
                {entry[0]} : {entry[1] as string}
              </li>
            );
          })}
        </ul>
      </>
    );
  } else {
    return (
      <>
        <p>No headers available!</p>
      </>
    );
  }
};
