"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

export default function Comments() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  
  const giscusTheme = resolvedTheme === "dark" ? "dark" : "light";
  const themeRef = useRef(giscusTheme);

  // Mount script once on client side
  useEffect(() => {
    if (!containerRef.current) return;

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", "wyx2014/zzz-blog");
    script.setAttribute("data-repo-id", "R_kgDOStjaeA");
    script.setAttribute("data-category", "Announcements");
    script.setAttribute("data-category-id", "DIC_kwDOStjaeM4C-r40");
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "bottom");
    script.setAttribute("data-theme", themeRef.current);
    script.setAttribute("data-lang", "zh-CN");
    script.setAttribute("data-loading", "lazy");
    script.crossOrigin = "anonymous";
    script.async = true;

    containerRef.current.appendChild(script);
  }, []);

  // Update theme dynamically when theme toggles
  useEffect(() => {
    themeRef.current = giscusTheme;
    const iframe = document.querySelector<HTMLIFrameElement>("iframe.giscus-frame");
    if (iframe?.contentWindow) {
      iframe.contentWindow.postMessage(
        { giscus: { setConfig: { theme: giscusTheme } } },
        "https://giscus.app"
      );
    }
  }, [giscusTheme]);

  return (
    <div className="giscus-wrapper mt-12 border-t pt-8">
      <h3 className="text-xl font-bold mb-6">评论</h3>
      <div ref={containerRef} id="giscus-container" />
    </div>
  );
}
