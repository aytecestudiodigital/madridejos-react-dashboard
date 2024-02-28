import { Breadcrumb, Button, Spinner } from "flowbite-react";
import { useTranslation } from "react-i18next";
import { HiHome, HiOutlineArrowLeft } from "react-icons/hi";

export interface BreadcrumbItem {
  title: string;
  path?: string;
}

interface HeaderItemPageProps {
  title: string;
  breadcrumb: BreadcrumbItem[];
  showBackButton: boolean;
  saving: boolean;
  saveButtonDisabled: boolean;
  showButtonSave: boolean;
  showButtonSaveAndClose: boolean;
  onBack?: () => void;
  onSave: (close: boolean) => void;
}

export function HeaderItemPageComponent(props: HeaderItemPageProps) {
  const { t } = useTranslation();

  return (
    <>
      <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
        <div className="mb-1 w-full">
          <div>
            <Breadcrumb className="mb-4 mt-2">
              <Breadcrumb.Item href="/">
                <div className="flex items-center gap-x-3">
                  <HiHome className="text-xl" />
                  <span className="dark:text-white">{t("HOME")}</span>
                </div>
              </Breadcrumb.Item>
              {props.breadcrumb.map((item, index) => (
                <Breadcrumb.Item key={index} href={item.path}>
                  {t(item.title.toUpperCase())}
                </Breadcrumb.Item>
              ))}
            </Breadcrumb>
            <div className="items-center flex">
              {props.showBackButton && (
                <Button
                  size="xs"
                  color="light"
                  className="mr-4"
                  onClick={props.onBack}
                >
                  <HiOutlineArrowLeft className="mr-2" />
                  {t("BACK")}
                </Button>
              )}
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                {t(props.title.toUpperCase())}
              </h1>

              <div className="flex flex-grow justify-end gap-x-4">
                {props.showButtonSave &&
                  (props.saving ? (
                    <Button disabled color="primary">
                      <Spinner
                        aria-label="loading"
                        size="sm"
                        className="mr-2"
                      />
                      {t("SAVING")}
                    </Button>
                  ) : (
                    <Button
                      disabled={props.saveButtonDisabled}
                      color="primary"
                      onClick={() => props.onSave(false)}
                    >
                      {t("SAVE")}
                    </Button>
                  ))}
                {props.showButtonSaveAndClose &&
                  (props.saving ? (
                    <Button disabled color="primary">
                      <Spinner
                        aria-label="loading"
                        size="sm"
                        className="mr-2"
                      />
                      {t("SAVING")}
                    </Button>
                  ) : (
                    <Button
                      disabled={props.saveButtonDisabled}
                      onClick={() => props.onSave(true)}
                    >
                      {t("SAVE_AND_CLOSE")}
                    </Button>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
