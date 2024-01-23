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
  carouselData: any;
};

export default function CarouselSection({ carouselData }: ComponentProps) {
  const subscription = eventBus.subscribe(
    (event: { type: string; data: any }) => {
      if (event.type === "selectedLanguage") {
        selectedLanguage(event.data);
      }
    }
  );
  const [getCarousel, setCarousel] = useState(carouselData.slides);

  const slides = getCarousel ? getCarousel : undefined;
  const [currentSlide, setCurrentSlide] = useState(0);
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
      (component: { carousel: any }) => component.carousel
    ).carousel.slides;
    setCarousel(data);
  };
  const sliderRef = useRef<any>(null);
  useEffect(() => {
    sliderRef.current.swiper.slideTo(currentSlide, 500, false);
  }, [currentSlide]);

  const handleNext = (e: {
    $: any;
    image: { url: any };
    heading: string;
    description: { children: { children: { text: string }[] }[] };
    cta: { $: any; title: string };
  }) => {
    if (currentSlide < 4) {
      pushData({
        event: "slider_click",
        slidertitle: e.heading,
        sliderURL: e.image.url,
      });
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrevious = (e: {
    $: any;
    image: { url: any };
    heading: string;
    description: { children: { children: { text: string }[] }[] };
    cta: { $: any; title: string };
  }) => {
    if (currentSlide > 0) {
      pushData({
        event: "slider_click",
        slidertitle: e.heading,
        sliderURL: e.image.url,
      });

      setCurrentSlide(currentSlide - 1);
    }
  };
  return (
    <div className="carouselContainer">
      {slides ? (
        <div>
          <Swiper
            ref={sliderRef}
            spaceBetween={50}
            slidesPerView={1}
            onSlideChange={() => console.log("slide change")}
          >
            {slides &&
              slides.map(
                (
                  slideData: {
                    $: any;
                    image: { url: any };
                    heading: string;
                    description: {
                      children: { children: { text: string }[] }[];
                    };
                    cta: {
                      href: string | undefined;
                      $: any;
                      title: string;
                    };
                  },
                  index: React.Key
                ) => {
                  return (
                    // eslint-disable-next-line react/jsx-key
                    <SwiperSlide key={index}>
                      <section className="slideSection">
                        <button
                          className="buttonPrev"
                          aria-label="Previous slide"
                          onClick={() => handlePrevious(slideData)}
                        >
                          {/*  eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src="/arrow.png"
                            alt="leftArrow"
                            className="leftArrow"
                          />
                        </button>
                        <button
                          className="buttonNext"
                          aria-label="Next slide"
                          onClick={() => handleNext(slideData)}
                        >
                          {/*  eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src="/arrow.png"
                            alt="rightArrow"
                            className="rightArrow"
                          />
                        </button>
                        <div className="swiper mainSwiper">
                          <div className="swiperWrapper" aria-live="polite">
                            <div
                              className="swiperSlide swiperSlideActive"
                              style={{
                                backgroundImage: `url(${slideData.image.url})`,
                              }}
                              role="group"
                              data-swiper-slide-index="0"
                            >
                              <div className="bannerContent">
                                <div className="container">
                                  <div className="row">
                                    <div className="col-md-6">
                                      <h2
                                        className="bannerTitle"
                                        {...slideData.$?.heading}
                                      >
                                        {slideData.heading}
                                      </h2>
                                      <p>
                                        {
                                          slideData.description.children[0]
                                            .children[0].text
                                        }
                                      </p>
                                      <div className="btnWrap">
                                        <a
                                          href={slideData.cta.href}
                                          className="btn"
                                          {...slideData.cta.$?.title}
                                        >
                                          {slideData.cta.title}
                                          {/*  eslint-disable-next-line @next/next/no-img-element */}
                                          <img
                                            src="/arrow.png"
                                            alt="rightArrow"
                                            className="rightArrow"
                                          />
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </section>
                    </SwiperSlide>
                  );
                }
              )}
          </Swiper>
        </div>
      ) : (
        <Skeleton />
      )}
    </div>
  );
}
