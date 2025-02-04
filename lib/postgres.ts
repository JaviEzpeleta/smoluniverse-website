/*
* 👀 Table Definitions:

CREATE TABLE sim_users (
  handle TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  profile_picture TEXT,
  cover_picture TEXT,
  twitter_id TEXT,
  bio TEXT,
  life_goals TEXT NOT NULL,
  skills TEXT NOT NULL,
  life_context TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sim_action_events (
  id SERIAL PRIMARY KEY,
  from_handle TEXT,
  action_type TEXT NOT NULL,
  main_output TEXT NOT NULL,
  to_handle TEXT,
  story_context TEXT,
  extra_data TEXT,
  top_level_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sim_smol_tweets (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  handle TEXT NOT NULL,
  content TEXT NOT NULL,
  link TEXT,
  link_title TEXT,
  link_preview_img_url TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sim_updates_life_context (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  handle TEXT NOT NULL,
  previous_life_context TEXT NOT NULL,
  new_life_context TEXT NOT NULL,
  summary_of_the_changes TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sim_updates_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  handle TEXT NOT NULL,
  previous_skills TEXT NOT NULL,
  new_skills TEXT NOT NULL,
  summary_of_the_changes TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sim_updates_life_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  handle TEXT NOT NULL,
  previous_life_goals TEXT NOT NULL,
  new_life_goals TEXT NOT NULL,
  summary_of_the_changes TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sim_saved_tweets (
  id TEXT PRIMARY KEY,
  handle TEXT NOT NULL,
  content TEXT NOT NULL,
  posted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sim_wallets (
  handle TEXT PRIMARY KEY,
  address TEXT NOT NULL,
  private_key TEXT NOT NULL,
  permit_signature TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

*/

import { Pool, PoolClient, types } from "pg";

import { postErrorToDiscord, postToDiscord } from "./discord";
import { cleanHandle, goodTwitterImage } from "./strings";
import {
  FetchedTwitterUser,
  FetchedTweet,
  SavedTweet,
  RawUser,
  ActionEvent,
  SmolTweet,
  LifeGoalsChange,
  SkillsChange,
  LifeContextChange,
} from "./types";
import { PAGE_SIZE } from "./constants";

export interface ImageEmbedding {
  original_name: string;
  description: string;
  url: string;
  embedding: number[];
}

types.setTypeParser(1700, function (val: any) {
  return parseFloat(val);
});

types.setTypeParser(20, function (val: any) {
  return parseInt(val, 10);
});

let pool: Pool | null = null;

const getPool = (): Pool => {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL || "",
      ssl: {
        rejectUnauthorized: false,
      },
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    pool.on("error", (err: Error) => {
      pool = null;
    });
  }
  return pool;
};

export const executeQuery = async <T = any>(
  query: string,
  params: Array<any> = []
): Promise<T> => {
  const pool = getPool();
  const client: PoolClient = await pool.connect();

  try {
    const res = await client.query(query, params);
    return res as T;
  } catch (error: any) {
    console.error("🔴🔴🔴🔴 Error executing query", error.stack);
    throw error;
  } finally {
    client.release();
  }
};

process.on("SIGTERM", async () => {
  if (pool) {
    await pool.end();
    pool = null;
  }
});

