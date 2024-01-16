import { connectSearchBox } from "react-instantsearch-dom";
function SearchBox({ refine }: { refine: any }) {
  return (
    <input
      className="searchBox"
      type="search"
      placeholder="Search..."
      onChange={(e) => refine(e.currentTarget.value)}
    />
  );
}
export default connectSearchBox(SearchBox);
