import React from "react";
import Skeleton from "react-loading-skeleton";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useState, useEffect, useRef } from "react";
import Stack from "../../contentstack-sdk";
import getConfig from "next/config";
import { addEditableTags, EntryModel } from "@contentstack/utils";
import eventBus from "../../helper/eventBus";
import { pushData } from "../../helper/dataLayer";

type ComponentProps = {
  featuredProductsData: any;
};

export default function FeaturedProductsSection({
  featuredProductsData,
}: ComponentProps) {
  const subscription = eventBus.subscribe(
    (event: { type: string; data: any }) => {
      if (event.type === "selectedLanguage") {
        selectedLanguage(event.data);
      }
    }
  );
  const [getDetails, setDetails] = useState(featuredProductsData);

  var featuredProductsDetails = getDetails ? getDetails : undefined;
  var locale = "en-us";
  const selectedLanguage = (e: string) => {
    const lang = e;
    getAllEntries(lang);
  };

  const { publicRuntimeConfig } = getConfig();
  const envConfig = process.env.CONTENTSTACK_API_KEY
    ? process.env
    : publicRuntimeConfig;
  const liveEdit = envConfig.CONTENTSTACK_LIVE_EDIT_TAGS === "true";
  const getAllEntries = async (lang: string) => {
    const response = await Stack.getEntry({
      contentTypeUid: "page",
      referenceFieldPath: [
        "components.related_articles.articles",
        "components.featured_products.products",
      ],
      jsonRtePath: undefined,
      locale: lang ?? locale,
    });
    liveEdit &&
      response[0].forEach((entry: EntryModel) =>
        addEditableTags(entry, "page", true)
      );
    const componentData = response[0][0].components;
    const data = componentData.find(
      (component: { featured_products: any }) => component.featured_products
    ).featured_products;
    setDetails(data);
  };
  // featuredProductsDetails = featuredProductsData.products;
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<any>(null);
  useEffect(() => {
    sliderRef.current.swiper.slideTo(currentSlide, 500, false);
  }, [currentSlide]);

  const handleNext = () => {
    if (currentSlide < 4) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleDataLayer = (e: {
    product_category: any;
    $: any;
    product_image: {
      $: any;
      url: string | undefined;
      title: string | undefined;
    };
    url: string | undefined;
    title: string;
    price: string | number;
  }) => {
    pushData({
      event: "featuredproducts_click",
      productname: e.title,
      productcategory: e.product_category,
    });
  };
  return (
    <div className="featuredProductsContainer">
      {featuredProductsDetails ? (
        <div>
          <div className="featuredProducts">
            <div className="container">
              <div className="sectionHeader d-flex flex-wrap align-items-center justify-content-between">
                <h2
                  className="sectionTitle"
                  {...(featuredProductsDetails.$?.title as {})}
                >
                  {featuredProductsDetails.title}
                </h2>
                <div className="btnWrap">
                  <a
                    href={featuredProductsDetails.cta.href}
                    className="d-flex align-items-center"
                    {...(featuredProductsDetails.cta.$?.title as {})}
                  >
                    {featuredProductsDetails.cta.title}
                    {featuredProductsDetails.cta.title && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src="/arrow.png"
                        alt="rightArrow"
                        className="rightArrow"
                      />
                    )}
                  </a>
                </div>
              </div>
              <div className="swiper productSwiper">
                <div className="swiperWrapper">
                  <Swiper
                    ref={sliderRef}
                    spaceBetween={200}
                    slidesPerView={3}
                    onSlideChange={() => console.log("slide change")}
                  >
                    {featuredProductsDetails.products &&
                      featuredProductsDetails.products.map(
                        (
                          slideData: any,
                          index: React.Key | null | undefined
                        ) => {
                          return (
                            // eslint-disable-next-line react/jsx-key
                            <SwiperSlide key={index}>
                              <div className="swiperSlide">
                                <div className="productItem">
                                  <div className="imageHolder">
                                    {slideData &&
                                      slideData.product_image &&
                                      slideData.product_image.url && (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                          src={slideData.product_image.url}
                                          alt={slideData.product_image.title}
                                          className="productImage"
                                          {...(slideData.product_image.$
                                            ?.url as {})}
                                        />
                                      )}
                                  </div>
                                  <div className="productDetail">
                                    <h3 className="productTitle">
                                      <a
                                        href={slideData.url}
                                        {...(slideData.$?.url as {})}
                                        onClick={() =>
                                          handleDataLayer(slideData)
                                        }
                                      >
                                        {slideData.title}
                                      </a>
                                    </h3>
                                    <span
                                      className="productPrice"
                                      {...(slideData.$?.price as {})}
                                    >
                                      {slideData.price}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </SwiperSlide>
                          );
                        }
                      )}
                  </Swiper>
                </div>
              </div>
              <div className="swiperArrows">
                <button className="prevButton" onClick={handlePrevious}>
                  {/*  eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/arrow.png" alt="leftArrow" className="leftArrow" />
                </button>
                <button className="nextButton" onClick={handleNext}>
                  {/*  eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/arrow.png"
                    alt="rightArrow"
                    className="rightArrow"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Skeleton />
      )}
    </div>
  );
}
