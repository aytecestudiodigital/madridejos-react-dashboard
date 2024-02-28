import { useTranslation } from "react-i18next";

interface ContentTypeProps {
  type: string;
}

export default function ContentTypeComponent({ type }: ContentTypeProps) {
  const content_type = type.toLowerCase();
  const { t } = useTranslation();
  return (
    <>
      {content_type === "articles" ? (
        <div>{t("ARTICLES")}</div>
      ) : content_type === "events" ? (
        <div>{t("EVENTS")}</div>
      ) : (
        <div>{t("PLACES")}</div>
      )}
    </>
  );
}
