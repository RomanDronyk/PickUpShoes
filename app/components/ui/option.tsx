import { FC } from "react";

interface ITranslateOptions {
  [key: string]: string;
}
interface IOptions {
  name: string,
  value: string,
}

const TranslateOptions: ITranslateOptions = {
  Color: "Колір",
  Колір: "Колір",
  Розмір: "Розмір",
  Size: "Розмір"
}

const Option: FC<IOptions> = ({ name, value }) => {
  return <h4>{TranslateOptions[name]}: <span className="text-black/50">{value}</span></h4>
}
export default Option;
