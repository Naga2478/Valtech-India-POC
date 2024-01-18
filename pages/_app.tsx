import App from "next/app";
import Head from "next/head";
import Router from "next/router";
import NProgress from "nprogress";
import Layout from "../components/layout";
import {
  getHeaderRes,
  getFooterRes,
  getAllEntries,
  getAnalyticsRes,
  getRedirectUrl,
} from "../helper";
import "@contentstack/live-preview-utils/dist/main.css";
import { Props } from "../typescript/pages";
import "../components/styles.scss";
import { useEffect, useState } from "react";
import parse from "html-react-parser";
import { resetDataLayer } from "../helper/dataLayer";
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

type analyticsData = {
  analyticsDetails: any;
};
function MyApp(props: Props, { analyticsDetails }: analyticsData) {
  const { Component, pageProps, header, footer, entries } = props;
  const { page, posts, archivePost, articlePost } = pageProps;

  const metaData = (seo: any) => {
    const metaArr = [];
    for (const key in seo) {
      if (seo.enable_search_indexing) {
        metaArr.push(
          <meta
            name={
              key.includes("meta_")
                ? key.split("meta_")[1].toString()
                : key.toString()
            }
            content={seo[key].toString()}
            key={key}
          />
        );
      }
    }
    return metaArr;
  };
  const articleList: any = posts?.concat(archivePost);
  resetDataLayer();
  useEffect(() => {
    fetchData();
  }, []);
  async function fetchData() {
    try {
      const data = await getAnalyticsRes();
      sendData(data);
      const redirectData = await getRedirectUrl();
      const { asPath } = Router;
      setRedirectUrl(redirectData, asPath);
    } catch (error) {
      console.error(error);
    }
  }
  const [getScript, setScript] = useState(analyticsDetails);
  const analyticsData = getScript ? getScript : undefined;
  const sendData = (data: any) => {
    setScript(data);
  };

  const setRedirectUrl = (redirectData: any, currentPath: any) => {
    if (redirectData) {
      for (let i = 0; i < redirectData.length; i++) {
        if (redirectData[i].from == currentPath) {
          Router.replace(redirectData[i].to);
        }
      }
    }
  };
  return (
    <>
      <Head>
        {analyticsData && analyticsData.head_script && (
          <>{parse(analyticsData.head_script)}</>
        )}
        <meta name="application-name" content="Contentstack-Nextjs-App" />
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1"
        />
        <meta name="theme-color" content="#317EFB" />
        <title>Contentstack-Nextjs-Starter-App</title>
        {page?.seo && page.seo.enable_search_indexing && metaData(page.seo)}
      </Head>
      <>
        {analyticsData && analyticsData.body_script && (
          <>{parse(analyticsData.body_script)}</>
        )}
        <Layout
          header={header}
          footer={footer}
          page={page}
          articleList={articleList}
          entries={entries}
          articlePost={articlePost}
        >
          <Component {...pageProps} />
        </Layout>
      </>
    </>
  );
}

MyApp.getInitialProps = async (appContext: any) => {
  const appProps = await App.getInitialProps(appContext);
  const header = await getHeaderRes();
  const footer = await getFooterRes();
  const entries = await getAllEntries();
  return { ...appProps, header, footer, entries };
};

export default MyApp;
