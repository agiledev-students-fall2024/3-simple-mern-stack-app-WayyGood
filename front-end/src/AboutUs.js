import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AboutUs.css'; 

const AboutUs = () => {
  const [aboutData, setAboutData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the About Us data from the backend
    axios
      .get(`${process.env.REACT_APP_SERVER_HOSTNAME}/about`)
      .then((response) => setAboutData(response.data))
      .catch((err) => setError('Failed to load the About Us data'));
  }, []);

  if (error) return <div>{error}</div>;
  if (!aboutData) return <div>Loading...</div>;

  return (
    <div className="about-us">
      <h1>About Me</h1>
      <h2>{aboutData.name}</h2>
      <p>{aboutData.description}</p>
      <img
        src={aboutData.image}
        alt="About us"
        style={{ maxWidth: '400px', height: 'auto' }}
      />
    </div>
  );
};

export default AboutUs;
