import { findArticleByHandleAndSlug } from "@/lib/postgres";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";

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
    <div className="max-w-3xl mx-auto">
      <div>
        <img src={extraData.image_url} alt={extraData.title} />
      </div>
      <MarkdownRenderer>{theContent}</MarkdownRenderer>
      <div>
        <pre>{JSON.stringify(article, null, 2)}</pre>
      </div>
      <div>
        <pre>{JSON.stringify(extraData, null, 2)}</pre>
      </div>
    </div>
  );
};

export default UserProfilePage;
