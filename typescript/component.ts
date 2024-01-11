export type Component = {
  products_listing: boolean;
  articles_listing: boolean;
  featured_products: any;
  related_articles: any;
  brand_collection: any;
  carousel: Carousel;
  shipping_information: ShippingInformation;
  testimonials: any;
};

type Slides = {
  heading: string;
};

export type Carousel = {
  slides: [Slides];
};

type ShippingDetails = {
  text: string;
};

export type ShippingInformation = {
  shipping_details: [ShippingDetails];
};

export type RenderProps = {
  articlePost: boolean;
  contentTypeUid: string;
  entryUid: string;
  locale: string;
  components: Component[];
  articles: any;
  productPost: boolean;
  products: any;
  url: string;
};
