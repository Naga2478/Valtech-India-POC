import React, { useEffect, useState } from "react";
import moment from "moment";
import parse from "html-react-parser";
import { getPageRes, getArticlePostRes, getArticleListRes } from "../../helper";
import { onEntryChange } from "../../contentstack-sdk";
import Skeleton from "react-loading-skeleton";
import RenderComponents from "../../components/render-components";
// import ArchiveRelative from '../../components/archive-relative';
import { Page, ArticlePosts, PageUrl } from "../../typescript/pages";
import { pushData } from "../../helper/dataLayer";

export default function ArticlePost({
  articlePost,
  page,
  pageUrl,
}: {
  articlePost: ArticlePosts;
  page: Page;
  pageUrl: PageUrl;
}) {
  const [getPost, setPost] = useState({ banner: page, post: articlePost });
  async function fetchData() {
    const lang = localStorage.getItem("lang")
      ? localStorage.getItem("lang")
      : "en-us";
    if (lang !== null) {
      pushData({
        contentType: "Articlepage",
        siteLanguage: lang.toUpperCase(),
      });
    }
    try {
      const entryRes = await getArticlePostRes(pageUrl);
      const bannerRes = await getArticleListRes("/articles");

      if (!entryRes || !bannerRes) throw new Error("Status: " + 404);
      setPost({ banner: bannerRes, post: entryRes });
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    onEntryChange(() => fetchData());
  }, [articlePost]);

  const { post, banner } = getPost;
  return (
    <>
      <RenderComponents
        components={post.components}
        articlePost
        contentTypeUid="article_page"
        entryUid={post?.uid}
        locale={post?.locale}
        articles={post}
        productPost={false}
        products={undefined}
        url={post.url}
      />
    </>
  );
}
export async function getServerSideProps({ params }: any) {
  try {
    const page = await getArticleListRes("/articles");
    const posts = await getArticlePostRes(`/articles/${params.post}`);
    if (!page || !posts) throw new Error("404");

    return {
      props: {
        pageUrl: `/articles/${params.post}`,
        articlePost: posts,
        page,
      },
    };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
}
