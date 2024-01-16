import React, { useEffect, useState } from "react";
import { getProductPostRes, getProductListRes } from "../../helper";
import { onEntryChange } from "../../contentstack-sdk";
import RenderComponents from "../../components/render-components";
import { Page, PageUrl, ProductPosts } from "../../typescript/pages";
import { pushData } from "../../helper/dataLayer";

export default function ProductPost({
  productPost,
  page,
  pageUrl,
}: {
  productPost: ProductPosts;
  page: Page;
  pageUrl: PageUrl;
}) {
  const [getPost, setPost] = useState({ product: page, post: productPost });
  async function fetchData() {
    const lang = localStorage.getItem("lang")
      ? localStorage.getItem("lang")
      : "en-us";
    if (lang !== null) {
      pushData({
        contentType: "Productpage",
        siteLanguage: lang.toUpperCase(),
      });
    }
    try {
      const entryRes = await getProductPostRes(pageUrl);
      const productRes = await getProductListRes("/products");

      if (!entryRes || !productRes) throw new Error("Status: " + 404);
      setPost({ product: productRes, post: entryRes });
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    onEntryChange(() => fetchData());
  }, [productPost]);

  const { post, product } = getPost;
  return (
    <>
      <RenderComponents
        components={post.components}
        contentTypeUid="products_page"
        entryUid={post?.uid}
        locale={post?.locale}
        productPost={true}
        products={post}
        articlePost={false}
        articles={undefined}
        url={post.url}
      />
    </>
  );
}
export async function getServerSideProps({ params }: any) {
  try {
    const page = await getProductListRes("/products");
    const posts = await getProductPostRes(`/products/${params.post}`);
    if (!page || !posts) throw new Error("404");

    return {
      props: {
        pageUrl: `/products/${params.post}`,
        productPost: posts,
        page,
      },
    };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
}
