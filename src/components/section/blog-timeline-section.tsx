import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { allPosts } from "content-collections";
import { Timeline, TimelineItem, TimelineConnectItem } from "@/components/timeline";
import { BookOpen, Server, Terminal, LineChart, Cpu } from "lucide-react";
import BlurFade from "@/components/magicui/blur-fade";

const BLUR_FADE_DELAY = 0.04;

function getPostIcon(iconName?: string) {
  switch (iconName?.toLowerCase()) {
    case "server":
    case "vps":
      return <Server className="size-5 stroke-[1.8]" />;
    case "terminal":
    case "code":
      return <Terminal className="size-5 stroke-[1.8]" />;
    case "chart":
    case "line-chart":
    case "trending-up":
      return <LineChart className="size-5 stroke-[1.8]" />;
    case "cpu":
    case "ai":
      return <Cpu className="size-5 stroke-[1.8]" />;
    default:
      return <BookOpen className="size-5 stroke-[1.8]" />;
  }
}

export default function BlogTimelineSection() {
  // Get latest 5 blog posts sorted by publishedDate
  const latestPosts = [...allPosts]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 5);

  if (latestPosts.length === 0) return null;

  return (
    <section id="blog-timeline" className="overflow-hidden">
      <div className="flex min-h-0 flex-col gap-y-8 w-full">
        {/* Header Section */}
        <div className="flex flex-col gap-y-4 items-center justify-center">
          <div className="flex items-center w-full">
            <div className="flex-1 h-px bg-linear-to-r from-transparent from-5% via-border via-95% to-transparent" />
            <div className="border bg-primary z-10 rounded-xl px-4 py-1">
              <span className="text-background text-sm font-medium">Recent Posts</span>
            </div>
            <div className="flex-1 h-px bg-linear-to-l from-transparent from-5% via-border via-95% to-transparent" />
          </div>
          <div className="flex flex-col gap-y-3 items-center justify-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">我喜欢写点东西</h2>
            <p className="text-muted-foreground md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed text-balance text-center">
              记录关于 AI、产品、编程和个人成长的思考与实践。
            </p>
          </div>
        </div>

        {/* Timeline Section */}
        <Timeline>
          {latestPosts.map((post, id) => {
            const slug = post._meta.path.replace(/\.mdx$/, "");
            return (
              <TimelineItem key={slug} className="w-full flex items-start justify-between gap-10">
                <TimelineConnectItem className="flex items-start justify-center">
                  <div className="size-10 bg-card z-10 shrink-0 overflow-hidden p-2.5 border rounded-full shadow ring-2 ring-border text-primary flex items-center justify-center">
                    {getPostIcon(post.icon)}
                  </div>
                </TimelineConnectItem>
                <div className="flex flex-1 flex-col justify-start gap-2 min-w-0">
                  <div className="flex items-center gap-2.5 text-xs text-muted-foreground flex-wrap">
                    {post.publishedAt && (
                      <time className="text-xs text-muted-foreground">{post.publishedAt}</time>
                    )}
                    {post.tags && post.tags.length > 0 && (
                      <>
                        <span>•</span>
                        <div className="flex gap-1.5 flex-wrap">
                          {post.tags.map((tag) => (
                            <Link
                              key={tag}
                              href={`/blog?tag=${encodeURIComponent(tag)}`}
                              className="text-[10px] uppercase tracking-wider font-mono px-1.5 py-0.5 rounded border border-border bg-secondary hover:text-primary hover:border-primary/50 transition-colors"
                            >
                              {tag}
                            </Link>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                  {post.title && (
                    <Link href={`/blog/${slug}`} className="hover:underline">
                      <h3 className="font-semibold leading-none text-lg text-foreground hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                    </Link>
                  )}
                  {post.summary && (
                    <p className="text-sm text-muted-foreground leading-relaxed wrap-break-word">
                      {post.summary}
                    </p>
                  )}
                  <div className="mt-1">
                    <Link
                      href={`/blog/${slug}`}
                      className="text-xs font-medium text-muted-foreground hover:text-primary transition-all duration-200 inline-flex items-center gap-1 group/link hover:underline underline-offset-4"
                    >
                      阅读全文
                      <span className="inline-block translate-x-0 group-hover/link:translate-x-0.5 transition-transform duration-200">→</span>
                    </Link>
                  </div>
                </div>
              </TimelineItem>
            );
          })}
        </Timeline>
      </div>
    </section>
  );
}
