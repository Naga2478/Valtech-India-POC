import React, { useState } from "react";
import Skeleton from "react-loading-skeleton";
import Stack from "../../contentstack-sdk";
import getConfig from "next/config";
import { addEditableTags, EntryModel } from "@contentstack/utils";
import eventBus from "../../helper/eventBus";

type ComponentProps = {
  brandCollectionData: any;
};

export default function BrandCollectionSection({
  brandCollectionData,
}: ComponentProps) {
  const subscription = eventBus.subscribe(
    (event: { type: string; data: any }) => {
      if (event.type === "selectedLanguage") {
        selectedLanguage(event.data);
      }
    }
  );
  const [getDetails, setDetails] = useState(brandCollectionData.brands);

  const brandCollectionDetails = getDetails ? getDetails : undefined;
  var locale = "en-us";
  const selectedLanguage = (e: string) => {
    const lang = e;
    getAllEntries(lang);
  };

  const { publicRuntimeConfig } = getConfig();
  const envConfig = process.env.CONTENTSTACK_API_KEY
    ? process.env
    : publicRuntimeConfig;
  const liveEdit = envConfig.CONTENTSTACK_LIVE_EDIT_TAGS === "true";
  const getAllEntries = async (lang: string) => {
    const response = await Stack.getEntry({
      contentTypeUid: "page",
      referenceFieldPath: [
        "components.related_articles.articles",
        "components.featured_products.products",
      ],
      jsonRtePath: undefined,
      locale: lang ?? locale,
    });
    liveEdit &&
      response[0].forEach((entry: EntryModel) =>
        addEditableTags(entry, "page", true)
      );
    const componentData = response[0][0].components;
    const data = componentData.find(
      (component: { brand_collection: any }) => component.brand_collection
    ).brand_collection.brands;
    setDetails(data);
  };
  return (
    <div className="brandCollectionContainer">
      {brandCollectionDetails ? (
        <div className="brandInformation">
          <div className="padding-medium brandCollection">
            <div className="container">
              <div className="d-flex flex-wrap justify-content-between">
                {brandCollectionDetails.map(
                  (
                    brand: {
                      brand_logo: {
                        $: any;
                        url: string | undefined;
                        title: string | undefined;
                      };
                    },
                    index: React.Key | null | undefined
                  ) => {
                    return (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={brand.brand_logo.url}
                        alt={brand.brand_logo.title}
                        className="brandImage"
                        key={index}
                        {...(brand.brand_logo.$?.url as {})}
                      />
                    );
                  }
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Skeleton />
      )}
    </div>
  );
}
