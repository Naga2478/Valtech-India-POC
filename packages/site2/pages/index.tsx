import React, { useState, useEffect } from "react";
import { onEntryChange } from "../contentstack-sdk";
import RenderComponents from "../components/render-components";
import { getPageRes } from "../helper";
import Skeleton from "react-loading-skeleton";
import { Props, Context } from "../typescript/pages";
import { pushData } from "../helper/dataLayer";

export default function Home(props: Props) {
  const { page, entryUrl } = props;

  const [getEntry, setEntry] = useState(page);

  async function fetchData() {
    try {
      const entryRes = await getPageRes(entryUrl);
      if (!entryRes) throw new Error("Status code 404");
      setEntry(entryRes);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    onEntryChange(() => fetchData());
    const lang = localStorage.getItem("lang")
      ? localStorage.getItem("lang")
      : "en-us";
    if (lang !== null) {
      pushData({
        contentType: "Homepage",
        siteLanguage: lang.toUpperCase(),
      });
    }
  }, []);

  return getEntry ? (
    <RenderComponents
      components={getEntry.components}
      contentTypeUid="page"
      entryUid={getEntry.uid}
      locale={getEntry.locale}
      articlePost={false}
      articles={undefined}
      productPost={false}
      products={undefined}
      url={""}
    />
  ) : (
    <Skeleton count={3} height={300} />
  );
}

export async function getServerSideProps(context: Context) {
  try {
    const entryRes = await getPageRes(context.resolvedUrl);
    return {
      props: {
        entryUrl: context.resolvedUrl,
        page: entryRes,
      },
    };
  } catch (error) {
    return { notFound: true };
  }
}
