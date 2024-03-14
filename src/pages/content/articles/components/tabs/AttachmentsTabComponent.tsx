/* eslint-disable @typescript-eslint/no-explicit-any */
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useTranslation } from "react-i18next";
import { UploadArea } from "../../../../../components/UploadFilesArea/UploadFilesArea";
import CustomModalImage from "../CustomModalImageComponent";
import { useFormContext } from "react-hook-form";
import { useState } from "react";

interface AttachmentsTabProps {
  files: any[];
  deleteFileOnChange: Function;
}

export default function AttachmentsTab({
  files,
  deleteFileOnChange,
}: AttachmentsTabProps) {
  const { t } = useTranslation();

  const { setValue } = useFormContext();
  const [deletedFiles, setDeletedFiles] = useState<any[]>([]);

  const handleSortFiles = (param: any) => {
    const { source, destination } = param;
    const _files = [...files];
    const dragItem = _files.splice(source.index, 1)[0];
    _files.splice(destination.index, 0, dragItem);
    setValue("documents", _files);
  };

  const onUploadFiles = (filesUrl: any[]) => {
    const newArray = [...files];
    filesUrl.forEach((file) => {
      const newFile = {
        url: file.url,
        title: file.name,
        state: true,
      };
      newArray.push(newFile);
    });
    setValue("documents", newArray);
  };

  const deleteFile = (index: number) => {
    const newFiles = [...files];
    setDeletedFiles([...deletedFiles, files[index]]);
    deleteFileOnChange([...deletedFiles, files[index]]);
    newFiles.splice(index, 1);
    setValue("documents", newFiles);
  };

  const changeFileName = (index: number, title: string) => {
    files[index].title = title;
  };

  const changeFileState = (index: number, state: boolean) => {
    files[index].state = state;
  };

  return (
    <div className="p-4 mb-5">
      <div className="mt-4">
        <div className="grid grid-cols-12 gap-4 divide-x">
          <div className="col-span-7 h-96 overflow-auto">
            <>
              <DragDropContext onDragEnd={handleSortFiles}>
                <Droppable droppableId="images">
                  {(provided: any) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {files.length > 0 ? (
                        files.map((file, index) => (
                          <Draggable
                            key={index}
                            draggableId={`image-${index}`}
                            index={index}
                          >
                            {(provided: any) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <CustomModalImage
                                  key={index}
                                  type={"file"}
                                  state={file.state}
                                  index={index}
                                  url={file.url}
                                  imageName={file.title}
                                  onImageDelete={() => null}
                                  onChangeName={() => null}
                                  onFileDelete={(index) => deleteFile(index)}
                                  onFileChangeName={(index, fileName) =>
                                    changeFileName(index, fileName)
                                  }
                                  onStateChange={(index, state) =>
                                    changeFileState(index, state)
                                  }
                                />
                              </div>
                            )}
                          </Draggable>
                        ))
                      ) : (
                        <p className="text-center mt-20">
                          {t("FILE_NOT_FOUND")}
                        </p>
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </>
          </div>
          <div className="col-span-5 pl-4">
            <UploadArea
              onUpload={onUploadFiles}
              height="320px"
              fileTypes={["text/*", "application/*"]}
              location={"content/articles"}
            />
            <div className="p-4">
              <p className="text-sm">{t("CONTENT_FILE_STEP_1")}</p>
              <p className="text-sm">{t("CONTENT_FILE_STEP_2")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
