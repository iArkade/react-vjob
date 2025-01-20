import React from "react";
import { useParams } from "react-router-dom";

const EntityDetails = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <h1>Entity Details</h1>
      <p>Entity ID: {id}</p>
    </div>
  );
};

export default EntityDetails;
