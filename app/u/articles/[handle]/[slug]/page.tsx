import { findArticleByHandleAndSlug } from "@/lib/postgres";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import MiniTitle from "@/components/MiniTitle";
import BlurryEntrance from "@/components/BlurryEntrance";
import MiniAnimatedPriceOfService from "@/components/MiniAnimatedPriceOfService";
import { Button } from "@/components/ui/button";
const UserProfilePage = async ({
  params,
}: {
  params: Promise<{ handle: string; slug: string }>;
}) => {
  const { handle, slug } = await params;
  console.log("🔴 handle", handle);
  console.log("🔴 slug", slug);

  const article = await findArticleByHandleAndSlug(handle, slug);

  console.log("🔴 article", article);

  if (!article) {
    return <div>Article not found</div>;
  }
  const extraData = JSON.parse(article.extra_data);

  const theContent = extraData.content;

  return (
    <div className="max-w-xl mx-auto pb-12">
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

      <BlurryEntrance delay={0.26}>
        <MarkdownRenderer>{theContent}</MarkdownRenderer>
      </BlurryEntrance>

      <div className="py-8 w-full flex justify-center">
        <Button size="lg">Share this article</Button>
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
