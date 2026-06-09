import { Icons } from "@/components/icons";
import { HomeIcon, NotebookIcon } from "lucide-react";
import { ReactLight } from "@/components/ui/svgs/reactLight";
import { NextjsIconDark } from "@/components/ui/svgs/nextjsIconDark";
import { Typescript } from "@/components/ui/svgs/typescript";
import { Nodejs } from "@/components/ui/svgs/nodejs";
import { Python } from "@/components/ui/svgs/python";
import { Shopify } from "@/components/ui/svgs/shopify";
import { Vue } from "@/components/ui/svgs/vue";
import { Docker } from "@/components/ui/svgs/docker";

export interface WorkItem {
  company: string;
  href?: string;
  badges: readonly string[];
  location: string;
  title: string;
  logoUrl: string;
  start: string;
  end?: string;
  description: string;
}

export interface EducationItem {
  school: string;
  href: string;
  degree: string;
  logoUrl: string;
  start: string;
  end: string;
}

export interface ProjectItem {
  title: string;
  href: string;
  dates: string;
  active: boolean;
  description: string;
  technologies: readonly string[];
  links: readonly {
    type: string;
    href: string;
    icon: React.ReactNode;
  }[];
  image: string;
  video: string;
}

export interface HackathonItem {
  title: string;
  dates: string;
  location: string;
  description: string;
  image?: string;
  mlh?: string;
  links: readonly {
    title: string;
    icon: React.ReactNode;
    href: string;
  }[];
}

export const DATA = {
  name: "王焕章",
  initials: "王",
  url: "https://wyx2014.github.io",
  location: "China",
  locationLink: "https://www.google.com/maps/place/China",
  description:
    "做务实的 AI 学习者。记录 AI、产品、编程和个人成长的学习与实践。",
  summary:
    "我的主业是头部资管的技术螺丝钉，同时对AI、产品、编程、跨境和投资感兴趣。这个博客主要保存我的学习笔记、项目复盘、工具体验和一些阶段性的判断。内容不追求完整正确，更强调真实实践、可复用经验和长期迭代。",
  avatarUrl: "/avatar.png",
  skills: [
    { name: "React", icon: ReactLight },
    { name: "Next.js", icon: NextjsIconDark },
    { name: "Typescript", icon: Typescript },
    { name: 'Vue', icon: Vue },
    { name: "Node.js", icon: Nodejs },
    { name: "Python", icon: Python },
    { name: "Shopify", icon: Shopify },
    { name: "Docker", icon: Docker },
  ],
  navbar: [
    { href: "/", icon: HomeIcon, label: "首页" },
    { href: "/blog", icon: NotebookIcon, label: "博客" },
  ],
  contact: {
    email: "wangyb789013@gmail.com",
    tel: "",
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/wyx2014",
        icon: Icons.github,
        navbar: true,
      },
      email: {
        name: "发送邮件",
        url: "mailto:wangyb789013@gmail.com",
        icon: Icons.email,
        navbar: true,
      },
    },
  },
  work: [] as readonly WorkItem[],
  education: [] as readonly EducationItem[],
  projects: [
    {
      title: "DeepSeek助手",
      href: "",
      dates: "2026.4 - 2026.6",
      active: true,
      description:
        "一个基于Deepseek的浏览器插件。",
      technologies: [
        "Typescript",
      ],
      links: [
        {
          type: "Chrome plugin",
          href: "",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "",
      video:
        "/deepseek-plugin.mp4",
    },
  ] as readonly ProjectItem[],
  hackathons: [] as readonly HackathonItem[],
} as const;
