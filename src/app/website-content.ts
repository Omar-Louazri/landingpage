import { cache } from "react";

export type OrderedItem = {
  order: number;
  title: string;
  visible: boolean;
};

export type LinkItem = OrderedItem & {
  href: string;
  label: string;
};

export type MediaItem = OrderedItem & { image: string };
export type VideoItem = OrderedItem & { url: string };
export type TextItem = OrderedItem & { description: string };

export type WebsiteLocale = {
  contact: { address: string; email: string; phone: string };
  faq: TextItem[];
  features: TextItem[];
  footer: { copyright: string; description: string; links: LinkItem[] };
  general: { rating_count: string; rating_score: string; subtitle: string; title: string };
  hero: {
    description: string;
    eyebrow: string;
    image: string;
    primary_cta: LinkItem;
    secondary_cta: LinkItem;
    title: string;
  };
  how_it_works: (TextItem & { image: string })[];
  media: {
    badge_image: string;
    certificates: MediaItem[];
    light_cycle_images: MediaItem[];
    product_images: MediaItem[];
    videos: VideoItem[];
  };
  navigation: { cta: LinkItem; links: LinkItem[] };
  offer: {
    announcement: string;
    buy_button_text: string;
    buy_link: string;
    commitment: string;
    description: string;
    equipment_included: OrderedItem[];
    legal_note: string;
    original_price: string;
    period: string;
    price: string;
    promo_message: string;
    scarcity_message: string;
    services_included: OrderedItem[];
    title: string;
    top_discount: string;
    type: string;
  };
  seo: { description: string; image: string; keywords: string; title: string };
  services: OrderedItem[];
  social_links: LinkItem[];
  statistics: OrderedItem[];
  testimonials: TextItem[];
};

export type WebsiteContent = {
  content_version: number;
  locales: Record<string, WebsiteLocale>;
  published_at: string;
  schema_version: number;
};

export const getWebsiteContent = cache(async (): Promise<WebsiteContent> => {
  const url = process.env.WEBSITE_CONTENT_API_URL;

  if (!url) {
    throw new Error("WEBSITE_CONTENT_API_URL is not configured");
  }

  const response = await fetch(url, { next: { revalidate: 60 } });

  if (!response.ok) {
    throw new Error(`Website content API returned ${response.status}`);
  }

  return response.json() as Promise<WebsiteContent>;
});

export async function getFrenchContent() {
  const website = await getWebsiteContent();
  const content = website.locales.fr ?? website.locales.en;

  if (!content) {
    throw new Error("Website content API contains neither a French nor English locale");
  }

  return content;
}
