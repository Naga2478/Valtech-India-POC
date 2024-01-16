/* eslint-disable import/no-anonymous-default-export */
import * as contentstack from 'contentstack';
import * as Utils from '@contentstack/utils';

import ContentstackLivePreview from '@contentstack/live-preview-utils';
import getConfig from 'next/config';
import eventBus from '../helper/eventBus';

const { publicRuntimeConfig } = getConfig();
const envConfig = process.env.CONTENTSTACK_API_KEY
  ? process.env
  : publicRuntimeConfig;

const Stack = contentstack.Stack({
  api_key: envConfig.CONTENTSTACK_API_KEY
    ? envConfig.CONTENTSTACK_API_KEY
    : envConfig.NEXT_PUBLIC_CONTENTSTACK_API_KEY,
  delivery_token: envConfig.CONTENTSTACK_DELIVERY_TOKEN,
  environment: envConfig.CONTENTSTACK_ENVIRONMENT,
  region: envConfig.CONTENTSTACK_REGION ? envConfig.CONTENTSTACK_REGION : 'us',
  branch: envConfig.CONTENTSTACK_BRANCH ? envConfig.CONTENTSTACK_BRANCH :"main",
  live_preview: {
    enable: true,
    management_token: envConfig.CONTENTSTACK_MANAGEMENT_TOKEN,
    host: envConfig.CONTENTSTACK_API_HOST,
  },
});

if (envConfig.CONTENTSTACK_API_HOST) {
  Stack.setHost(envConfig.CONTENTSTACK_API_HOST);
}

const subscription = eventBus.subscribe((event) => {
  if (event.type === 'selectedLanguage') {
   selectedLanguage(event.data);
  }
});
 var locale = 'en-us';

const selectedLanguage = (e) => {
  locale = e;
}
ContentstackLivePreview.init({
  stackSdk: Stack,
  clientUrlParams: {
    host: envConfig.CONTENTSTACK_APP_HOST,
  },
  ssr: false,
});

export const { onEntryChange } = ContentstackLivePreview;

const renderOption = {
  span: (node, next) => next(node.children),
};

export default {
  /**
   *
   * fetches all the entries from specific content-type
   * @param {* content-type uid} contentTypeUid
   * @param {* reference field name} referenceFieldPath
   * @param {* Json RTE path} jsonRtePath
   *
   */
  getEntry({ contentTypeUid, referenceFieldPath, jsonRtePath, locale }) {
    return new Promise((resolve, reject) => {
      const query = Stack.ContentType(contentTypeUid).Query().language(locale);
      if (referenceFieldPath) query.includeReference(referenceFieldPath);
      query
        .includeOwner()
        .toJSON()
        .find()
        .then(
          (result) => {
            jsonRtePath
              && Utils.jsonToHTML({
                entry: result,
                paths: jsonRtePath,
                renderOption,
              });
            resolve(result);
          },
          (error) => {
            console.error(error);

            // reject(error);
          },
        );
    });
  },

  /**
   *fetches specific entry from a content-type
   *
   * @param {* content-type uid} contentTypeUid
   * @param {* url for entry to be fetched} entryUrl
   * @param {* reference field name} referenceFieldPath
   * @param {* Json RTE path} jsonRtePath
   * @returns
   */
  getEntryByUrl({
    contentTypeUid, entryUrl, referenceFieldPath, jsonRtePath,locale
  }) {
    return new Promise((resolve, reject) => {
      const articleQuery = Stack.ContentType(contentTypeUid).Query().language(locale);
      if (referenceFieldPath) articleQuery.includeReference(referenceFieldPath);
      articleQuery.includeOwner().toJSON();
      const data = articleQuery.where('url', `${entryUrl}`).find();
      data.then(
        (result) => {
          jsonRtePath
            && Utils.jsonToHTML({
              entry: result,
              paths: jsonRtePath,
              renderOption,
            });
          resolve(result[0]);

        },
        (error) => {
          console.error(error);
          // reject(error);
        },
      );
    });
  },
};
