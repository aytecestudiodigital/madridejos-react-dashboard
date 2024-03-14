/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTranslation } from "react-i18next";
import { UploadArea } from "../../../../../components/UploadFilesArea/UploadFilesArea";
import CustomModalImage from "../CustomModalImageComponent";
import { useFormContext } from "react-hook-form";
import { useEffect, useState } from "react";

interface ImagesTabProps {
  images: any[];
  deleteImageOnChange: Function;
}

export default function ImagesTab({
  images,
  deleteImageOnChange,
}: ImagesTabProps) {
  const { t } = useTranslation();

  const { setValue } = useFormContext();
  const [deletedImages, setDeletedImages] = useState<any[]>([]);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [imagesTab, setImagesTab] = useState<any[]>(images)

  useEffect(() => {
    setImagesTab(images)
  }, [images])

  const onUploadImages = (imagesUrl: any[]) => {
    const newArray = [...imagesTab];
    imagesUrl.forEach((image) => {
      const newImage = {
        url: image.url,
        title: image.name,
        state: true,
        order: imagesTab.length,
      };
      newArray.push(newImage);
    });
    setImagesTab(newArray)
    setValue('images', newArray)
  };

  const deleteImage = (index: number) => {
    const newImages = [...images];
    setDeletedImages([...deletedImages, images[index]]);
    deleteImageOnChange([...deletedImages, images[index]]);
    newImages.splice(index, 1);
    setValue("images", newImages);
  };

  const handleDragStart = (e: React.DragEvent, itemOrder: string) => {
    setDraggedItem(itemOrder);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropItemOrder: string) => {
    e.preventDefault();
    const newOrder = [...imagesTab!];

    const draggedIndex = imagesTab!.findIndex(
      (item) => item.order === draggedItem,
    );
    const dropIndex = imagesTab!.findIndex(
      (item) => item.order === dropItemOrder,
    );

    if (draggedIndex !== -1 && dropIndex !== -1 && draggedIndex !== dropIndex) {
      // Reorganizar el array localmente
      const [draggedItem] = newOrder.splice(draggedIndex, 1);
      newOrder.splice(dropIndex, 0, draggedItem);

      // Implementar lógica para actualizar el orden en la base de datos
      setImagesTab(newOrder);
      setValue('images', newOrder)
    }

    setDraggedItem(null);
  };

  const changeImageName = (index: number, title: string) => {
    imagesTab[index].title = title;
  };

  const changeImageState = (index: number, state: boolean) => {
    imagesTab[index].state = state;
  };

  return (
    <div className="p-4 mb-5">
      <div className="mt-4">
        <div className="grid grid-cols-12 gap-4 divide-x">
          <div className="col-span-7 overflow-auto">
            <>
              {
                imagesTab.length > 0 && imagesTab.map((image, index) => (
                  <div
                    key={image.order}
                    draggable
                    onDragStart={(e) => handleDragStart(e, image.order!)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, image.order!)}>
                    <CustomModalImage
                      state={image.state}
                      key={index}
                      type={"image"}
                      index={index}
                      url={image.url}
                      imageName={image.title}
                      onImageDelete={(index) => deleteImage(index)}
                      onChangeName={(index, title) =>
                        changeImageName(index, title)
                      }
                      onFileDelete={() => null}
                      onFileChangeName={() => null}
                      onStateChange={(index, state) =>
                        changeImageState(index, state)
                      }
                    />
                  </div>
                ))
              }
            </>
          </div>
          <div className="col-span-5 pl-4">
            <UploadArea
              onUpload={onUploadImages}
              height="320px"
              maxFiles={10}
              fileTypes={["image/*"]}
              location={"content/articles"}
            />
            <div className="p-4">
              <p className="text-sm">{t("CONTENT_IMAGE_STEP_1")}</p>
              <p className="text-sm">{t("CONTENT_IMAGE_STEP_2")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
