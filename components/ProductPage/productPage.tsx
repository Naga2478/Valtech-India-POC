import React, { useState } from "react";
import Skeleton from "react-loading-skeleton";
import parse from "html-react-parser";
import Stack from "../../contentstack-sdk";
import getConfig from "next/config";
import { addEditableTags } from "@contentstack/utils";
import eventBus from "../../helper/eventBus";
import { pushData } from "../../helper/dataLayer";

type ComponentProps = {
  productData: any;
  url: any;
};

export default function ProductPageSection({
  productData,
  url,
}: ComponentProps) {
  const subscription = eventBus.subscribe(
    (event: { type: string; data: any }) => {
      if (event.type === "selectedLanguage") {
        selectedLanguage(event.data);
      }
    }
  );
  const [getDetails, setDetails] = useState(productData);

  var productDetails = getDetails ? getDetails : undefined;
  var locale = "en-us";
  const selectedLanguage = (e: string) => {
    const lang = e;
    getProductPostRes(url, lang);
  };

  const { publicRuntimeConfig } = getConfig();
  const envConfig = process.env.CONTENTSTACK_API_KEY
    ? process.env
    : publicRuntimeConfig;
  const liveEdit = envConfig.CONTENTSTACK_LIVE_EDIT_TAGS === "true";
  const getProductPostRes = async (entryUrl: any, locale: string) => {
    const response = await Stack.getEntryByUrl({
      contentTypeUid: "products_page",
      entryUrl,
      referenceFieldPath: ["components.featured_products.products"],
      jsonRtePath: ["description"],
      locale: locale,
    });
    liveEdit && addEditableTags(response[0], "products_page", true);
    setDetails(response[0]);
  };

  const handleDataLayer = (e: {
    title: any;
    product_category: any;
    price: any;
  }) => {
    pushData({
      event: "addtocart",
      productname: e.title,
      productcategory: e.product_category,
      productprice: e.price,
    });
  };
  return (
    <div className="productPageSection">
      {productDetails ? (
        <div className="mainContent d-flex">
          <div className="imageContent">
            {productDetails.product_image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={productDetails.product_image.url}
                alt={productDetails.product_image.title}
                {...(productDetails.product_image.$?.url as {})}
              />
            )}
          </div>
          <div className="productContent">
            <h1 {...(productDetails.$?.title as {})}>{productDetails.title}</h1>
            <h2 {...(productDetails.$?.price as {})}>{productDetails.price}</h2>
            <div {...(productDetails.$?.description as {})}>
              {parse(productDetails.description)}
            </div>
            <button
              className="btn"
              onClick={() => handleDataLayer(productDetails)}
            >
              Add to Cart
            </button>
          </div>
        </div>
      ) : (
        <Skeleton />
      )}
    </div>
  );
}
