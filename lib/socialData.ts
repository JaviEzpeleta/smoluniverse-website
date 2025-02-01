import axios, { AxiosResponse } from "axios";
import {
  MAX_PUBLICATIONS_WHEN_PARSING_PROFILE,
  MAX_TWEET_API_CALL_COUNT,
} from "./constants";
import { FetchedTweet } from "./types";
import { cleanHandle } from "./strings";
import { postErrorToDiscord } from "./discord";

export const getTwitterUserInfo = async (twitterHandle: string) => {
  twitterHandle = twitterHandle.replace("@", "").trim().toLowerCase();

  const url = `https://api.socialdata.tools/twitter/user/${twitterHandle}`;
  const headers = {
    Authorization: `Bearer ${process.env.SOCIAL_DATA_TOOLS_API_KEY}`,
    Accept: "application/json",
  };
  const response = await axios.get(url, { headers });
  return response.data;
};

interface ApiResponse {
  tweets: FetchedTweet[];
  next_cursor?: string;
}

export const getTweetsFromUser = async (
  userHandle: string
): Promise<{ allTweets: FetchedTweet[] } | null> => {
  try {
    userHandle = cleanHandle(userHandle);

    const baseUrl = `https://api.socialdata.tools/twitter/search?query=from%3A${userHandle}${encodeURIComponent(
      " " + "-filter:replies"
    )}&type=Latest`;

    const headers = {
      Authorization: `Bearer ${process.env.SOCIAL_DATA_TOOLS_API_KEY}`,
      Accept: "application/json",
    };

    let allTweets = [] as FetchedTweet[];
    let cursor: string | null = null;
    let callCount = 0;

    do {
      const url: string = cursor
        ? `${baseUrl}&cursor=${encodeURIComponent(cursor)}`
        : baseUrl;

      try {
        const response: AxiosResponse<ApiResponse> = await axios.get(url, {
          headers,
        });
        callCount++;

        console.log(
          " 🐽 reading tweets from user",
          userHandle,
          "call#" + callCount
        );

        if (response.data.tweets && Array.isArray(response.data.tweets)) {
          allTweets = allTweets.concat(response.data.tweets);
        }
        cursor = response.data.next_cursor || null;
      } catch (error) {
        console.error(`Error in call ${callCount}:`, error);
        break;
      }
    } while (
      (cursor !== null || callCount < MAX_TWEET_API_CALL_COUNT) &&
      allTweets.length < MAX_PUBLICATIONS_WHEN_PARSING_PROFILE
    );

    const allTweetsRaw = allTweets.map((tweet) => {
      const objectFiltered = {
        tweet_created_at: tweet.tweet_created_at,
        id: tweet.id,
        full_text: tweet.full_text,
        favorite_count: tweet.favorite_count,
        user_handle: userHandle,
        reply_count: tweet.reply_count,
        retweet_count: tweet.retweet_count,
        quote_count: tweet.quote_count,
        id_str: tweet.id_str,
        user: {
          screen_name: tweet.user.screen_name,
          profile_image_url_https: tweet.user.profile_image_url_https.replace(
            "_normal",
            "_400x400"
          ),
        },
      } as FetchedTweet;
      return objectFiltered;
    });

    return { allTweets: allTweetsRaw };
  } catch (error) {
    await postErrorToDiscord("🔴 Error in getTweetsFromUser: " + userHandle);
    console.error("🔴 Error in getTweetsFromUser:", error);
    return null;
  }
};

export const searchTweets = async (topic: string) => {
  const url = `https://api.socialdata.tools/twitter/search?query=${topic}`;
  const headers = {
    Authorization: `Bearer ${process.env.SOCIAL_DATA_TOOLS_API_KEY}`,
    Accept: "application/json",
  };
  const response = await axios.get(url, { headers });
  return response.data;
};
