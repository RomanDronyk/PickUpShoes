import { Link } from "@remix-run/react";
import { Button } from "./button";
import { ArrowRight } from "lucide-react";

export default function EmptyCart({closeCart}:{closeCart:()=> void}) {
    return (
      <div className="flex flex-col gap-5 min-h-52 h-full items-center justify-center">
        <h3 className="font-semibold text-[26px]">Схоже твоя корзина порожня</h3>
        <Button onClick={()=>closeCart()} asChild className="bg-red font-medium hover:bg-darkRed text-xl">
          <Link  to="/collections/catalog">
            До каталогу <ArrowRight size={20} className="ml-2" />
          </Link>
        </Button>
      </div>
    );
  }