import Image from "next/image";
import { ArrowRight } from "lucide-react";
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

export default function CollectionLargeCard({ item }: CardProps) {
  return (
    <div>
      <div className="relative  rounded-3xl overflow-hidden h-[73vh]  cursor-pointer">
        <Image
          src={`/assets/home/collections/${item.image}`}
          alt={item.title}
          //   width={300}
          //   height={300}
          fill
          className="object-cover   w-full h-full group-hover:scale-105 transition duration-500"
        />

        <TextOverCollectionCard item={item}/>
      </div>
    </div>
  );
}
