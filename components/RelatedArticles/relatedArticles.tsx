import React, { useState } from "react";
import Skeleton from "react-loading-skeleton";
import Stack from "../../contentstack-sdk";
import getConfig from "next/config";
import { addEditableTags, EntryModel } from "@contentstack/utils";
import eventBus from "../../helper/eventBus";

type ComponentProps = {
  relatedArticleData: any;
};

export default function RelatedArticlesSection({
  relatedArticleData,
}: ComponentProps) {
  const subscription = eventBus.subscribe(
    (event: { type: string; data: any }) => {
      if (event.type === "selectedLanguage") {
        selectedLanguage(event.data);
      }
    }
  );
  const [getDetails, setDetails] = useState(relatedArticleData);

  var relatedArticleDetails = getDetails ? getDetails : undefined;
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
      (component: { related_articles: any }) => component.related_articles
    ).related_articles;
    setDetails(data);
  };
  return (
    <div className="relatedArticlesContainer">
      {relatedArticleDetails ? (
        <div className="relatedArticles">
          <div className="latestBlog">
            <div className="container">
              <div className="sectionHeader d-flex flex-wrap align-items-center justify-content-between">
                <h2
                  className="sectionTitle"
                  {...(relatedArticleDetails.$?.heading as {})}
                >
                  {relatedArticleDetails.heading}
                </h2>
                <div className="btnWrap">
                  <a
                    href={relatedArticleDetails.cta.href}
                    className="d-flex align-items-center btnText"
                    {...(relatedArticleDetails.cta.$?.title as {})}
                  >
                    {relatedArticleDetails.cta.title}
                    {/*  eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/arrow.png"
                      alt="rightArrow"
                      className="rightArrow"
                    />
                  </a>
                </div>
              </div>
              <div className="row d-flex flex-wrap article">
                {relatedArticleDetails.articles.map(
                  (
                    article: {
                      $: any;
                      url: string | undefined;
                      feature_image: {
                        $: any;
                        url: any;
                      };
                      date: any;
                      title: string;
                      article_category: string;
                    },
                    index: React.Key | null | undefined
                  ) => {
                    return (
                      <div className="col-md-4 postItem" key={index}>
                        <div className="imageHolder">
                          <a
                            href={article.url}
                            className="postAnchor"
                            {...(article.$?.url as {})}
                          >
                            {/*  eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={
                                article.feature_image &&
                                article.feature_image.url
                              }
                              {...(article.feature_image.$?.url as {})}
                              alt="post"
                              className="postImage"
                            />
                          </a>
                        </div>
                        <div className="postContent d-flex">
                          <div className="metaDate">
                            <div
                              className="metaDay"
                              {...(article.$?.date as {})}
                            >
                              {new Date(article.date).getDate()}
                            </div>
                            <div
                              className="metaMonth"
                              {...(article.$?.date as {})}
                            >
                              {new Date(article.date).toLocaleString(
                                "default",
                                { month: "long" }
                              )}{" "}
                              - {new Date(article.date).getFullYear()}
                            </div>
                          </div>
                          <div className="postHeader">
                            <h3 className="postTitle">
                              <a
                                href={article.url}
                                {...(article.$?.title as {})}
                              >
                                {article.title}
                              </a>
                            </h3>
                            <a
                              href={article.url}
                              className="blogCategories"
                              {...(article.$?.article_category as {})}
                            >
                              {article.article_category}
                            </a>
                          </div>
                        </div>
                      </div>
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
