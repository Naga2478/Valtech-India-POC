import algoliasearch from "algoliasearch/lite";
import { InstantSearch } from "react-instantsearch-dom";
import SearchBox from "./searchBox";
import SearchHits from "./searchHit";
const searchClient = algoliasearch(
  "HVBF4EDF6F",
  "632d8ab53700d1ca15df1becb70d4fb7"
);
export default function Search() {
  return (
    <div className={"algoliaSearch"}>
      <InstantSearch
        searchClient={searchClient}
        indexName="dev_contentstackpoc"
      >
        <SearchBox />
        <SearchHits />
      </InstantSearch>
    </div>
  );
}