export const saveNewUser = async (profile: RawUser): Promise<boolean> => {
  try {
    const handle = cleanHandle(profile.handle);

    const res = await executeQuery(
      `INSERT INTO sim_users (handle, display_name, profile_picture, twitter_id, cover_picture, bio, life_goals, skills, life_context) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        handle,
        profile.display_name,
        goodTwitterImage(profile.profile_picture),
        profile.twitter_id,
        profile.cover_picture,
        profile.bio,
        profile.life_goals,
        JSON.stringify(profile.skills),
        JSON.stringify(profile.life_context),
      ]
    );
    await postToDiscord(`🐣 New Clone! https://x.com/${handle}`);
    return res.rows;
  } catch (error) {
    console.error("🔴 Error in saveNewMJUser:", error);
    await postErrorToDiscord(
      "🔴 Error in saveNewMJUser: " + JSON.stringify(profile)
    );
    return false;
  }
};

export const findUserByHandle = async (
  handle: string
): Promise<RawUser | null> => {
  try {
    handle = cleanHandle(handle);
    const res = await executeQuery(
      `SELECT * FROM sim_users WHERE handle = $1`,
      [handle]
    );
    return res.rows[0];
  } catch (error) {
    console.error("🔴 Error in findUserByHandle:", error);
    return null;
  }
};

export const getUsers = async (): Promise<any> => {
  const res = await executeQuery(`SELECT * FROM sim_users`);
  return res.rows;
};

export const readIRLTweets = async ({ handle }: { handle: string }) => {
  const res = await executeQuery(
    `SELECT * FROM sim_saved_tweets WHERE handle = $1`,
    [handle]
  );
  return res.rows as SavedTweet[];
};

export const saveIRLTweets = async ({
  handle,
  tweets,
}: {
  handle: string;
  tweets: FetchedTweet[];
}) => {
  // Si no hay publicaciones, salimos temprano
  if (!tweets || tweets.length === 0) return;

  // Columnas a insertar (ajusta si tu tabla es distinta)
  const columns = [
    "id",
    "handle",
    "content",
    "posted_at", // Asegúrate de tener esta columna en la tabla
  ];

  // Generaremos placeholders dinámicos. Ej:
  // ($1, $2, $3, $4, $5, $6), ($7, $8, $9, ...)
  const values: any[] = [];
  const placeholders: string[] = [];
  let paramIndex = 1;

  for (const tweet of tweets) {
    placeholders.push(
      `($${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++})`
    );
    values.push(
      tweet.id, // id
      handle, // handle
      tweet.full_text, // content
      tweet.tweet_created_at // posted_at
    );
  }

  // Armamos la sentencia final
  const query = `
    INSERT INTO sim_saved_tweets (${columns.join(", ")})
    VALUES ${placeholders.join(", ")}
    ON CONFLICT (id) DO NOTHING
  `;

  // Ejecutamos la consulta
  try {
    await executeQuery(query, values);
  } catch (error) {
    // Manejo de error adicional si lo deseas
    console.error("Error inserting clone publications", error);
  }
};

export const getWalletByHandle = async (handle: string) => {
  handle = cleanHandle(handle);
  const res = await executeQuery(
    `SELECT * FROM sim_wallets WHERE handle = $1`,
    [handle]
  );
  return res.rows[0];
};

export const createWallet = async ({
  handle,
  address,
  privateKey,
  permitSignature,
}: {
  handle: string;
  address: string;
  privateKey: string;
  permitSignature: string;
}) => {
  await executeQuery(
    `INSERT INTO sim_wallets (handle, address, private_key, permit_signature) VALUES ($1, $2, $3, $4)`,
    [handle, address, privateKey, permitSignature]
  );
};

export const getRecentClones = async () => {
  const res = await executeQuery(
    `SELECT * FROM sim_users ORDER BY created_at DESC LIMIT 30`
  );
  return res.rows;
};

export const deleteUserByHandle = async (handle: string) => {
  try {
    handle = cleanHandle(handle);

    // primero borramos los smol tweets de este clon:
    await executeQuery(`DELETE FROM sim_smol_tweets WHERE handle = $1`, [
      handle,
    ]);

    // luego borramos los action events del "from" este clon:
    await executeQuery(`DELETE FROM sim_action_events WHERE from_handle = $1`, [
      handle,
    ]);

    // luego borramos los action events del "to" este clon:
    await executeQuery(`DELETE FROM sim_action_events WHERE to_handle = $1`, [
      handle,
    ]);

    // borramos los updates de skills de este clon:
    await executeQuery(`DELETE FROM sim_updates_skills WHERE handle = $1`, [
      handle,
    ]);

    // borramos los updates de life goals de este clon:
    await executeQuery(`DELETE FROM sim_updates_life_goals WHERE handle = $1`, [
      handle,
    ]);

    await executeQuery(`DELETE FROM sim_users WHERE handle = $1`, [handle]);

    // lo ultimo: borramos sus wallets tambien, ala, que le den por culo a todo ya!!
    await executeQuery(`DELETE FROM sim_wallets WHERE handle = $1`, [handle]);

    await postToDiscord(`💀 User deleted: \`${handle}\``);
  } catch (error) {
    console.error("🔴 Error in deleteUserByHandle:", error);
    await postErrorToDiscord("🔴 Error in deleteUserByHandle: " + handle);
  }
};

export const getRandomClone = async () => {
  const res = await executeQuery(
    `SELECT * FROM sim_users ORDER BY RANDOM() LIMIT 1`
    // `SELECT * FROM sim_users where handle = 'danitome24'`
    // `SELECT * FROM sim_users where handle = 'mad4yu'`
    // `SELECT * FROM sim_users where handle = 'javitoshi'`
  );
  return res.rows[0];
};

export const saveNewActionEvent = async (actionEvent: ActionEvent) => {
  const res = await executeQuery(
    `INSERT INTO sim_action_events (from_handle, action_type, main_output, story_context, to_handle, extra_data, top_level_type) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      actionEvent.from_handle,
      actionEvent.action_type,
      actionEvent.main_output,
      actionEvent.story_context,
      actionEvent.to_handle,
      actionEvent.extra_data,
      actionEvent.top_level_type,
    ]
  );
  return res.rows[0];
};

export const getRecentActionEvents = async () => {
  const res = await executeQuery(
    `SELECT * FROM sim_action_events ORDER BY created_at DESC LIMIT 10`
  );
  return res.rows;
};

export const getActionEventsByHandle = async (handle: string) => {
  const res = await executeQuery(
    `SELECT * FROM sim_action_events WHERE from_handle = $1`,
    [handle]
  );
  return res.rows;
};

export const saveNewSmolTweet = async (smolTweet: SmolTweet) => {
  try {
    const res = await executeQuery(
      `INSERT INTO sim_smol_tweets (handle, content, link, image_url, link_preview_img_url, link_title) VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        smolTweet.handle,
        smolTweet.content,
        smolTweet.link,
        smolTweet.image_url,
        smolTweet.link_preview_img_url,
        smolTweet.link_title,
      ]
    );

    await postToDiscord(
      `✨ new tweet by **${smolTweet.handle}**:
\`${smolTweet.content}\``
    );

    return res.rows[0];
  } catch (error) {
    console.error(
      "🔴 Error in saveNewSmolTweet():",
      JSON.stringify(smolTweet, null, 2)
    );
    await postErrorToDiscord("🔴 Error in saveNewSmolTweet()");
    return null;
  }
};

