import type { Metadata } from "next";
import ProductPage from "./ProductPage";
import { getFrenchContent } from "./website-content";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getFrenchContent();

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: seo.title,
      description: seo.description,
      images: seo.image ? [seo.image] : [],
    },
  };
}

export default async function Page() {
  const content = await getFrenchContent();
  return <ProductPage content={content} />;
}
