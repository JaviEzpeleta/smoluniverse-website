"use client";

import classNames from "classnames";
import { cleanURL, getFaviconUrl, WebsiteMetaTags } from "@/lib/urls";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import BlurryEntrance from "../BlurryEntrance";

export const linkRenderer = (props: any) => (
  <a
    {...props}
    className={classNames(
      "text-blue-400",
      "hover:text-blue-300",
      "transition-colors"
    )}
    target="_blank"
    rel="noreferrer"
  />
);

export const h1Renderer = (props: any) => (
  <div
    {...props}
    className={classNames(
      "mb-4 text-xl font-medium tracking-tight text-zinc-200 sm:text-3xl"
    )}
  />
);
export const h1RendererDark = (props: any) => (
  <div
    {...props}
    className={classNames(
      "mb-4 mt-4 text-xl font-medium tracking-tight text-zinc-200 sm:text-3xl"
    )}
  />
);
export const h1RendererMessage = (props: any) => (
  <div
    {...props}
    className={classNames(
      "mb-4 mt-4 text-lg font-medium tracking-tight text-zinc-200 sm:text-xl"
    )}
  />
);

export const strongRendererMessage = (props: any) => (
  <strong {...props} className={classNames("font-semibold")} />
);

export const h2Renderer = (props: any) => (
  <div
    {...props}
    className={classNames(
      "font-light",
      "mb-4 text-base uppercase tracking-wider text-zinc-400 sm:text-xl"
    )}
  />
);
export const h2RendererDark = (props: any) => (
  <div
    {...props}
    className={classNames(
      "font-light",
      "mb-4 pt-6 text-base uppercase tracking-wider text-zinc-300 sm:text-xl"
    )}
  />
);

export const h2RendererMessage = (props: any) => (
  <div
    {...props}
    className={classNames(
      "font-light",
      "mb-4 pt-6 text-base uppercase tracking-wider text-zinc-300"
    )}
  />
);
export const h3Renderer = (props: any) => (
  <div
    {...props}
    className={classNames(
      "",
      "",
      "py-2 text-lg md:text-xl font-semibold tracking-tight text-zinc-200"
    )}
  />
);

export const codeRenderMessage = (props: any) => (
  <span className="inline-block bg-white/40 rounded-sm p-0.1 px-1 text-sm">
    <pre {...props}>{props.children}</pre>
  </span>
);

// ! in case we want to let people copy every code block easily (but it's not an inline-block thing tho 😢)
// export const codeRenderMessage = (props: any) => (
//   <div className="">
//     <div className="flex justify-end pt-1">
//       <Button
//         onClick={() => {
//           navigator.clipboard.writeText(props.children)
//           toast.success("Copied to clipboard")
//         }}
//         size="sm"
//         variant="secondary"
//         className="group hover:bg-indigo-300 bg-indigo-900/50 transition-all -translate-y-1"
//       >
//         <div className="text-xs flex items-center gap-2 text-emerald-500 group-hover:text-emerald-700">
//           <div className="font-medium tracking-tight">copy</div>
//           <div className="">
//             <LuCopy />
//           </div>
//         </div>
//       </Button>
//     </div>
//     <pre
//       {...props}
//       className="text-xs mb-4 bg-emerald-950/100 shadow-md shadow-black/30 p-2 rounded-md block whitespace-pre-wrap break-words"
//     >
//       {props.children}
//     </pre>
//   </div>
// )

export const h3RendererMessage = (props: any) => (
  <div
    {...props}
    className={classNames(
      "",
      "",
      "font-semibold mt-2 py-2 pt-4 text-lg sm:text-xl tracking-tight text-zinc-300"
    )}
  />
);

export const h4Renderer = (props: any) => (
  <div
    {...props}
    className={classNames(
      "mb-4 text-lg font-medium tracking-tight text-zinc-200 sm:text-xl"
    )}
  />
);

export const hrRenderer = (props: any) => (
  <div
    {...props}
    className={classNames(
      "border-t border-green-600/60",
      "my-4",
      "w-full",
      "h-0"
    )}
  />
);

