/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-useless-escape */
/* eslint-disable no-cond-assign */
import { Button, Label, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { LuYoutube } from "react-icons/lu";

interface VideoTabProps {
  video: any;
}

export default function VideoTab({ video }: VideoTabProps) {
  const [iframeSource, setIframeSource] = useState("");
  const [youtubeVideo, setYoutubeVideo] = useState("");
  const [videoData, setVideoData] = useState();

  const { t } = useTranslation();

  const { setValue } = useFormContext();

  useEffect(() => {
    if (video) {
      setIframeSource(video.player);
    }
  }, [video]);

  useEffect(() => {
    setValue("videos", videoData);
  }, [videoData]);

  function getYoutubeVideoId(url: string) {
    let _match: any;
    if ((_match = url.match(/(\?|&)v=([^&#]+)/))) {
      return _match.pop();
    } else if ((_match = url.match(/(\.be\/)+([^\/]+)/))) {
      return _match.pop();
    } else if ((_match = url.match(/(\embed\/)+([^\/]+)/))) {
      return _match.pop().replace("?rel=0", "");
    }
  }

  async function getVideoById(id: string) {
    const newId = getYoutubeVideoId(id);
    const requestOptions = {
      method: "GET",
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_YOUTUBE_ENDPOINT}?key=${
          import.meta.env.VITE_YOUTUBE_KEY
        }&part=snippet&id=${newId}`,
        requestOptions,
      );
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const body = await response.json();
      const videoPlayerResponse = await getVideoPlayer(newId);
      body.player = videoPlayerResponse.items[0].player.embedHtml;
      setIframeSource(body.player);
      setVideoData(body);
      return body;
    } catch (err) {
      console.log(err);
    }
  }

  async function getVideoPlayer(id: string) {
    const requestOptions = {
      method: "GET",
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_YOUTUBE_ENDPOINT}?key=${
          import.meta.env.VITE_YOUTUBE_KEY
        }&part=player&id=${id}`,
        requestOptions,
      );
      const body = await response.json();
      return body;
    } catch (err) {}
  }
  return (
    <div className="p-4">
      <div className="justify-between">
        <div>
          <Label className="text-xl font-bold leading-5" htmlFor="content">
            {t("VIDEO")}
          </Label>
          <div className="mt-5 text-sm text-gray-500">
            <p>{t("VIDEO_DESCRIPTION")}</p>
          </div>
          <div className="mt-6 sm:mt-5">
            <div className="flex flex-grow justify-between w-full sm:border-t sm:border-gray-200 sm:pt-5">
              <div className="w-full mr-6">
                <TextInput
                  icon={LuYoutube}
                  id="username3"
                  addon={t("YOUTUBE")}
                  onChange={(e) => setYoutubeVideo(e.currentTarget.value)}
                />
              </div>
              <div className="col-span-1">
                <Button
                  onClick={() => getVideoById(youtubeVideo)}
                  className="border w-36 rounded-md text-sm leading-5 font-medium"
                >
                  {t("SEARCH_VIDEO")}
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-5">
            {iframeSource == "" ? (
              <p>{t("NO_CONTENT_ADDED")}</p>
            ) : (
              <div dangerouslySetInnerHTML={{ __html: iframeSource }}></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
