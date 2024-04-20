import { TAddonPackage } from "../models/subscription-model";

export const mock_subscription: TAddonPackage[] = [
  {
    "add_id": "1",
    "name": "Limit_text",
    "display_name": "More Text",
    "text_limit": 2000,
    "storage": 100,
    "price": 1000,
    "price_discount": 500,
    "point": 10000,
    "NoAds": false,
    "day": 31,
    "us_price": 31.99,
    "us_price_discount": 15.99
  },
  {
    "add_id": "3",
    "name": "NoAds",
    "display_name": "No Ads",
    "text_limit": 1000,
    "storage": 100,
    "price": 79,
    "NoAds": true,
    "price_discount": 39,
    "price_discount_card": 49,
    "day": 31,
    "us_price": 2.49,
    "us_price_discount": 1.19
  },
]

