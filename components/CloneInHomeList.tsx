import { RawUser } from "@/lib/types";

const CloneInHomeList = ({
  clone,
  index,
}: {
  clone: RawUser;
  index: number;
}) => {
  console.log(" 💚 💚 💚 💚 💚 💚 💚 CLONE: ", clone);

  return (
    <div className="hello p-4 rounded-lg flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div
          className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center border-2 border-white/30"
          style={{
            backgroundImage: `url(${clone.profile_picture})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div>
          <div className="text-xl text-gray-500">{clone.display_name}</div>
          <div className="text-lg font-bold">@{clone.handle}</div>
        </div>
      </div>
    </div>
  );
};

export default CloneInHomeList;
