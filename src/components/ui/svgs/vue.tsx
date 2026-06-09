import type { SVGProps } from "react";

const Vue = (props: SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 256 221" preserveAspectRatio="xMidYMid">
    <path
      d="M0 0h51.2L128 132.48L204.8 0h51.2L128 220.8L0 0z"
      fill="#41B883"
    />
    <path
      d="M51.2 0h35.8L128 71.04L169 0h35.8L128 132.48L51.2 0z"
      fill="#35495E"
    />
  </svg>
);

export { Vue };
