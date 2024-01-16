import React, { useState, useEffect } from "react";
import Header from "./Header/header";
import Footer from "./Footer/footer";
import {
  HeaderProps,
  FooterProps,
  PageProps,
  ChilderenProps,
  Entry,
  NavLinks,
  Posts,
} from "../typescript/layout";

export default function Layout({
  header,
  footer,
  page,
  entries,
  children,
  articlePost,
  articleList,
}: {
  header: HeaderProps;
  footer: FooterProps;
  page: PageProps;
  articlePost: Posts;
  articleList: Posts;
  entries: Entry;
  children: ChilderenProps;
}) {
  const [getLayout, setLayout] = useState({ header, footer });
  const jsonObj: any = { header, footer };
  page && (jsonObj.page = page);
  articlePost && (jsonObj.article_page = articlePost);
  articleList && (jsonObj.article_page = articleList);

  function buildNavigation(ent: Entry, hd: HeaderProps, ft: FooterProps) {
    let newHeader = { ...hd };
    let newFooter = { ...ft };
    if (ent.length !== newHeader.navigation_menu.length) {
      ent.forEach((entry) => {
        const hFound = newHeader?.navigation_menu.find(
          (navLink: NavLinks) => navLink.label === entry.title
        );
        // if (!hFound) {
        //   newHeader.navigation_menu?.push({
        //     label: entry.title,
        //     page_reference: [
        //       { title: entry.title, url: entry.url },
        //     ],
        //     sub_menu: [{ page_reference:{title: entry.title, url: entry.url}}]
        //   });
        // }
        // const fFound = newFooter?.navigation.link.find(
        // (nlink: Links) => nlink.title === entry.title
        // );
        // if (!fFound) {
        //   newFooter.navigation.link?.push({
        //     title: entry.title,
        //     href: entry.url,
        //     $: entry.$,
        //   });
        // }
      });
    }
    return [newHeader, newFooter];
  }

  // useEffect(() => {
  //   if (footer && header && entries) {
  //     const [newHeader, newFooter] = buildNavigation(entries, header, footer);
  //     setLayout({ header: newHeader, footer: newFooter });
  //   }
  // }, [header, footer]);
  return (
    <>
      {header ? <Header header={getLayout.header} entries={entries} /> : ""}
      <main className="mainClass">
        <>
          {children}
          {/* {Object.keys(jsonObj).length && <DevTools response={jsonObj} />} */}
        </>
      </main>
      {footer ? <Footer footer={getLayout.footer} entries={entries} /> : ""}
    </>
  );
}
