import MiniTitle from "@/components/MiniTitle";
import BigTitle from "@/components/BigTitle";
import { findUserByHandle } from "@/lib/postgres";

const UserProfilePage = async ({ params }: { params: { handle: string } }) => {
  const { handle } = params;

  const user = await findUserByHandle(handle);

  if (!user) {
    return <div>User not found</div>;
  }

  const skills = JSON.parse(user.skills);

  return (
    <div className="p-4 space-y-4">
      {/* <div></div> */}
      <div className="flex gap-4 items-center">
        <div
          className="rounded-full w-24 h-24 bg-zinc-900"
          style={{
            backgroundImage: `url(${user.profile_picture})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div>
          <BigTitle>{user.display_name}</BigTitle>
          <MiniTitle>@{user.handle}</MiniTitle>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4 w-full">
        <div className="bg-zinc-900 rounded-lg p-4 max-w-sm w-full">
          <MiniTitle>Skills</MiniTitle>
          <div className="flex flex-col gap-2">
            {skills.map(
              (
                {
                  emoji,
                  name,
                  level,
                }: { emoji: string; name: string; level: string },
                index: number
              ) => (
                <div
                  key={index}
                  className="bg-zinc-800 rounded-lg p-2 flex items-center gap-2 justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div>{emoji}</div>
                    <div>{name}</div>
                  </div>
                  <div>{level}</div>
                </div>
              )
            )}
          </div>
        </div>
        <div className="bg-zinc-900 rounded-lg p-4 flex-1">
          <MiniTitle>Life Goals</MiniTitle>
          <div className="flex flex-col gap-2">{user.life_goals}</div>
        </div>
      </div>

      {/* <div>
        <pre>{JSON.stringify(skills, null, 2)}</pre>
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </div> */}
    </div>
  );
};

export default UserProfilePage;
