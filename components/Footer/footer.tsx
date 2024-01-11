import React, { useState } from "react";
import parse from "html-react-parser";
import Skeleton from "react-loading-skeleton";
import { FooterProps, Entry, Links } from "../../typescript/layout";
import Stack from "../../contentstack-sdk";
import getConfig from "next/config";
import { addEditableTags } from "@contentstack/utils";
import eventBus from "../../helper/eventBus";
import { pushData } from "../../helper/dataLayer";

export default function Footer({
  footer,
  entries,
}: {
  footer: FooterProps;
  entries: Entry;
}) {
  const subscription = eventBus.subscribe(
    (event: { type: string; data: any }) => {
      if (event.type === "selectedLanguage") {
        selectedLanguage(event.data);
      }
    }
  );
  const [getFooter, setFooter] = useState(footer);

  const footerData = getFooter ? getFooter : undefined;
  var locale = "en-us";
  const selectedLanguage = (e: string) => {
    const lang = e;
    getFooterRes(lang);
  };

  const { publicRuntimeConfig } = getConfig();
  const envConfig = process.env.CONTENTSTACK_API_KEY
    ? process.env
    : publicRuntimeConfig;
  const liveEdit = envConfig.CONTENTSTACK_LIVE_EDIT_TAGS === "true";

  const getFooterRes = async (lang: string) => {
    const response = await Stack.getEntry({
      contentTypeUid: "footer",
      referenceFieldPath: ["footer_section.nav_links.page_reference"],
      jsonRtePath: ["copyright"],
      locale: lang ?? locale,
    });
    liveEdit && addEditableTags(response[0][0], "footer", true);
    setFooter(response[0][0]);
    return response[0][0];
  };
  const handleDatalayer = (label: string) => {
    pushData({
      event: "social_click",
      socialplatform: label,
    });
  };
  return (
    <footer className="footerContainer">
      <div className="row d-flex flex-wrap justify-content-between container">
        {footerData?.footer_section.map((links, index) => {
          return (
            <div className="col-lg-4 col-md-6 col-sm-6" key={index}>
              <div className="footerMenu">
                <h5 className="widgetTitle" {...links.$?.heading}>
                  {links.heading}
                </h5>
                <ul className="menuList list-unstyled">
                  {links.nav_links.map((subLinks, i) => {
                    const pageReference =
                      subLinks &&
                      subLinks.page_reference[0] &&
                      subLinks.page_reference[0].url
                        ? subLinks.page_reference[0].url
                        : "";
                    return (
                      <li className="menuItem" key={i} {...subLinks.$?.label}>
                        <a href={pageReference}>{subLinks.label}</a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
      {footerData && typeof footerData.copyright_text === "string" ? (
        <div className="footerBottom d-flex align-items-center flex-wrap justify-content-between container">
          <div className="copyright" {...(footerData.$?.copyright_text as {})}>
            {parse(footerData.copyright_text)}
          </div>
          <div className="socialLinks">
            <ul className="d-flex list-unstyled">
              {footerData.social_links.map((list, index) => {
                return (
                  <li
                    className="menuItem"
                    key={index}
                    {...list.link.$?.title}
                    onClick={() => handleDatalayer(list.link.title)}
                  >
                    <a
                      title={list.link.title}
                      href={list.link.href}
                      {...list.link.$?.href}
                    >
                      {/*  eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        className="navigationIcon"
                        src={list.icon.url}
                        alt={list.icon.title}
                        title={list.icon.title}
                        {...list.icon.$?.url}
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      ) : (
        <div className="copyright">
          <Skeleton width={500} />
        </div>
      )}
    </footer>
  );
}
