import { useEffect } from "react";

import axios from "axios";

function Test() {
  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/nqueens/recognized-solutions"
        );
        console.log(response);
      } catch (err) {
        console.log(err);
      }
    };

    fetch();
  }, []);
  return <div></div>;
}

export default Test;
