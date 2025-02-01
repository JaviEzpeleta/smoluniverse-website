export type FetchedTwitterUser = {
  id: number;
  id_str: string;
  name: string;
  screen_name: string;
  location: string;
  url: string | null;
  description: string;
  protected: boolean;
  verified: boolean;
  followers_count: number;
  friends_count: number;
  listed_count: number;
  favourites_count: number;
  statuses_count: number;
  created_at: string;
  profile_banner_url: string;
  profile_image_url_https: string;
  can_dm: boolean;
};

export type FetchedTweet = {
  id: string;
  user_handle: string;
  text: string;
  full_text: string;
  tweet_created_at: string;
  favorite_count: number;
  reply_count: number;
  retweet_count: number;
  quote_count: number;
  id_str: string;
  user: {
    screen_name: string;
    profile_image_url_https: string;
  };
  user__screen_name: string;
  user__profile_image_url_https: string;
  sentiment?: string;
  emotional_tone?: string;
  optimism_score?: number;
  toxicity_level?: number;
  subjectivity?: number;
  topic_categorization?: string;
  language_complexity?: number;
  engagement_potential?: number;
  humor_or_sarcasm?: string;
  polarity_intensity?: number;
};

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};
