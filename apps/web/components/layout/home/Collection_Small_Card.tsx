import Image from "next/image";
// import { ArrowRight } from "lucide-react";
import CollectionText from "./Collection_Text";
import TextOverCollectionCard from "./Text_Over_Collection_Card";

interface CardProps {
  item: {
    title: string;
    subtitle: string;
    products: number;
    image: string;
    gradient: string;
  };
}

export default function CollectionSmallCard({ item }: CardProps) {
  return (
    <div>
      <div className="relative rounded-3xl overflow-hidden h-[35vh]  cursor-pointer">
        <Image
          src={`/assets/home/collections/${item.image}`}
          alt={item.title}
          fill
          className="object-cover group-hover:scale-105 transition duration-500"
        />

        <TextOverCollectionCard item={item}/>
      </div>
    </div>
  );
}