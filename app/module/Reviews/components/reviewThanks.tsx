import { DialogHeader, DialogTitle } from '~/components/ui/dialog';
const ReviewThanks = () => {
  return (
    <div className=' overflow-hidden block'>
      <DialogHeader className="block overflow-hidden flex items-center justify-center ">
        <DialogTitle className='font-bold text-[26px] text-center'>Дякуємо!</DialogTitle>
      </DialogHeader>
      <div className="size-grid">
        <h5 className='text-center text-[19px] px-0 py-5;'>Ваші відгуки допомагають ставати нам кращими</h5>
      </div>
    </div>
  )
}
export default ReviewThanks;