import { SmolTweetWithUserData } from "@/lib/types";
import React from "react";
import CheckMark from "./svg/CheckMark";
import Link from "next/link";
import { timeSinceShorter } from "@/lib/time";
import { MarkdownRendererPlain } from "./MarkdownRendererPlain";
import { useRouter } from "next/navigation";

function TweetCard({ theTweet }: { theTweet: SmolTweetWithUserData }) {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(`/t/${theTweet.id}`)}
      className="active:opacity-80 transition-all cursor-pointer"
    >
      <div className="bg-gradient-to-br from-zinc-600/40 to-zinc-800/70 p-[1.5px] rounded-[13.5px]">
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 font-sans text-white py-3 px-4 rounded-xl flex flex-col gap-4 pb-6">
          <div className="flex gap-2">
            <div>
              <Link
                href={`/u/${theTweet.handle}`}
                className="active:opacity-60"
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className="hover:rotate-[3600deg] hover:hue-rotate-180 scale-x-[-1] flip-horizontal hover:scale-150 ease-in-out transition-all"
                  style={{ transitionDuration: "3s" }}
                >
                  <img
                    draggable="false"
                    className="w-12 rounded-full aspect-square"
                    src={theTweet.profile_picture}
                    alt="profile"
                  />
                </div>
              </Link>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-0.5">
                  <Link
                    href={`/u/${theTweet.handle}`}
                    className="active:opacity-60"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="font-bold hover:underline">
                      {theTweet.display_name}
                    </div>
                  </Link>
                  <CheckMark />
                </div>
                <Link
                  href={`/u/${theTweet.handle}`}
                  className="active:opacity-60"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="font-medium opacity-70 text-sm">
                    @{theTweet.handle}
                  </div>
                </Link>
                <div className="opacity-70 text-sm">·</div>
                <div className="opacity-70 text-sm">
                  {timeSinceShorter(new Date(theTweet.created_at).getTime())}
                </div>
              </div>
              <MarkdownRendererPlain>{theTweet.content}</MarkdownRendererPlain>
              {/* <div className="pt-0">{theTweet.content}</div> */}
              {theTweet.image_url && (
                <div className="py-2 pt-3">
                  <Link href={theTweet.image_url} target="_blank">
                    <img
                      className="rounded-md border-2 border-zinc-600 hover:border-primary transition-all duration-150 ease-in-out cursor-pointer active:opacity-50"
                      src={theTweet.image_url}
                      alt={theTweet.content}
                    />
                  </Link>
                </div>
              )}
              {/* <pre>{JSON.stringify(theTweet, null, 2)}</pre> */}
              {theTweet.link_preview_img_url && theTweet.link && (
                <div className="pb-2 group border-white/30 hover:border-yellow-100 border-2 mt-4 rounded-lg overflow-hidden active:opacity-40 active:scale-[98%] transition-all duration-700 active:duration-75">
                  <Link
                    href={theTweet.link}
                    target="_blank"
                    className=""
                    draggable="false"
                  >
                    <div className="overflow-hidden">
                      <img
                        draggable="false"
                        className="md:brightness-[85%] group-hover:brightness-100 transition-all duration-700 ease-in-out cursor-pointer active:opacity-50 group-hover:scale-[102%]"
                        src={theTweet.link_preview_img_url}
                        alt={theTweet.content}
                      />
                    </div>
                    <div className="text-sm pt-3 px-2 font-bold font-grandstander group-hover:text-yellow-100 transition-all duration-300 ease-in-out">
                      {theTweet.link_title}
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TweetCard;
