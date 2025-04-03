import { Button } from '../ui/button';
import { X } from 'lucide-react';
import { CartForm } from '@shopify/hydrogen';
import { useRevalidator } from '@remix-run/react';
import { useState } from 'react';
import Loader from '../Loader';

export function CartLineRemoveButton({
  lineIds,
  disabled,
}: {
  lineIds: string[];
  disabled: boolean;
}) {
  const [isRemoving, setIsRemoving] = useState(false);
  const revalidator = useRevalidator();
  const handleRemove = async () => {
    setIsRemoving(true)
    const formData = new FormData();
    formData.append('cartFormInput', JSON.stringify({
      action: CartForm.ACTIONS.LinesRemove,
      inputs: { lineIds }
    }));

    await fetch("/cart", {
      body: formData,
      method: "POST"
    });



    revalidator.revalidate();

  }

  return (

    <>{
      (disabled || isRemoving) ? <Loader isBlack={true}></Loader> : (
        <Button
          type="submit"
          disabled={disabled || isRemoving}
          onClick={handleRemove}
          className="self-center w-[25px] h-[25px] p-[6px] rounded-full"
        >
          <X size={16} />
        </Button>
      )
    }
    </>



  );
}
