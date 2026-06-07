import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog', ({ data }) => {
    return import.meta.env.PROD ? !data.draft : true;
  });

  const sortedPosts = posts.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );

  return rss({
    title: "王焕章agi",
    description: "在学术的严谨与科技的无垠之间，记录思考。包含容器化实践、云原生架构和前端设计美学。",
    site: context.site || 'https://localhost:8080',
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      // Compute link relative to site root
      link: `/posts/${post.id.replace(/\.[^/.]+$/, "")}/`,
    })),
    customData: `<language>zh-CN</language>`,
  });
}
