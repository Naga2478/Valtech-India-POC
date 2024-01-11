import Stack from '../contentstack-sdk';
import { addEditableTags } from '@contentstack/utils';
import getConfig from 'next/config';
import eventBus from './eventBus';

const subscription = eventBus.subscribe((event) => {
  if (event.type === 'selectedLanguage') {
   selectedLanguage(event.data);
  }
});
 var locale = 'en-us';

const selectedLanguage = (e) => {
  getHeaderRes(e);
  getFooterRes(e);
  getAllEntries(e);
}
const { publicRuntimeConfig } = getConfig();
const envConfig = process.env.CONTENTSTACK_API_KEY
  ? process.env
  : publicRuntimeConfig;

const liveEdit = envConfig.CONTENTSTACK_LIVE_EDIT_TAGS === 'true';
export const getHeaderRes = async (lang) => {  
  const response = await Stack.getEntry({
    'header',
    referenceFieldPath: ['navigation_menu.page_reference','navigation_menu.sub_menu.page_reference'],
    jsonRtePath: ['notification_bar.notification_message'],
    locale: lang ?? locale,
  });

    liveEdit && addEditableTags(response[0][0], 'header', true);
  return response[0][0];
};

export const getFooterRes = async (lang) => {
  
  const response = await Stack.getEntry({
      'footer',
    referenceFieldPath:['footer_section.nav_links.page_reference'],
    jsonRtePath: ['copyright'],
    locale: lang ?? locale,
  });
    liveEdit && addEditableTags(response[0][0], 'footer', true);
  return response[0][0];
};

export const getAnalyticsRes = async (lang) => {
  const response = await Stack.getEntry({
    contentTypeUid: 'analytics',
    referenceFieldPath:undefined,
    jsonRtePath: undefined,
    locale: lang ?? locale,
  });
  liveEdit && addEditableTags(response, 'analytics', true);
  return response[0][0];
};

export const getAllEntries = async (lang) => {
  
  const response = await Stack.getEntry({
      'page',
    referenceFieldPath: ['components.related_articles.articles','components.featured_products.products'],
    jsonRtePath: undefined,
    locale: lang ?? locale,
  });
  liveEdit &&
      response[0].forEach((entry) => addEditableTags(entry, 'page', true));

  return response[0];
};

export const getPageRes = async (entryUrl) => {
  
  const response = await Stack.getEntryByUrl({
      'page',
    entryUrl,
    referenceFieldPath: ['components.related_articles.articles','components.featured_products.products'],
    jsonRtePath: [
      'components.carousel',
      'components.related_articles.articles',
      'components.featured_products.products',
      'components.related_articles.description'
    ],
    locale: locale,
  });
    liveEdit && addEditableTags(response[0], 'page', true);
  return response[0];
};

export const getArticleListRes = async (entryUrl) => {
  const response = await Stack.getEntry({
    contentTypeUid: 'article_landing_page',
    entryUrl,
    referenceFieldPath: undefined,
    jsonRtePath: undefined,
    locale: locale,
  });

  liveEdit &&
    response[0].forEach((entry) => addEditableTags(entry, 'article_landing_page', true));
  return response[0][0];
};

export const getArticlePostRes = async (entryUrl) => {
  const response = await Stack.getEntryByUrl({
    contentTypeUid: 'article_page',
    entryUrl,
    referenceFieldPath: ['next_article','previous_article','components.related_articles.articles'],
    jsonRtePath: ['description'],
    locale: locale,
  });
  liveEdit && addEditableTags(response[0], 'article_page', true);
  return response[0];
};

export const getProductListRes = async (entryUrl) => {
  const response = await Stack.getEntry({
    contentTypeUid: 'product_collections',
    entryUrl,
    referenceFieldPath: undefined,
    jsonRtePath: undefined,
    locale: locale,
  });

  liveEdit &&
    response[0].forEach((entry) => addEditableTags(entry, 'product_collections', true));
  return response[0][0];
};

export const getProductPostRes = async (entryUrl) => {
  const response = await Stack.getEntryByUrl({
    contentTypeUid: 'products_page',
    entryUrl,
    referenceFieldPath: ['components.featured_products.products'],
    jsonRtePath: ['description'],
    locale: locale,
  });
  liveEdit && addEditableTags(response[0], 'products_page', true);
  return response[0];
};

export const getRedirectUrl = async (entryUrl) => {
  const response = await Stack.getEntry({
    contentTypeUid: 'redirect',
    entryUrl,
    referenceFieldPath: undefined,
    jsonRtePath: undefined,
    locale: locale,
  });
  liveEdit && addEditableTags(response[0], 'redirect', true);
  return response[0];
};
