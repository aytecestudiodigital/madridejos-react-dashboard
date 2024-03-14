/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-useless-escape */
/* eslint-disable no-cond-assign */
import { Tabs } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineClipboard,
  HiOutlinePaperClip,
} from "react-icons/hi";
import {
  LuCalendar,
  LuImage,
  LuMapPin,
  LuUser2,
  LuVideo,
} from "react-icons/lu";
import { customThemeTab } from "../../../bookings/items/components/CustomThemeScrollableTabs";
import AttachmentsTab from "../components/tabs/AttachmentsTabComponent";
import ContactTab from "../components/tabs/ContactTabComponent";
import ContentTab from "../components/tabs/ContentTabComponent";
import DateTab from "../components/tabs/DateTabComponent";
import ImagesTab from "../components/tabs/ImagesTabComponent";
import MapTab from "../components/tabs/MapTabComponent";
import VideoTab from "../components/tabs/VideosTabComponent";
import { Content } from "../models/Content";

//TODO - cuando metamos entidades, los campos no iran fijos en el form, dependerá de los campos de la entidad

interface EditContentProps {
  item: Content | null;
  contactValues: any;
  onChangeContactValues: Function;
  videoData: any;
  dateInit: any;
  dateEnd: any;
  dateEventInit: any;
  dateEventEnd: any;
  onChangeDeletedImages: Function;
  onChangeDeletedFiles: Function;
  latLng: any;
  files: any;
  images: any;
}
export default function EditContentPageTabs({
  item,
  contactValues,
  onChangeContactValues,
  videoData,
  dateInit,
  dateEnd,
  dateEventInit,
  dateEventEnd,
  onChangeDeletedImages,
  onChangeDeletedFiles,
  latLng,
  files,
  images,
}: EditContentProps) {
  const { t } = useTranslation();

  const [tabIndex, setTabIndex] = useState<number>(0);
  const [isScrollbarVisible, setIsScrollbarVisible] = useState(false);
  const [category, setCategory] = useState<string>("");
  const [categoryTitle, setCategoryTitle] = useState("");
  const [tabsData, setTabsData] = useState<{ title: string; icon: any }[]>([]);
  const [tabsComponent, setTabsComponents] = useState<any[]>([]);

  const [formData, setFormData] = useState<Content | null>(item ? item : null);

  useEffect(() => {
    setFormData(item);
  }, [item]);

  const initialTabs = [
    { title: "CONTENT_TYPE", icon: HiOutlineClipboard },
    { title: "DATES", icon: LuCalendar },
    { title: "IMAGES", icon: LuImage },
    { title: "VIDEOS", icon: LuVideo },
    { title: "ATTACHMENTS", icon: HiOutlinePaperClip },
    { title: "MAP", icon: LuMapPin },
  ];

  useEffect(() => {
    if (categoryTitle !== "Turismo") {
      setTabsData(initialTabs);
      setTabsComponents(contents);
    } else {
      initialTabs.push({ title: "CONTACT", icon: LuUser2 });
      setTabsData(initialTabs);
      contents.push(
        <ContactTab
          values={contactValues}
          onContact={(values) => onChangeContactValues(values)}
        />,
      );
      setTabsComponents(contents);
    }
  }, [categoryTitle]);

  const handleScroll = () => {
    // Verificar si la barra de desplazamiento es necesaria
    const container = document.getElementById("Tabs-scroll");
    if (container) {
      const isOverflowing = container.scrollWidth > container.clientWidth;
      setIsScrollbarVisible(isOverflowing);
    }
  };

  useEffect(() => {
    // Verificar inicialmente y al cambiar el tamaño de la pantalla
    handleScroll();
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const scrollLeft = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault(); // Evitar la recarga de la página
    document.getElementById("Tabs-scroll")!.scrollBy(-100, 0);
  };

  const scrollRight = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault(); // Evitar la recarga de la página
    document.getElementById("Tabs-scroll")!.scrollBy(100, 0);
  };

  const handleTabChange = (tab: number) => {
    // Guardar el estado del formulario al cambiar de tab (si estás en el primer tab)
    if (tab === 0) {
      tabsComponent != undefined && setFormData(tabsComponent[0].props.item);
    }

    setTabIndex(tab);
  };

  const handleFormChange = (data: any) => {
    setFormData(data);
  };

  const contents = [
    <ContentTab
      item={item ? item : null}
      categoryTitleOnChange={(categoryTitle: string) => {
        setCategoryTitle(categoryTitle);
      }}
      onCategoryChange={(categoryID: string) => setCategory(categoryID)}
    />,

    <DateTab
      defaultDateEnd={dateEnd}
      defaultDateInit={dateInit}
      categoryId={category}
      defaultDateEventInit={dateEventInit}
      defaultDateEventEnd={dateEventEnd}
    />,
    <ImagesTab
      images={images}
      deleteImageOnChange={(deletedImages: any[]) =>
        onChangeDeletedImages(deletedImages)
      }
    />,
    <VideoTab video={videoData} />,
    <AttachmentsTab
      files={files}
      deleteFileOnChange={(deletedFiles: any[]) =>
        onChangeDeletedFiles(deletedFiles)
      }
    />,
    <MapTab position={latLng} />,
  ];

  return (
    <>
      <div className="mb-5">
        <div
          className={`${isScrollbarVisible ? "flex place-items-start" : ""}`}
        >
          {isScrollbarVisible && (
            <button
              onClick={scrollLeft}
              className="icon-button my-4 py-1 px-1 m-1 text-lg border border-gray-200 rounded-md"
            >
              <HiOutlineChevronLeft />
            </button>
          )}
          <div className="overflow-x-auto no-scrollbar" id={"Tabs-scroll"}>
            <Tabs.Group
              theme={customThemeTab}
              style={"fullWidth"}
              onActiveTabChange={(tab) => handleTabChange(tab)}
            >
              {tabsData &&
                tabsData.map((tab, index) => (
                  <Tabs.Item
                    key={index}
                    title={
                      <span style={{ whiteSpace: "nowrap" }}>
                        {t(tab.title)}
                      </span>
                    }
                    icon={tab.icon}
                  ></Tabs.Item>
                ))}
            </Tabs.Group>
          </div>
          {isScrollbarVisible && (
            <button
              onClick={scrollRight}
              className="icon-button my-4 py-1 px-1 m-1 text-lg border border-gray-200 rounded-md"
            >
              <HiOutlineChevronRight />
            </button>
          )}
        </div>
        {tabsComponent != undefined &&
          tabsComponent.map((content, index) => (
            <div
              key={index}
              style={{ display: index === tabIndex ? "block" : "none" }}
            >
              {/* <FormProvider {...methods} > */}
              <>
                {React.cloneElement(content, {
                  item: formData,
                  onFormChange: handleFormChange,
                })}
              </>
            </div>
          ))}
      </div>
    </>
  );
}
