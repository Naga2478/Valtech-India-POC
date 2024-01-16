import React from "react";

import { RenderProps } from "../typescript/component";
import ArticlePageSection from "./ArticlePage/articlePage";
import BrandCollectionSection from "./BrandCollection/brandCollection";
import Carousel from "./Carousel/carousel";
import FeaturedProductsSection from "./FeaturedProducts/featuredProducts";
import ProductPageSection from "./ProductPage/productPage";
import RelatedArticlesSection from "./RelatedArticles/relatedArticles";
import ShippingSection from "./ShippingInformation/shippingInformation";
import TestimonialsSection from "./Testimonials/testimonials";
import ArticleLandingPage from "./ArticleLandingPage/articleLanding";
import ProductLandingPage from "./ProductLandingPage/productLanding";
export default function RenderComponents(props: RenderProps) {
  const {
    components,
    articlePost,
    entryUid,
    contentTypeUid,
    locale,
    articles,
    productPost,
    products,
    url,
  } = props;
  return (
    <div
      data-pageref={entryUid}
      data-contenttype={contentTypeUid}
      data-locale={locale}
    >
      {components?.map((component, key: number) => {
        if (articlePost === true && component.related_articles) {
          return (
            <ArticlePageSection
              articleData={articles}
              key={`component-${key}`}
              url={url}
            />
          );
        }
        if (articlePost === true && component.articles_listing) {
          return (
            <ArticleLandingPage
              articleData={component.articles_listing}
              key={`component-${key}`}
            />
          );
        }
      })}
      {components?.map((component, key: number) => {
        if (productPost === true && component.products_listing) {
          return (
            <ProductLandingPage
              productData={component.products_listing}
              key={`component-${key}`}
            />
          );
        }
        if (productPost === true && component.featured_products) {
          return (
            <ProductPageSection
              productData={products}
              key={`component-${key}`}
              url={url}
            />
          );
        }
      })}
      {components?.map((component, key: number) => {
        if (component.carousel) {
          return (
            <Carousel
              carouselData={component.carousel}
              key={`component-${key}`}
            />
          );
        }
        if (component.shipping_information) {
          return (
            <ShippingSection
              shippingData={component.shipping_information}
              key={`component-${key}`}
            />
          );
        }
        if (component.brand_collection) {
          return (
            <BrandCollectionSection
              brandCollectionData={component.brand_collection}
              key={`component-${key}`}
            />
          );
        }
        if (component.testimonials) {
          return (
            <TestimonialsSection
              testimonialsData={component.testimonials}
              key={`component-${key}`}
            />
          );
        }
        if (component.related_articles) {
          return (
            <RelatedArticlesSection
              relatedArticleData={component.related_articles}
              key={`component-${key}`}
            />
          );
        }
        if (component.featured_products) {
          return (
            <FeaturedProductsSection
              featuredProductsData={component.featured_products}
              key={`component-${key}`}
            />
          );
        }
      })}
    </div>
  );
}
