import React, { useState, useEffect } from "react";
import { onEntryChange } from "../../contentstack-sdk";
import RenderComponents from "../../components/render-components";
import { getPageRes, getArticleListRes } from "../../helper";

import Skeleton from "react-loading-skeleton";
import { Page, PostPage, PageUrl, Context } from "../../typescript/pages";

export default function Article({
  page,
  posts,
  archivePost,
  pageUrl,
}: {
  page: Page;
  posts: PostPage;
  archivePost: PostPage;
  pageUrl: PageUrl;
}) {
  const [getBanner, setBanner] = useState(page);
  async function fetchData() {
    try {
      const bannerRes = await getArticleListRes(pageUrl);
      if (!bannerRes) throw new Error("Status code 404");
      setBanner(bannerRes);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    onEntryChange(() => fetchData());
  }, []);

  return (
    <>
      {getBanner && getBanner.components ? (
        <RenderComponents
          articlePost
          contentTypeUid="article_landing_page"
          entryUid={getBanner.uid}
          locale={getBanner.locale}
          components={getBanner.components}
          articles={undefined}
          productPost={false}
          products={undefined}
          url={""}
        />
      ) : (
        <Skeleton height={400} />
      )}
    </>
  );
}
