import { DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from 'react-dropzone'
import { Button } from '~/components/ui/button';
import { Radio, RadioItem } from '~/components/ui/radio';
import LoaderNew from '~/components/LoaderNew';

 const ReviewInputs = () => {
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const review_contents = ["Комфорт", "Якість", "Дизайн"];

  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    setFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
  }, []);

  const onRemoveFile = (fileToRemove: FileWithPath) => {
    setFiles(prevFiles => prevFiles.filter(file => file !== fileToRemove));
  };
  const actionData: any = useActionData<any>();
  const navigation = useNavigation();

  const imageMimeTypes = {
    "image/jpeg": [".jpg", ".jpeg"],
    "image/png": [".png"],
    "image/gif": [".gif"],
    "image/webp": [".webp"],
    "image/bmp": [".bmp"],
    "image/tiff": [".tiff"],
    "image/svg+xml": [".svg"],
    "image/heic": [".heic"] // Додав підтримку HEIC
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: imageMimeTypes,
    maxSize: 5 * 1024 * 1024, // Максимальний розмір 5MB
  });

  return (
    <Form method="post" className="block" encType="multipart/form-data">
      <DialogHeader className="block overflow-hidden flex items-center justify-start ">
        <DialogTitle className='font-bold text-[26px] text-left'>Написати відгук</DialogTitle>
      </DialogHeader>
      <div className="size-grid">
        <div className="w-full flex items-center justify-between mt-10">
          <div className="grid gap-[15px] w-full">
            {review_contents.map((name, index) => {
              return (
                <div key={name + index} className="flex justify-between gap-[25px] ">
                  <Button
                    className="bg-black text-white font-medium rounded-[30px] text-[15px] px-[15px] py-[7px] cursor-pointer"
                    type="button"
                    variant="outline"
                  >
                    {name}
                  </Button>
                  <Radio name={name} className="w-full flex overflow-hidden justify-between bg-gray-100 rounded-full" defaultValue="10">
                    {Array.from({ length: 5 }, (_, i) => (
                      <RadioItem key={i + 1} value={(i + 1).toString()}>
                        {i + 1}
                      </RadioItem>
                    ))}
                  </Radio>
                </div>
              );
            })}
          </div>
        </div>
        {actionData?.errors?.stars ? (
          <em className='text-red'>Ви не вибрали {
            actionData?.errors?.stars.map((error: string) => {
              return error + ". "
            })
          }
          </em>
        ) : null}
        <div className="grid gap-[8px]">
          <div className="mt-4">
            {files.length !== 0 && (
              <>
                <h4 className="text-[18px] font-medium mb-[8px]">Прикріплені файли:</h4>
                <div className="flex gap-4 flex-wrap">
                  {files.map((file, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`uploaded-image-${index}`}
                        className="w-[100px] h-[100px] object-cover rounded-[10px]"
                      />
                      <button
                        type="button"
                        onClick={() => onRemoveFile(file)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-[5px] text-xs"
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
          <div
            {...getRootProps()}
            className="dropzone w-full p-6 border-dashed border-2 border-gray-300 bg-gray-100 rounded-lg"
          >
            <input type="file" name='media_files' {...getInputProps()} />
            <p className="text-center text-gray-600">
              {isDragActive ? "Перетягніть файли сюди..." : "Перетягніть або виберіть файли для завантаження"}
            </p>
          </div>
        </div>
        <h3 className="text-[24px] font-medium mb-[10px] mt-[40px]">Залиш коментар</h3>
        <textarea name='content' placeholder='Коментар... ' className="w-full rounded-[25px] bg-[#f0f0f0] ring-offset-background p-[18px] min-h-[128px] placeholder:text-placeholder  disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none placeholder:opacity-50" />
        {actionData?.errors?.content ? (
          <em className='text-red'>{actionData?.errors?.content}</em>
        ) : null}
        <Button variant={"outline"} className='text-white text-[20px] w-full bg-[#01AB31] rounded-[30px] '>
          {navigation.state == 'idle' ? <>
            Опублікувати відгук
            <svg className='ml-[15px]' width="23" height="24" viewBox="0 0 23 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 12C0 14.2745 0.674463 16.4979 1.9381 18.3891C3.20174 20.2802 4.99779 21.7542 7.09914 22.6246C9.20049 23.495 11.5128 23.7228 13.7435 23.279C15.9743 22.8353 18.0234 21.74 19.6317 20.1317C21.24 18.5234 22.3353 16.4743 22.779 14.2435C23.2228 12.0128 22.995 9.70049 22.1246 7.59914C21.2542 5.49779 19.7802 3.70174 17.8891 2.4381C15.9979 1.17446 13.7745 0.5 11.5 0.5C8.45001 0.5 5.52494 1.7116 3.36827 3.86827C1.2116 6.02494 0 8.95001 0 12ZM4.92857 11.1786H14.9089L10.3254 6.57282L11.5 5.42857L18.0714 12L11.5 18.5714L10.3254 17.3992L14.9089 12.8214H4.92857V11.1786Z"
                fill="currentColor"
              />
            </svg>
          </> : <div className="h-[16px]"><LoaderNew /></div>}
        </Button>
      </div>
    </Form>
  );
};
export default ReviewInputs;