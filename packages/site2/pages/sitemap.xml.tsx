import { getAllEntries, getArticleListRes, getProductListRes } from "../helper";
import { Context, Pages, PostPage } from "../typescript/pages";

const Sitemap = () => {
  return null;
};

export const getServerSideProps = async ({ res }: { res: Context }) => {
  const baseUrl = process.env.VERCEL_URL ?? process.env.NEXT_PUBLIC_VERCEL_URL;

  let pages = await getAllEntries();
  let posts = await getArticleListRes();
  let products = await getProductListRes();

  const allPages = pages.map((page: { url: any }) => `${baseUrl}${page.url}`);
  const allPosts = posts.map((post: { url: any }) => `${baseUrl}${post.url}`);
  const allProducts = products.map(
    (product: { url: any }) => `${baseUrl}${product.url}`
  );
  const siteMapList = [...allPages, ...allPosts, ...allProducts].sort();

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${siteMapList
        .map((url) => {
          return `
          <url>
              <loc>${url}</loc>
              <lastmod>${new Date().toISOString()}</lastmod>
              <changefreq>monthly</changefreq>
              <priority>1.0</priority>
            </url>
          `;
        })
        .join("")}
    </urlset>
  `;

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default Sitemap;
