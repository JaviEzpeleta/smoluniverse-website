/*
* 👀 Table Definitions:

CREATE TABLE sim_users (
  handle TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  profile_picture TEXT,
  cover_picture TEXT,
  twitter_id TEXT,
  bio TEXT,
  last_time_tweets_parsed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sim_saved_tweets (
  id TEXT PRIMARY KEY,
  handle TEXT NOT NULL,
  content TEXT NOT NULL,
  posted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

*/

import { Pool, PoolClient, types } from "pg";

import { postErrorToDiscord, postToDiscord } from "./discord";
import { cleanHandle, goodTwitterImage } from "./strings";
import { FetchedTwitterUser, FetchedTweet } from "./types";

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

export const saveNewUser = async (
  profile: FetchedTwitterUser
): Promise<boolean> => {
  try {
    const handle = cleanHandle(profile.screen_name);

    const res = await executeQuery(
      `INSERT INTO mj_users (id, social_network, address, handle, display_name, profile_picture, cover_picture, bio, followers) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        profile.id_str,
        "twitter",
        "",
        handle,
        profile.name,
        goodTwitterImage(profile.profile_image_url_https),
        profile.profile_banner_url,
        profile.description,
        profile.followers_count,
      ]
    );
    await postToDiscord("🐣 New Clone User: " + handle);
    return res.rows;
  } catch (error) {
    console.error("🔴 Error in saveNewMJUser:", error);
    await postErrorToDiscord(
      "🔴 Error in saveNewMJUser: " + JSON.stringify(profile)
    );
    return false;
  }
};

export const findUserByHandle = async (handle: string): Promise<any> => {
  handle = cleanHandle(handle);
  const res = await executeQuery(`SELECT * FROM sim_users WHERE handle = $1`, [
    handle,
  ]);
  return res.rows[0];
};

export const getUsers = async (): Promise<any> => {
  const res = await executeQuery(`SELECT * FROM sim_users`);
  return res.rows;
};

export const getIRLTweets = async ({ handle }: { handle: string }) => {
  const res = await executeQuery(
    `SELECT * FROM sim_saved_tweets WHERE handle = $1`,
    [handle]
  );
  return res.rows;
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

  console.log("Tweet i'm going to save: ", tweets[0]);

  // return false;

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