export const getRecentSmolTweets = async () => {
  const res = await executeQuery(
    `SELECT * FROM sim_smol_tweets ORDER BY created_at DESC LIMIT 10`
  );
  return res.rows;
};

export const getRecentSmolTweetsWithUserInfo = async () => {
  const res = await executeQuery(
    `SELECT 
      t.*,
      u.display_name,
      u.profile_picture
    FROM sim_smol_tweets t
    LEFT JOIN sim_users u ON t.handle = u.handle
    ORDER BY t.created_at DESC 
    LIMIT 50`
  );
  return res.rows;
};

export const saveNewLifeGoalsChange = async (
  lifeGoalsChange: LifeGoalsChange
) => {
  const res = await executeQuery(
    `INSERT INTO sim_updates_life_goals (handle, previous_life_goals, new_life_goals, summary_of_the_changes) VALUES ($1, $2, $3, $4)`,
    [
      lifeGoalsChange.handle,
      lifeGoalsChange.previous_life_goals,
      lifeGoalsChange.new_life_goals,
      lifeGoalsChange.summary_of_the_changes,
    ]
  );
  return res.rows[0];
};

export const updateUserLifeGoals = async (
  handle: string,
  newLifeGoals: string
) => {
  const res = await executeQuery(
    `UPDATE sim_users SET life_goals = $1 WHERE handle = $2`,
    [newLifeGoals, handle]
  );
  return res.rows[0];
};

export const saveNewSkillsChange = async (skillsChange: SkillsChange) => {
  const res = await executeQuery(
    `INSERT INTO sim_updates_skills (handle, previous_skills, new_skills, summary_of_the_changes) VALUES ($1, $2, $3, $4)`,
    [
      skillsChange.handle,
      skillsChange.previous_skills,
      skillsChange.new_skills,
      skillsChange.summary_of_the_changes,
    ]
  );
  return res.rows[0];
};

export const updateUserSkills = async (handle: string, newSkills: string) => {
  const res = await executeQuery(
    `UPDATE sim_users SET skills = $1 WHERE handle = $2`,
    [newSkills, handle]
  );
  return res.rows[0];
};

export const saveNewLifeContextChange = async (
  lifeContextChange: LifeContextChange
) => {
  const res = await executeQuery(
    `INSERT INTO sim_updates_life_context (handle, previous_life_context, new_life_context, summary_of_the_changes) VALUES ($1, $2, $3, $4)`,
    [
      lifeContextChange.handle,
      lifeContextChange.previous_life_context,
      lifeContextChange.new_life_context,
      lifeContextChange.summary_of_the_changes,
    ]
  );
  return res.rows[0];
};

export const updateUserLifeContext = async (
  handle: string,
  newLifeContext: string
) => {
  const res = await executeQuery(
    `UPDATE sim_users SET life_context = $1 WHERE handle = $2`,
    [newLifeContext, handle]
  );
  return res.rows[0];
};

export const getSmolTweetsByHandle = async (handle: string) => {
  const res = await executeQuery(
    `SELECT 
      t.*,
      u.display_name,
      u.profile_picture
    FROM sim_smol_tweets t
    LEFT JOIN sim_users u ON t.handle = u.handle
    WHERE t.handle = $1 
    ORDER BY t.created_at DESC 
    LIMIT $2`,
    [handle, PAGE_SIZE]
  );
  return res.rows;
};

export const findArticleByHandleAndSlug = async (
  handle: string,
  slug: string
) => {
  try {
    const res = await executeQuery(
      `SELECT * FROM sim_action_events WHERE from_handle = $1 AND extra_data LIKE '%${slug}%'`,
      [handle]
    );
    return res.rows[0];
  } catch (error) {
    console.error("🔴 Error in findArticleByHandleAndSlug:", error);
    await postErrorToDiscord(
      "🔴 Error in findArticleByHandleAndSlug: " + handle + " " + slug
    );
    return null;
  }
};
