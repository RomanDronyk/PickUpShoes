import React, { FC } from "react";
import Option from "../ui/option";

interface IOptions {
  name: string,
  value: string,
}
interface IOptionList {
  options: IOptions[] | null;
  sku?: string,
}
const OptionList: FC<IOptionList> = ({  options, sku }) => {
  return (
    <React.Fragment>
      {options?.map(option => <Option key={option.name+option.value+"option"} name={option.name} value={option.value} />)}
      {sku&&<h4>Артикул: <span className="text-black/50">{sku}</span></h4>}
    </React.Fragment>
  )
}
export default OptionList;