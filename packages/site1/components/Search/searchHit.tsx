// components/search-hits.js
import { connectStateResults } from "react-instantsearch-dom";
import Link from "next/link";
import { pushData } from "../../helper/dataLayer";
function SearchHits({
  searchState,
  searchResults,
}: {
  searchState: any;
  searchResults: any;
}) {
  const validQuery = searchState.query?.length >= 2;
  const handleDataLayer = (e: any) => {
    if (
      e._highlightResult &&
      e._highlightResult.search.search_title &&
      e._highlightResult.search.search_title.matchedWords
    ) {
      pushData({
        event: "internal_search",
        searchterm: e._highlightResult.search.search_title.matchedWords[0],
      });
    }
  };
  return searchState.query && validQuery ? (
    <div className="searchHits">
      {searchResults?.hits.length === 0 && <div>No results found!</div>}
      {searchResults?.hits.length > 0 &&
        searchResults.hits.map((hit: any) => (
          <div key={hit.objectID} className="searchResult">
            {hit.search && hit.search.show_in_results && (
              <div className="searchPanel">
                <a
                  className="textSmall"
                  onClick={() => handleDataLayer(hit)}
                  href={hit && hit.url ? hit.url : "/"}
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="inner">
                    <div className="thumb">
                      {hit.search.search_image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          className="imgPrint"
                          src={hit.search.search_image.url}
                          alt={hit.search.search_image.title}
                        />
                      )}
                    </div>
                    <div className="thumbInfo">
                      <div className="caption">
                        <h3 className="title">{hit.search.search_title}</h3>
                        <p className="title">{hit.search.search_summary}</p>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            )}
          </div>
        ))}
    </div>
  ) : null;
}
export default connectStateResults(SearchHits);
