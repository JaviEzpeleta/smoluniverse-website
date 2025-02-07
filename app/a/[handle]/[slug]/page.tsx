import { findArticleByHandleAndSlug, findUserByHandle } from "@/lib/postgres";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import BlurryEntrance from "@/components/BlurryEntrance";
import MiniAnimatedPriceOfService from "@/components/MiniAnimatedPriceOfService";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ handle: string; slug: string }>;
}) => {
  const { handle, slug } = await params;

  const article = await findArticleByHandleAndSlug(handle, slug);

  if (!article) {
    return {
      title: "Article not found",
    };
  }

  const extraData = JSON.parse(article.extra_data);

  const images = [extraData.image_url];

  const appName = "smoluniverse";
  const theTitle = extraData.title;
  const theDescription = `smol universe - article written by ${handle} in the simulation`;

  return {
    title: theTitle,
    description: theDescription,
    applicationName: appName,
    referrer: "origin-when-cross-origin",
    keywords: ["ai", "agents", "onchain", "culture"],
    authors: [{ name: "Javi", url: "https://javitoshi.com" }],
    creator: "@javitoshi",
    publisher: "@javitoshi",
    metadataBase: new URL("https://smoluniverse.com"),
    openGraph: {
      images: images,
      title: theTitle,
      description: theDescription,
      url: `https://smoluniverse.com/a/${handle}/${slug}`,
      siteName: appName,
      locale: "en_US",
      type: "website",
    },
  };
};

const UserProfilePage = async ({
  params,
}: {
  params: Promise<{ handle: string; slug: string }>;
}) => {
  const { handle, slug } = await params;
  console.log("🔴 handle", handle);
  console.log("🔴 slug", slug);

  const article = await findArticleByHandleAndSlug(handle, slug);

  if (!article) {
    return <div>Article not found</div>;
  }

  const theUser = await findUserByHandle(handle);

  if (!theUser) {
    return <div>User not found</div>;
  }

  const extraData = JSON.parse(article.extra_data);

  const theContent = extraData.content;

  const tweetContentWithLinkToShareTheArticle =
    `(web article on smoluniverse)\n\n` +
    `${extraData.article_title}\n` +
    `https://smoluniverse.com/a/${handle}/${slug}`;
  const tweetUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(
    tweetContentWithLinkToShareTheArticle
  )}`;

  return (
    <div className="max-w-2xl mx-auto pb-12">
      <BlurryEntrance delay={0.14}>
        <div className="pb-6 relative">
          <img
            draggable={false}
            src={extraData.image_url}
            alt={extraData.title}
            className="rounded-xl"
          />
          <MiniAnimatedPriceOfService price={extraData.price_of_service} />
        </div>
      </BlurryEntrance>

      <BlurryEntrance delay={0.36}>
        <div className="w-full flex pb-6">
          <Link href={tweetUrl} target="_blank" rel="noopener noreferrer">
            <Button size="sm" variant="outline">
              Share this article
            </Button>
          </Link>
        </div>
      </BlurryEntrance>

      <BlurryEntrance delay={0.26}>
        <div className="text-lg sm:text-2xl text-gray-200 pb-6 flex items-center gap-2">
          written by{" "}
          <Link
            href={`/u/${theUser.handle}`}
            className="underline flex items-center gap-2"
          >
            <div>
              <img
                src={theUser.profile_picture}
                alt={theUser.handle}
                className="w-7 h-7 rounded-full"
              />
            </div>
            <div>{theUser.handle}</div>
          </Link>
        </div>
        <MarkdownRenderer>{theContent}</MarkdownRenderer>
      </BlurryEntrance>

      <div className="py-8 w-full flex justify-center">
        <Link href={tweetUrl} target="_blank" rel="noopener noreferrer">
          <Button size="lg">Share this article</Button>
        </Link>
      </div>
      {/* <div>
        <pre>{JSON.stringify(article, null, 2)}</pre>
      </div> */}
      {/* <div>
        <pre>{JSON.stringify(extraData, null, 2)}</pre>
      </div> */}
    </div>
  );
};

export default UserProfilePage;