export const pRenderer = (props: any) => (
  <div
    {...props}
    className={classNames(
      "text-base font-medium lg:text-lg my-2 text-zinc-200"
    )}
  />
);
export const pRendererMessage = (props: any) => (
  <div {...props} className={classNames("text-base mt-0.5 mb-2.5")} />
);
// export const pRendererMessage = (props: any) => <p {...props} className={classNames("text-base mt-2 mb-4")} />

export const liRenderer = (props: any) => (
  <li {...props} className={classNames("text-base", "my-4 p-0")} />
);
export const liRendererMessage = (props: any) => (
  <li
    {...props}
    className={classNames("text-base", "m-0 mb-2 p-0 list-disc ml-4")}
  />
);

export const ARenderer = (props: any) => {
  const loadedRef = useRef(false);
  const [metaTags, setMetaTags] = useState<WebsiteMetaTags | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    const fetch = async () => {
      const url = props.children.replaceAll("lens.dev/", "hey.xyz/");

      const res = await axios.post("/api/fetch-meta-tags", { url });
      const metaTags = res.data.metaTags;
      setMetaTags(metaTags);
    };
    fetch();
  }, [props.children]);

  if (!props.children.replaceAll)
    return (
      <div className="hello p-2 bg-emerald-400 text-4xl">WTF WHAAAAT!!!!!</div>
    );
  const theURL = props.children.replaceAll("lens.dev/", "hey.xyz/");
  const faviconUrl = getFaviconUrl(theURL);

  return (
    <a
      {...props}
      className={classNames(
        "text-blue-400",
        "hover:text-blue-200",
        "transition-colors inline-flex items-center gap-1 hover:bg-indigo-100 px-0.5 rounded-md relative"
      )}
      href={theURL}
      target="_blank"
      rel="noreferrer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img src={faviconUrl} alt="favicon" className="w-[14px] rounded-sm" />
      {cleanURL(theURL)}
      <AnimatePresence>
        {isHovered && metaTags && metaTags.thumbnail && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 10, scale: 0.95, filter: "blur(4px)" }}
            // transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute z-10 -top-[128px] md:-top-[214px] cursor-pointer bg-white/60 border border-zinc-300/20 shadow-sm shadow-black/30 backdrop-blur-sm text-white p-2 px-4 rounded-md flex-col items-center justify-center"
          >
            <div className="w-full flex items-center">
              <div className="relative">
                <img
                  src={metaTags.thumbnail}
                  alt="thumbnail"
                  className="h-[88px] md:h-[168px] rounded-lg shadow-sm shadow-black/40"
                />
                <div className="absolute -bottom-0.5 -left-0.5 bg-black/60 rounded-full">
                  <img
                    src={faviconUrl}
                    alt="favicon"
                    className="w-[14px] rounded-sm shadow-sm shadow-black/40"
                  />
                </div>
              </div>
            </div>
            <div className="truncate font-medium tracking-tight text-ellipsis w-52 md:w-72 text-sm pt-1">
              {metaTags.title}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </a>
  );
};

export const ulRenderer = (props: any) => (
  <ul
    {...props}
    className={classNames(
      "text-lg list-disc pl-1.5 sm:pl-4 marker:text-indigo-400",
      "mb-2 p-0"
    )}
  />
);

export const olRendererMessage = (props: any) => (
  <ol
    {...props}
    className={classNames(
      "text-base list-decimal pl-1.5 sm:pl-4 marker:text-indigo-400 m-2 p-0"
    )}
  />
);

export const olRenderer = (props: any) => (
  <ol
    {...props}
    className={classNames(
      "text-base list-decimal pl-1.5 sm:pl-4 marker:text-indigo-400 m-2 p-0"
    )}
  />
);

export const preRenderer = (props: any) => (
  <pre {...props} className={classNames("text-xs", "bg-white/80")} />
);

export const emRenderer = (props: any) => (
  <BlurryEntrance>
    <div className="px-2 lg:px-4">
      <div
        {...props}
        className={classNames(
          "",
          "mt-12 mb-8 p-2 bg-indigo-50 dark:bg-indigo-950  font-medium rounded-md shadow-md lg:px-8 lg:py-4 shadow-indigo-200"
        )}
      />
    </div>
  </BlurryEntrance>
);
