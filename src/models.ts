export type DbWebhook = {
  id: string;
  name: string;
  url: string;
  created_at: Date;
  updated_at: Date;
};

export type DbAppUpdate = {
  id: number;
  bundle_id: string;
  version: string;
  release_date: number;
  created_at: Date;
  updated_at: Date;
};

export type AppUpdate = {
  ad: boolean;
  background_url: string;
  bundle_id: string;
  category: string;
  description: string;
  developer: string;
  developer_url: string;
  id: string;
  manifest_url: string;
  name: string;
  paid: false;
  product_id: string;
  release_date: number;
  screenshots: string[];
  size: number;
  summary: string;
  theme: string;
  thumbnail_url: string;
  type: string;
  version: string;
};

export type DiscordMessage = {
  embeds: {
    title: string;
    description: string;
    timestamp: string;
    author: {
      name: string;
    };
    thumbnail: {
      url: string;
    };
    fields: {
      name: string;
      value: string;
      inline: boolean;
    }[];
  }[];
};
