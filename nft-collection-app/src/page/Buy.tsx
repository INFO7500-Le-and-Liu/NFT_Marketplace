import React from 'react';
import { useLocation } from 'react-router-dom';

const Buy: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const name = queryParams.get('name');
  const price = queryParams.get('price');
  const description = queryParams.get('description');
  const image = queryParams.get('image');

  if (!name || !price || !description || !image) {
    return <p>No data available.</p>;
  }

  return (
    <div>
      <h1>{name}</h1>
      <img
        src={image}
        alt={name}
        width="300"
        onError={(e) => e.currentTarget.src = 'fallback-image.png'}
      />
      <p>Price: {price}</p>
      <p>Description: {description}</p>
    </div>
  );
};

export default Buy;
