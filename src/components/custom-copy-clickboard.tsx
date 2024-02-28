import { Tooltip } from "flowbite-react";
import { useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { useTranslation } from "react-i18next";
import { HiOutlineClipboardCopy } from "react-icons/hi";

interface CustomCopyToClipboardProps {
  text: string;
  onCopy: () => void;
}

export default function CustomCopyToClipboard(
  props: CustomCopyToClipboardProps,
) {
  const [isCopied, setIsCopied] = useState(false);
  const { t } = useTranslation();

  const handleCopy = () => {
    props.onCopy();
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <CopyToClipboard text={props.text} onCopy={handleCopy}>
      <div style={{ display: "inline-block" }}>
        <Tooltip
          content={isCopied ? t("COPIED") : t("COPY_ID")}
          animation="duration-500"
          arrow={false}
        >
          <HiOutlineClipboardCopy
            className={`text-sm cursor-pointer ${
              isCopied ? "text-green-500" : ""
            }`}
          />
        </Tooltip>
      </div>
    </CopyToClipboard>
  );
}
