import React from "react";
import Search from "../components/Search/search";
import { pushData } from "../helper/dataLayer";

export default class SearchPage extends React.Component {
  componentDidMount() {
    const lang = localStorage.getItem("lang")
      ? localStorage.getItem("lang")
      : "en-us";
    if (lang !== null) {
      pushData({
        contentType: "Searchpage",
        siteLanguage: lang.toUpperCase(),
      });
    }
  }
  render() {
    return (
      <div className="search-page">
        <Search />
      </div>
    );
  }
}
