import React, { useState } from "react";
import Skeleton from "react-loading-skeleton";
import parse from "html-react-parser";
import Stack from "../../contentstack-sdk";
import getConfig from "next/config";
import { addEditableTags } from "@contentstack/utils";
import eventBus from "../../helper/eventBus";

type ComponentProps = {
  articleData: any;
  url: any;
};

export default function ArticlePageSection({
  articleData,
  url,
}: ComponentProps) {
  const subscription = eventBus.subscribe(
    (event: { type: string; data: any }) => {
      if (event.type === "selectedLanguage") {
        selectedLanguage(event.data);
      }
    }
  );
  const [getDetails, setDetails] = useState(articleData);

  var articleDetails = getDetails ? getDetails : undefined;
  var locale = "en-us";
  const selectedLanguage = (e: string) => {
    const lang = e;
    getArticlePostRes(url, lang);
  };

  const { publicRuntimeConfig } = getConfig();
  const envConfig = process.env.CONTENTSTACK_API_KEY
    ? process.env
    : publicRuntimeConfig;
  const liveEdit = envConfig.CONTENTSTACK_LIVE_EDIT_TAGS === "true";
  const getArticlePostRes = async (entryUrl: any, locale: string) => {
    const response = await Stack.getEntryByUrl({
      contentTypeUid: "article_landing_page",
      entryUrl,
      referenceFieldPath: [
        "next_article",
        "previous_article",
        "components.related_articles.articles",
      ],
      jsonRtePath: ["description"],
      locale: locale,
    });
    liveEdit && addEditableTags(response[0], "article_landing_page", true);
    setDetails(response[0]);
  };

  return (
    <div className="articlePageSection">
      {articleDetails ? (
        <div>
          <div className="mainContent d-flex flex-wrap">
            <div className="container">
              <div className="row">
                <div className="col-md-6">
                  <div className="postMeta">
                    <span
                      className="postDate"
                      {...(articleDetails.$?.date as {})}
                    >
                      {articleDetails.date}
                    </span>{" "}
                    /
                    <a
                      href={articleDetails.url}
                      className="blogCategories"
                      {...(articleDetails.$?.url as {})}
                    >
                      {articleDetails.article_category}
                    </a>
                  </div>
                  <h1
                    className="pageTitle"
                    {...(articleDetails.$?.title as {})}
                  >
                    {articleDetails.title}
                  </h1>
                  <div className="featureImage">
                    {/*  eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={articleDetails.feature_image.url}
                      alt={articleDetails.feature_image.title}
                      className="img"
                      {...(articleDetails.feature_image.$?.url as {})}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="postContent">
                    <div {...(articleDetails.$?.description as {})}>
                      {parse(articleDetails.description)}
                    </div>

                    <div className="postTags">
                      <div className="blockTag">
                        <ul className="listUnstyled d-flex">
                          {articleDetails.tags.map(
                            (tagText: string, index: React.Key) => {
                              return (
                                <li key={index}>
                                  <a className="btn">{tagText}</a>
                                </li>
                              );
                            }
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="singlePostNavigation">
                    <div className="row postNavigation d-flex flex-wrap">
                      <a
                        className="col-md-6 postPrev"
                        href={articleDetails.previous_article[0].url}
                        title="Previous Post"
                      >
                        <span>Previous</span>
                        <h3 className="pageNavTitle">
                          {articleDetails.previous_article[0].title}
                        </h3>
                      </a>
                      <a
                        className="col-md-6 postNext"
                        href={articleDetails.next_article[0].url}
                        title="Next Post"
                      >
                        <span>Next</span>
                        <h3 className="pageNavTitle">
                          {articleDetails.next_article[0].title}
                        </h3>
                      </a>
                    </div>
                  </div>
                </div>
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
