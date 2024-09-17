import React, { useEffect, useState } from "react";

const App = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:9090/");
        if (!response.ok) {
          throw new Error(`Oh no! Something went wrong.`);
        }
        const data = await response.json();
        setData(data)
      } catch (error) {
        console.error(`Could not fetch data: ${error.message}`);
      }
    };
    fetchData();
  }, []);
  return <div><h1>{data.hello}</h1></div>;
};

export default App;
