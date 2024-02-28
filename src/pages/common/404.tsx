import { Button } from "flowbite-react";
import { useTranslation } from "react-i18next";
import { HiChevronLeft } from "react-icons/hi";

export default function NotFoundPage() {
  const { t } = useTranslation();
  console.log("NotFoundPage");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-16">
      <img alt="" src="/images/illustrations/404.svg" className="lg:max-w-md" />
      <h1 className="mb-6 text-2xl font-bold dark:text-white md:text-5xl">
        {t("PAGE_404_TITLE")}
      </h1>
      <p className="mb-6 w-4/5 max-w-xl text-center text-lg text-gray-500 dark:text-gray-300">
        {t("PAGE_404_DESCRIPTION")}
      </p>
      <Button href="/">
        <div className="mr-1 flex items-center gap-x-2">
          <HiChevronLeft className="text-xl" /> {t("PAGE_404_GO_BACK")}
        </div>
      </Button>
    </div>
  );
}
