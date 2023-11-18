import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import CraftcardBoard from "../components/CraftCardBoard";
import baseURL from "../config";
import "./SearchResultsPage.css";

function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const [craftsmen, setCraftsmen] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagesData, setPagesData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const query = searchParams.get("query");
    if (query) {
      fetchResults(query);
    }
  }, [searchParams]);

  const fetchResults = (query) => {
    setLoading(true);
    fetch(
      `${baseURL}/craftsmen?postalcode=${encodeURIComponent(
        query
      )}&page=${currentPage}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setPagesData((prevPagesData) => [
          ...prevPagesData,
          data.craftsmen.craftsmen,
        ]);
        //setCraftsmen(data.craftsmen.craftsmen);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  // if (error) {
  //   return <div>Error: {error}</div>;
  // }

  const handleLoadMore = () => {
    setCurrentPage((currentPage) => currentPage + 1);
  };

  return (
    <div className="resultpage-container">
      <div className="navBar-container">
        <div className="navBar-top">
          <button
            className="navBar-button"
            onClick={() => window.history.back()}
          >
            {" < back"}
          </button>
          <button className="navBar-button">⭐</button>
        </div>
        {/* <div className="navBar-bottom">
          <button id="commentFilter">Comments</button>
          <button id="distanceFilter">Distance</button>
          <button id="ratingFilter">Rating</button>
        </div> */}
      </div>
      {pagesData.map((craftsmenData, index) => (
        <div key={index} className="search-result-container">
          <CraftcardBoard craftsmen={craftsmenData} />
        </div>
      ))}
      {/* <div className="search-result-container">
        <CraftcardBoard craftsmen={craftsmen} />
      </div> */}
      <div className="load-more" onClick={handleLoadMore}>
        Load More
      </div>
    </div>
  );
}

export default SearchResultsPage;
