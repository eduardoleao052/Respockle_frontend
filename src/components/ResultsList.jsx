import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ResultsList({ results }) {

    const navigateTo = useNavigate()

    useEffect(() => {
      console.log(results)
    },[])

    return (
      <div className="header-searchbar-recomendations">
        {results.map((item, index) => (
          <button onClick={() => navigateTo(`community/${item.id}`)} key={index}>
            {item.name}
          </button>
        ))}
      </div>
    );
  }
  
  export default ResultsList;