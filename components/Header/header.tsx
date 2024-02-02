import React, { useState, ChangeEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import parse from "html-react-parser";
import Skeleton from "react-loading-skeleton";
import { HeaderProps, Entry } from "../../typescript/layout";
import eventBus from "../../helper/eventBus";
import Stack from "../../contentstack-sdk";
import getConfig from "next/config";
import { addEditableTags } from "@contentstack/utils";
import { pushData } from "../../helper/dataLayer";
import MobileMenuScript from './MobileMenuScript'; 

export default function Header({ header, entries }: { header: HeaderProps; entries: Entry }) {
  const router = useRouter();
  const [getHeader, setHeader] = useState(header);

  const headerData = getHeader || undefined;
  const { publicRuntimeConfig } = getConfig();
  const envConfig = process.env.CONTENTSTACK_API_KEY ? process.env : publicRuntimeConfig;
  const liveEdit = envConfig.CONTENTSTACK_LIVE_EDIT_TAGS === "true";
  
  const getSelectedLanguage = (e: ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    localStorage.setItem("lang", e.target.value);
    const value = localStorage.getItem("lang")
      ? localStorage.getItem("lang")
      : "en-us";
    eventBus.next({ type: "selectedLanguage", data: value });
    getHeaderRes(value);
  };

  const getHeaderRes = async (lang: string | null) => {
    const response = await Stack.getEntry({
      contentTypeUid: "header",
      referenceFieldPath: ["navigation_menu.page_reference"],
      jsonRtePath: ["notification_bar.notification_message"],
      locale: lang,
    });

    liveEdit && addEditableTags(response[0][0], "header", true);
    setHeader(response[0][0]);
    return response[0][0];
  };

  const handleDatalayer = (label: string) => {
    pushData({
      event: "main_navigation",
      navigationlinktext: label,
    });
  };

  return (
    <header className="header">
      <MobileMenuScript />
      <div className="menu-toggle" id="mobile-menu-toggle">
        <span></span>
        <span></span>
        <span></span>
      </div>
    
      <div className="productLogo productLogoMobile col-md-1">
        {headerData ? (
          <Link href="/">
            <a className="logoTag" title="Contentstack">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="logo"
                src={headerData.logo.url}
                alt={headerData.title}
                title={headerData.title}
                {...(headerData.logo.$?.url as {})}
              />
            </a>
          </Link>
        ) : (
          <Skeleton width={150} />
        )}
      </div>
      <div className="headerContainer" id="headerContainer">
        {headerData?.notification_bar?.show_notification_ ? (
          <div>
          <div className="contactContainer borderBottom">
            <div className="row d-flex align-items-center">
              <div className="col-md-8 headerContact">
                <div
                  className="text"
                  {...(headerData.notification_bar.$
                    ?.notification_message as {})}
                >
                  {parse(headerData.notification_bar.notification_message)}
                </div>
              </div>
              <div className="col-md-2 col-sm-12 userContainer">
                <ul className="d-flex justify-content-center list-unstyled">
                  {headerData ? (
                    headerData.utility_navigation.map((list, index) => {
                      return (
                        list &&
                        list.icon && (
                          <li key={index} {...(list.icon.$?.url as {})}>
                            <Link href={list.url.href}>
                              <a className="logoTag" title={list.icon.title}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  className="navigationIcon"
                                  src={list.icon.url}
                                  alt={list.icon.title}
                                  title={list.icon.title}
                                />
                              </a>
                            </Link>
                          </li>
                        )
                      );
                    })
                  ) : (
                    <Skeleton width={300} />
                  )}
                </ul>
              </div>
              <div className="col-md-2 justify-content-center languageContainer">
                <span>
                  <select
                    className="langSwitcher"
                    onChange={(e) => getSelectedLanguage(e)}
                  >
                    {headerData.language_switcher.languages.map(
                      (lang: string, index: React.Key) => {
                        return (
                          <option value={lang} key={index}>
                            {lang}
                          </option>
                        );
                      }
                    )}
                  </select>
                </span>
              </div>
            </div>
          </div>
          <div className="navbarContainer row d-flex align-items-center">
            <div className="productLogo col-md-1">
              {headerData ? (
                <Link href="/">
                  <a className="logoTag" title="Contentstack">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className="logo"
                      src={headerData.logo.url}
                      alt={headerData.title}
                      title={headerData.title}
                      {...(headerData.logo.$?.url as {})}
                    />
                  </a>
                </Link>
              ) : (
                <Skeleton width={150} />
              )}
            </div>
            <div className="col-md-9">
              <nav className="navbar">
                <div className="navItem d-flex justify-content-end right desktop">
                  <ul className="menuList">
                    {headerData ? (
                      headerData.navigation_menu.map((list, index) => {
                        const className =
                          list && list.sub_menu[0] && list.sub_menu[0].label
                            ? "menuItem hasSub"
                            : "menuItem";
                        const pageReference =
                          list &&
                          list.page_reference[0] &&
                          list.page_reference[0].url
                            ? list.page_reference[0].url
                            : "";
                        const subPageReference =
                          list &&
                          list.sub_menu[0] &&
                          list.sub_menu[0].page_reference[0] &&
                          list.sub_menu[0].page_reference[0].url
                            ? list.sub_menu[0].page_reference[0].url
                            : "";
                        return (
                          list &&
                          list.page_reference[0] && (
                            <li
                              key={list.label}
                              className={className}
                              {...(list.page_reference[0].$?.url as {})}
                              onClick={() => handleDatalayer(list.label)}
                            >
                              <Link href={pageReference}>
                                <a className="itemInchor d-flex align-item-center parentMenu">
                                  {list.label}
                                </a>
                              </Link>
                              <ul className="subMenu">
                                {list &&
                                  list.sub_menu[0] &&
                                  list.sub_menu[0].label &&
                                  list.sub_menu.map((subList, index) => {
                                    return (
                                      <li
                                        key={index}
                                        className="subMenuList"
                                        {...(list.page_reference[0].$
                                          ?.url as {})}
                                        onClick={() =>
                                          handleDatalayer(subList.label)
                                        }
                                      >
                                        <Link href={subPageReference}>
                                          <a className="itemAnchor">
                                            {subList.label}
                                          </a>
                                        </Link>
                                      </li>
                                    );
                                  })}
                              </ul>
                            </li>
                          )
                        );
                      })
                    ) : (
                      <Skeleton width={300} />
                    )}
                  </ul>
                </div>
              </nav>
            </div>
          </div>
        </div>
        ) : (
          <Skeleton />
        )}
      </div>
    </header>
  );
}
