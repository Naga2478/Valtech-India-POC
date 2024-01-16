import React from "react";
import Skeleton from "react-loading-skeleton";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useState, useEffect, useRef } from "react";
import Stack from "../../contentstack-sdk";
import getConfig from "next/config";
import { addEditableTags, EntryModel } from "@contentstack/utils";
import eventBus from "../../helper/eventBus";

type ComponentProps = {
  testimonialsData: any;
};

export default function TestimonialsSection({
  testimonialsData,
}: ComponentProps) {
  const subscription = eventBus.subscribe(
    (event: { type: string; data: any }) => {
      if (event.type === "selectedLanguage") {
        selectedLanguage(event.data);
      }
    }
  );
  const [getDetails, setDetails] = useState(testimonialsData);

  var testimonialsDetails = getDetails ? getDetails : undefined;
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
      (component: { testimonials: any }) => component.testimonials
    ).testimonials;
    setDetails(data);
  };

  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<any>(null);
  useEffect(() => {
    sliderRef.current.swiper.slideTo(currentSlide, 500, false);
  }, [currentSlide]);

  const fetchText = (obj: { children: any[] }) => {
    let text = undefined;
    if (obj.children && obj.children.length) {
      obj.children.map((child) => {
        child.children.map((childText: { text: any }) => {
          text = childText.text;
        });
      });
    }
    return text;
  };
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
  return (
    <div className="testimonialsContainer">
      {testimonialsDetails ? (
        <div className="testimonials">
          <div className="container">
            <div className="reviewsContent">
              <div className="row d-flex flex-wrap">
                <div className="col-md-2">
                  <div className="reviewIcon">
                    {/*  eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={testimonialsDetails.icon.url}
                      alt={testimonialsDetails.icon.title}
                      className="icon"
                      {...(testimonialsDetails.icon.$?.url as {})}
                    />
                  </div>
                </div>
                <div className="col-md-8">
                  <Swiper
                    ref={sliderRef}
                    spaceBetween={50}
                    slidesPerView={1}
                    onSlideChange={() => console.log("slide change")}
                  >
                    <div className="swiper testimonialSwiper">
                      <div className="swiperWrapper">
                        {testimonialsDetails.testimonials &&
                          testimonialsDetails.testimonials.map(
                            (
                              testimonial: {
                                $: any;
                                testimonial_text: any;
                                author_name: any;
                              },
                              index: React.Key | null | undefined
                            ) => {
                              return (
                                <SwiperSlide key={index}>
                                  <div className="swiperSlide">
                                    <div className="testimonialDetail">
                                      <p
                                        {...(testimonial.$
                                          ?.testimonial_text as {})}
                                      >
                                        {testimonial.testimonial_text &&
                                          fetchText(
                                            testimonial.testimonial_text
                                          )}
                                      </p>
                                      <div className="authorDetail">
                                        <div
                                          className="name"
                                          {...(testimonial.$
                                            ?.author_name as {})}
                                        >
                                          {testimonial &&
                                            testimonial.author_name}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </SwiperSlide>
                              );
                            }
                          )}
                      </div>
                      <span
                        className="swiperNotification"
                        aria-live="assertive"
                        aria-atomic="true"
                      ></span>
                    </div>
                    <div className="swiperArrows">
                      <button className="prevButton" onClick={handlePrevious}>
                        {/*  eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/arrow.png"
                          alt="leftArrow"
                          className="leftArrow"
                        />
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
                  </Swiper>
                </div>
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
