import { Image } from "./action";
import { Component } from "../typescript/component";

//  Header props
type NotificationBar = {
  $: any;
  show_notification_: boolean;
  notification_message: string;
};
type PageRef = {
  $: any;
  uid: PageRef;
  title: string;
  url: string;
  // $: AdditionalParam;
};
type SubMenu = {
  page_reference: any;
  label: string;
};
type NavigationMenu = {
  label: string;
  page_reference: [PageRef];
  sub_menu: [SubMenu];
};
type Icon = {
  $: any;
  title: string;
  url: string;
};
type URL = {
  href: any;
  title: string;
};
type UtilityNavigation = {
  icon: Icon;
  url: URL;
};

export type HeaderProps = {
  language_switcher: any;
  locale: string;
  logo: Image;
  navigation_menu: [NavigationMenu];
  notification_bar: NotificationBar;
  title: string;
  uid: string;
  utility_navigation: [UtilityNavigation];
  // $: AdditionalParam;
};
// =============================================
// Footer Props

type FooterNavLinks = {
  $: any;
  label: string;
  page_reference: [PageRef];
};
type FooterSection = {
  $: any;
  heading: string;
  nav_links: [FooterNavLinks];
};
type Link = {
  title: string;
  href: string;
};
type SocialLinks = {
  $: any;
  link: any;
  icon: Icon;
  Link: Link;
};
export type FooterProps = {
  $: any;
  title: string;
  copyright_text: string;
  footer_section: [FooterSection];
  social_links: [SocialLinks];
};

// ===========================================

// Page Props

export type PageProps = {
  components: Component[];
};
// ==================================================

type AdditionalParam = {
  title: {};
  copyright: string;
  announcement_text: string;
  label: {};
  url: string;
};

type EntryData = {
  title: string;
  url: string;
  $: AdditionalParam;
};

type Announcement = {
  show_announcement: boolean;
  announcement_text: string;
  $: AdditionalParam;
};

type Share = {
  link: Links;
  icon: Image;
};

type Social = {
  social_share: [Share];
};

type Navigation = {
  link: [Links];
};

type Author = {
  title: string;
  $: AdditionalParam;
};

// type Article = {
//   url: string;
//   body: string;
//   title: string;
//   $: AdditionalParam;
// }

// export type Posts = {
//   locale: string;
//   author: [Author];
//   body: string;
//   date: string;
//   featured_image: {};
//   is_archived: boolean;
//   related_post: [Article];
//   seo: {};
//   url:string;
//   title: string;
//   _owner: {}
// }

export type Entry = [entry: EntryData];

type List = {
  label?: string;
  page_reference: [PageRef];
  $: {};
  href?: string;
};

export type NavLinks = {
  label?: string;
};

export type Links = {
  label?: string;
  title: string;
  href: string;
  $: AdditionalParam;
};

export type ChilderenProps = {
  props: {};
  type: Function;
};

type Article = {
  url: string;
  body: string;
  title: string;
  $: AdditionalParam;
};

export type Posts = {
  locale: string;
  author: [Author];
  body: string;
  date: string;
  featured_image: {};
  is_archived: boolean;
  related_post: [Article];
  seo: {};
  url: string;
  title: string;
  _owner: {};
};
