import React, { useState, useEffect } from "react";
import { onEntryChange } from "../../contentstack-sdk";
import RenderComponents from "../../components/render-components";
import { getProductListRes } from "../../helper";

import Skeleton from "react-loading-skeleton";
import { Page, PostPage, PageUrl, Context } from "../../typescript/pages";

export default function Product({
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
      const bannerRes = await getProductListRes(pageUrl);
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
          articlePost={false}
          contentTypeUid="product_collections"
          entryUid={getBanner.uid}
          locale={getBanner.locale}
          components={getBanner.components}
          articles={undefined}
          productPost={true}
          products={undefined}
          url={""}
        />
      ) : (
        <Skeleton height={400} />
      )}
    </>
  );
}
