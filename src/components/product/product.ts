import product1 from "@public/assets/product/feature1.png";
import product2 from "@public/assets/product/feature2.png";
import product3 from "@public/assets/product/feature3.png";
import product4 from "@public/assets/product/feature4.png";
import { StaticImageData } from "next/image";

type FeaturedProducts = {
  id: number;
  itemName: string;
  image: StaticImageData;
  price: number;
};

const featuredProducts: FeaturedProducts[] = [
  {
    id: 1,
    itemName: "Designer shades",
    image: product1,
    price: 40,
  },
  {
    id: 2,
    itemName: "Designer shades",
    image: product2,
    price: 40,
  },
  {
    id: 3,
    itemName: "Designer shades",
    image: product3,
    price: 40,
  },
  {
    id: 4,
    itemName: "Designer shades",
    image: product4,
    price: 40,
  },
  {
    id: 5,
    itemName: "Designer shades",
    image: product1,
    price: 40,
  },
  {
    id: 6,
    itemName: "Designer shades",
    image: product2,
    price: 40,
  },
  {
    id: 7,
    itemName: "Designer shades",
    image: product3,
    price: 40,
  },
  {
    id: 8,
    itemName: "Designer shades",
    image: product4,
    price: 40,
  },
];

export default featuredProducts;
export type { FeaturedProducts };
