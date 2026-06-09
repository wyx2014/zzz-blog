"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import BlurFade from "@/components/magicui/blur-fade";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { paginate, normalizePage } from "@/lib/pagination";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 5;
const BLUR_FADE_DELAY = 0.04;

interface BlogPost {
  title: string;
  publishedAt: string;
  summary?: string;
  tags?: string[];
  _meta: {
    path: string;
  };
}

interface BlogListProps {
  posts: readonly BlogPost[];
}

function BlogListContent({ posts }: BlogListProps) {
  const searchParams = useSearchParams();
  const pageParam = searchParams ? searchParams.get("page") : null;
  const tagParam = searchParams ? searchParams.get("tag") : null;

  // Extract all unique tags
  const allTags = Array.from(
    new Set(posts.flatMap((post) => post.tags || []))
  ).sort();

  // Filter posts by selected tag if tagParam exists
  const filteredPosts = tagParam
    ? posts.filter((post) =>
      post.tags?.some((t) => t.toLowerCase() === tagParam.toLowerCase())
    )
    : posts;

  const totalPages = Math.ceil(filteredPosts.length / PAGE_SIZE);
  const currentPage = normalizePage(pageParam || undefined, totalPages);

  const { items: paginatedPosts, pagination } = paginate([...filteredPosts], {
    page: currentPage,
    pageSize: PAGE_SIZE,
  });

  return (
    <>
      {/* Tag Filters */}
      {allTags.length > 0 && (
        <BlurFade delay={BLUR_FADE_DELAY}>
          <div className="flex items-center gap-2 mb-8 w-full relative">
            <span className="text-xs font-mono text-muted-foreground shrink-0 uppercase tracking-wider">标签:</span>
            <div
              className="flex gap-2 overflow-x-auto scrollbar-none flex-nowrap flex-1 py-1 -my-1 px-4 -mx-4"
              style={{
                maskImage: "linear-gradient(to right, transparent, black 16px, black calc(100% - 16px), transparent)",
                WebkitMaskImage: "linear-gradient(to right, transparent, black 16px, black calc(100% - 16px), transparent)",
              }}
            >
              <Link
                href="/blog"
                className={cn(
                  "text-xs px-3 py-1 rounded-full border transition-all duration-200 shrink-0",
                  !tagParam
                    ? "bg-primary/10 border-primary text-primary font-medium"
                    : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
                )}
              >
                All
              </Link>
              {allTags.map((tag) => {
                const isActive = tagParam?.toLowerCase() === tag.toLowerCase();
                return (
                  <Link
                    key={tag}
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                    className={cn(
                      "text-xs px-3 py-1 rounded-full border transition-all duration-200 shrink-0",
                      isActive
                        ? "bg-primary/10 border-primary text-primary font-medium"
                        : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
                    )}
                  >
                    {tag}
                  </Link>
                );
              })}
            </div>
          </div>
        </BlurFade>
      )}

      {paginatedPosts.length === 0 ? (
        <BlurFade delay={BLUR_FADE_DELAY * 2}>
          <div className="flex flex-col items-center justify-center py-12 px-4 border border-border rounded-xl">
            <p className="text-muted-foreground text-center">
              No blog posts found under this tag.
            </p>
          </div>
        </BlurFade>
      ) : (
        <BlurFade delay={BLUR_FADE_DELAY * 2}>
          <div className="flex flex-col gap-6">
            {paginatedPosts.map((post, id) => {
              const slug = post._meta.path.replace(/\.mdx$/, "");
              const indexNumber = (pagination.page - 1) * PAGE_SIZE + id + 1;
              return (
                <BlurFade delay={BLUR_FADE_DELAY * 3 + id * 0.05} key={slug}>
                  <div className="flex items-start gap-x-2 group">
                    <span className="text-xs font-mono tabular-nums font-medium mt-[6px]">
                      {String(indexNumber).padStart(2, "0")}.
                    </span>
                    <div className="flex flex-col gap-y-1.5 flex-1">
                      <Link
                        className="tracking-tight text-lg font-medium cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 inline-block w-fit"
                        href={`/blog/${slug}`}
                      >
                        <span className="group-hover:text-primary transition-colors">
                          {post.title}
                          <ChevronRight
                            className="ml-1 inline-block size-4 stroke-3 text-muted-foreground opacity-0 -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0"
                            aria-hidden
                          />
                        </span>
                      </Link>
                      <div className="flex items-center gap-2.5 text-xs text-muted-foreground flex-wrap">
                        <span>{post.publishedAt}</span>
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
                    </div>
                  </div>
                </BlurFade>
              );
            })}
          </div>
        </BlurFade>
      )}

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <BlurFade delay={BLUR_FADE_DELAY * 4}>
          <div className="flex gap-3 flex-row items-center justify-between mt-8">
            <div className="text-sm text-muted-foreground">
              Page {pagination.page} of {pagination.totalPages}
            </div>
            <div className="flex gap-2 sm:justify-end">
              {pagination.hasPreviousPage ? (
                <Link
                  href={`/blog?page=${pagination.page - 1}${tagParam ? `&tag=${encodeURIComponent(tagParam)}` : ""
                    }`}
                  className="h-8 w-fit px-2 flex items-center justify-center text-sm border border-border rounded-lg hover:bg-accent/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  Previous
                </Link>
              ) : (
                <span className="h-8 w-fit px-2 flex items-center justify-center text-sm border border-border rounded-lg opacity-50 cursor-not-allowed">
                  Previous
                </span>
              )}
              {pagination.hasNextPage ? (
                <Link
                  href={`/blog?page=${pagination.page + 1}${tagParam ? `&tag=${encodeURIComponent(tagParam)}` : ""
                    }`}
                  className="h-8 w-fit px-2 flex items-center justify-center text-sm border border-border rounded-lg hover:bg-accent/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  Next
                </Link>
              ) : (
                <span className="h-8 w-fit px-2 flex items-center justify-center text-sm border border-border rounded-lg opacity-50 cursor-not-allowed">
                  Next
                </span>
              )}
            </div>
          </div>
        </BlurFade>
      )}
    </>
  );
}

export default function BlogList({ posts }: BlogListProps) {
  return (
    <Suspense fallback={<div className="text-muted-foreground">Loading posts...</div>}>
      <BlogListContent posts={posts} />
    </Suspense>
  );
}
