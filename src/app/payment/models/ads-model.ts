export type TResponseAds = {
  id: number;
  url: string;
  description: string;
  speaker?: string;
  type_ads?: string;
};

export type TPayloadUpdateAds = {
  play: number;
} & Pick<TResponseAds, 'id'>;

export type TAds = { current: number; max: number };
