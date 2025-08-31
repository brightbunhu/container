import type { SVGProps } from "react";

export function KesaLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <path d="M21 8.25a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 8.25v7.5A2.25 2.25 0 0 0 5.25 18h13.5A2.25 2.25 0 0 0 21 15.75v-7.5Z"></path>
      <path d="M8 6v12"></path>
      <path d="M16 6v12"></path>
      <path d="M12 6v12"></path>
    </svg>
  );
}
