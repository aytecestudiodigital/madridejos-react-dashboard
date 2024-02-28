import Uppy from "@uppy/core";
import { Dashboard } from "@uppy/react";
import Tus from "@uppy/tus";
import { useEffect, useState } from "react";

import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import { supabase } from "../../server/supabase";
import { es_ES } from "./locales/es_ES";

interface UploadAreaProps {
  onUpload: (urls: string[]) => void;
  width?: string;
  height?: string;
  maxFiles?: number;
  fileTypes: string[];
  location: string;
}

export const UploadArea = ({
  onUpload,
  width = "100%",
  height = "100px",
  maxFiles = 10,
  fileTypes,
  location,
}: UploadAreaProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [uppy, setUppy] = useState<Uppy>(() => new Uppy());
  useEffect(() => {
    setLoading(true);
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUppy(() =>
          new Uppy({
            locale: es_ES,
            restrictions: {
              maxNumberOfFiles: maxFiles,
              allowedFileTypes: fileTypes,
            },
          }).use(Tus, {
            endpoint: `https://${
              import.meta.env.VITE_SUPABASE_PROJECT_ID
            }.supabase.co/storage/v1/upload/resumable`,
            headers: {
              authorization: `Bearer ${session.access_token}`,
              pikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
            },
            uploadDataDuringCreation: true,
            chunkSize: 6 * 1024 * 1024,
            allowedMetaFields: [
              "bucketName",
              "objectName",
              "contentType",
              "cacheControl",
            ],
          }),
        );
      } else {
        setUppy(
          () =>
            new Uppy({
              locale: es_ES,
              restrictions: {
                maxNumberOfFiles: maxFiles,
                allowedFileTypes: fileTypes,
              },
            }),
        );

        setLoading(false);
      }
    });
  }, []);

  uppy.on("file-added", async (file) => {
    file.name = `${Math.floor(Math.random() * 100000)}_${file.name}`;

    const supabaseMetadata = {
      bucketName: "organizations",
      objectName: `043ec7c2-572a-4199-9aa1-af6af822e76a/${location}/${file.name}`,
      contentType: file.type,
    };

    file.meta = {
      ...file.meta,
      ...supabaseMetadata,
    };
  });
  uppy.on("complete", (result) => {
    const url: any[] = [];
    result.successful.forEach((file) => {
      const path: string = file.meta["objectName"] as string;
      const { data } = supabase.storage
        .from("organizations")
        .getPublicUrl(path);
      url.push({ url: data.publicUrl, name: file.name });
    });
    onUpload(url);
  });

  return (
    loading && (
      <Dashboard className="" uppy={uppy} height={height} width={width} />
    )
  );
};
