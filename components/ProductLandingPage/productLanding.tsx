import algoliasearch from "algoliasearch/lite";
import { Hit as AlgoliaHit } from "instantsearch.js";
import React from "react";
import {
  InstantSearch,
  Hits,
  SearchBox,
  RefinementList,
  Pagination,
  HitsPerPage,
  Configure,
} from "react-instantsearch";

const searchClient = algoliasearch(
  "HVBF4EDF6F",
  "b198abb8cfb4128a05de3c13f2bda32f"
);

type HitProps = {
  hit: AlgoliaHit<{
    search: any;
    _content_type: any;
    url: string;
  }>;
};

function Hit({ hit }: HitProps) {
  return (
    <>
      {hit.search && hit.search.search_title && (
        <div className="searchPanel">
          <a
            className="textSmall"
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
    </>
  );
}
type ComponentProps = {
  productData: any;
};

export default function ProductLandingPageSection({
  productData,
}: ComponentProps) {
  const lang = localStorage.getItem("lang")
    ? localStorage.getItem("lang")
    : "en-us";
  let filters = `_content_type:products_page AND locale:${lang}`;
  return (
    <div className="productLandingPageSection">
      <InstantSearch
        searchClient={searchClient}
        indexName="dev_contentstackpoc"
      >
        <Configure analytics={false} filters={filters} />
        <div className="searchDiv">
          <h1 className="">{productData.search.search_label}</h1>
          <SearchBox
            placeholder={productData.search.search_placeholder_text}
            autoFocus
            className="searchBox"
          />
        </div>
        <div className="hitsPerPage">
          <HitsPerPage
            items={[
              {
                label: `${productData.pagination.resultsperpage} hits per page`,
                value: productData.pagination.resultsperpage,
                default: true,
              },
              { label: "20 hits per page", value: 20 },
              { label: "30 hits per page", value: 30 },
              { label: "40 hits per page", value: 40 },
            ]}
          />
        </div>
        <div className="mainContainer">
          <div className="refinementCategory">
            <h2 className="categoryTitle">Category</h2>
            <RefinementList
              attribute="product_category"
              searchable={false}
              searchablePlaceholder="Search category"
              showMore={false}
            />
          </div>
          <div className="hitContainer">
            <Hits hitComponent={Hit} className="hitData" />
            <Pagination className="pagination" />
          </div>
        </div>
      </InstantSearch>
    </div>
  );
}
