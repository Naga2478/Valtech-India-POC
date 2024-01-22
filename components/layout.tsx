import React from "react";
import Header from "./Header/header";
import Footer from "./Footer/footer";
import { HeaderProps, FooterProps, PageProps, Entry, NavLinks, Posts } from "../typescript/layout";

interface LayoutProps {
  header: HeaderProps;
  footer: FooterProps;
  page: PageProps;
  articlePost: Posts;
  articleList: Posts;
  entries: Entry;
  children: React.ReactNode;
}

export default function Layout({ header, footer, page, articlePost, articleList, entries, children }: LayoutProps) {
  const jsonObj: any = { header, footer, page, article_page: articlePost || articleList };

  function buildNavigation(ent: Entry, hd: HeaderProps, ft: FooterProps) {
    const newHeader = { ...hd, navigation_menu: ent.map(entry => ({ label: entry.title, page_reference: [{ title: entry.title, url: entry.url }], sub_menu: [{ page_reference: { title: entry.title, url: entry.url } }] })) };
    const newFooter = { ...ft, navigation: { link: ent.map(entry => ({ title: entry.title, href: entry.url, $: entry.$ })) } };
    return [newHeader, newFooter];
  }

  React.useEffect(() => {
    if (footer && header && entries) {
      const [newHeader, newFooter] = buildNavigation(entries, header, footer);
      // If you need to do something with newHeader and newFooter, you can do it here
    }
  }, [header, footer, entries]);

  return (
    <>
      {header && <Header header={header} entries={entries} />}
      <main className="mainClass">
        {children}
        {/* {Object.keys(jsonObj).length && <DevTools response={jsonObj} />} */}
      </main>
      {footer && <Footer footer={footer} entries={entries} />}
    </>
  );
}
