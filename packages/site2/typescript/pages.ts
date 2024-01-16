import { Component } from "../typescript/component";
import { Image } from "../typescript/action";
import { Entry, HeaderProps, FooterProps } from "./layout";

type AdditionalParam = {
  title: string;
  title_h2: string;
  title_h3: string;
  description: string;
  banner_title: string;
  banner_description: string;
  designation: string;
  name: string;
  html_code: string;
  body: string;
  date: string;
  related_post: [];
  copyright: string;
  announcement_text: string;
  label: {};
  url: string;
};

type Post = {
  url: string;
  is_archived: boolean;
  body: string;
  featured_image: Image;
  title: string;
  date: string;
  author: [Author];
  $: AdditionalParam;
};

type Author = {
  title: string;
  $: AdditionalParam;
};

export type Props = {
  page: Page;
  entryUrl: string;
  Component: Function;
  entries: Entry;
  pageProps: PageProps;
  header: HeaderProps;
  footer: FooterProps;
  article: Page;
  ArticlePosts: ArticlePosts[];
};

export type Page = {
  components: Component[];
  uid: string;
  locale: string;
  url: string;
  seo: Seo;
  title: string;
};

export type Context = {
  resolvedUrl: string;
  setHeader: Function;
  write: Function;
  end: Function;
};

export type Pages = [page: Page];

export type PostPage = [post: Post];

export type PageUrl = {
  pageUrl: string;
};

type PageProps = {
  page: Page;
  posts: [];
  archivePost: [];
  articlePost: ArticlePosts;
  component: [Component];
};

type Seo = {
  enable_search_indexing: boolean;
};

type Article = {
  url: string;
  body: string;
  title: string;
  $: AdditionalParam;
};
export type ArticlePosts = {
  components: Component[];
  uid: string;
  locale: string;
  title: string;
  author: any;
  body: any;
  date: any;
  featured_image: any;
  is_archived: any;
  related_post: any;
  seo: any;
  url: any;
  _owner: any;
};
export type ProductPosts = {
  url: string;
  components: Component[];
  uid: string;
  locale: string;
  title: string;
  author: any;
};
