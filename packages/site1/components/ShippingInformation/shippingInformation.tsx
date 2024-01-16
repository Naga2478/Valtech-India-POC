import React, { useState } from "react";
import Skeleton from "react-loading-skeleton";
import parse from "html-react-parser";
import Stack from "../../contentstack-sdk";
import getConfig from "next/config";
import { addEditableTags, EntryModel } from "@contentstack/utils";
import eventBus from "../../helper/eventBus";

type ComponentProps = {
  shippingData: any;
};

export default function ShippingSection({ shippingData }: ComponentProps) {
  const subscription = eventBus.subscribe(
    (event: { type: string; data: any }) => {
      if (event.type === "selectedLanguage") {
        selectedLanguage(event.data);
      }
    }
  );
  const [getDetails, setDetails] = useState(shippingData);

  var shippingDetails = getDetails ? getDetails.shipping_details : undefined;
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
      (component: { shipping_information: any }) =>
        component.shipping_information
    ).shipping_information;
    setDetails(data);
  };

  return (
    <div className="shippingContainer">
      {shippingDetails ? (
        <div>
          <section className="shippingInformation">
            <div className="container">
              <div className="row d-flex flex-wrap justify-content-between">
                {shippingDetails.map(
                  (
                    shipData: {
                      $: any;
                      icon: {
                        $: any;
                        url: string | undefined;
                        title: string | undefined;
                      };
                      text: string;
                    },
                    index: React.Key | null | undefined
                  ) => {
                    return (
                      // eslint-disable-next-line react/jsx-key
                      <div className="col-lg-3 col-md-3 col-sm-6" key={index}>
                        <div className="iconBox">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            className="navigationIcon"
                            src={shipData.icon.url}
                            alt={shipData.icon.title}
                            title={shipData.icon.title}
                            {...(shipData.icon.$?.url as {})}
                          />
                          <h4
                            className="blockTitle"
                            {...(shipData.$?.text as {})}
                          >
                            {parse(shipData.text)}
                          </h4>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </section>
        </div>
      ) : (
        <Skeleton />
      )}
    </div>
  );
}
