export interface AudioPlanObj {
  title: string;
  image: string;
  size: string;
  lists: string[];
  price: AudioPlanPrice;
}

interface AudioPlanPrice {
  monthly: string;
  yearly: string
}
