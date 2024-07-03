import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Button, Layout, Typography } from "antd";
import { LeftOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import authAxios from "../../api/authAxios";
import { API_URL } from "../../config";

import Sidebar from "../../components/Sidebar";
import VideoDrawer from "../../components/VideoDrawer";
import GenerateVideoContent from "../../components/GenerateVideoContent";
import AudioDrawer from "../../components/AudioDrawer";
import GenerateAudioContent from "../../components/GenerateAudioContent";

const Generate = () => {
  const navigate = useNavigate();
  const { noteId } = useParams();
  const [searchParams] = useSearchParams();
  const toggleTab = () => setShowTab((prev) => !prev);
  const { Header } = Layout;
  const genType = searchParams.get("type");

  const [currentNote, setCurrentNote] = useState(null);
  const [showTab, setShowTab] = useState(true);
  const [isComplete, setIsComplete] = useState(false);

  const { data: note } = useQuery({
    queryKey: ["notes", noteId],
    queryFn: async () => {
      const { data } = await authAxios.get(`${API_URL}/notes/${noteId}`);
      return data;
    },
    staleTime: 0,
  });

  const { data: videoStatus } = useQuery({
    queryKey: ["video-status", noteId],
    queryFn: async () => {
      if (!note.media && !note.media.video && !note.media.video.media) return;
      const { data } = await authAxios.get(
        `${API_URL}/heygens/${note.media.video.media}/status`
      );
      return data;
    },
    staleTime: 0,
    refetchInterval: isComplete === false ? 2000 : false,
    enabled: isComplete === false,
  });

  const { data: audioStatus } = useQuery({
    queryKey: ["audio-status", noteId],
    queryFn: async () => {
      if (!note.media && !note.media.audio && !note.media.audio.media) return;
      const { data } = await authAxios.get(
        `${API_URL}/heygens/${note.media.audio.media}/status`
      );
      return data;
    },
    staleTime: 0,
    refetchInterval: isComplete === false ? 2000 : false,
    enabled: isComplete === false,
  });

  const { data: video } = useQuery({
    queryKey: ["video", noteId],
    queryFn: async () => {
      if (!note.media && !note.media.video && !note.media.video.media) return;
      const { data } = await authAxios.get(
        `${API_URL}/medias/${note.media.video.media}`
      );
      return data;
    },
    staleTime: 0,
    enabled: isComplete,
  });

  const { data: audio } = useQuery({
    queryKey: ["audio", noteId],
    queryFn: async () => {
      if (!note.media && !note.media.audio && !note.media.audio.media) return;
      const { data } = await authAxios.get(
        `${API_URL}/medias/${note.media.audio.media}`
      );
      return data;
    },
    staleTime: 0,
    enabled: isComplete,
  });

  useEffect(() => {
    if (
      genType === "video" &&
      videoStatus &&
      videoStatus.status === "completed"
    ) {
      setIsComplete(true);
    } else if (
      genType === "audio" &&
      audioStatus &&
      audioStatus.status === "completed"
    ) {
      setIsComplete(true);
    } else {
      setIsComplete(false);
    }
  }, [audioStatus, genType, videoStatus]);

  useEffect(() => {
    if (note) {
      setCurrentNote(note);
    }
  }, [note]);

  if (!note) {
    return <>No notes</>;
  }

  return (
    <div className="flex flex-col h-screen">
      <Header className="flex items-center justify-between bg-tertiary py-4 px-7 sm:px-12 dark:bg-secondaryDark">
        <Button
          icon={<ArrowLeftOutlined className="dark:text-textDark" />}
          onClick={() => {
            navigate("/notes");
          }}
          className="border-none dark:!bg-tertiaryDark"
        ></Button>

        <Button
          type="primary"
          className="bg-primary hover:!bg-primaryHover dark:bg-primaryDark"
        >
          Submit
        </Button>
      </Header>

      <div className="flex flex-1 w-full bg-secondary dark:bg-backgroundDark">
        {(videoStatus && videoStatus.status === "processing") ||
        (audioStatus && audioStatus.status === "processing") ? (
          <div className="flex items-center justify-center flex-1">
            <Typography.Title>
              {genType === "audio"
                ? "Generating Audio..."
                : "Generating Video..."}
            </Typography.Title>
          </div>
        ) : (
          <>
            <Sidebar showTab={showTab} width={"320px"} toggleTab={toggleTab}>
              <div className="flex h-full">
                {genType === "audio" ? (
                  <AudioDrawer note={currentNote} setNote={setCurrentNote} />
                ) : (
                  <VideoDrawer note={currentNote} setNote={setCurrentNote} />
                )}
              </div>
            </Sidebar>
            <div className="flex-1 flex flex-col relative">
              {genType === "audio" ? (
                <GenerateAudioContent
                  note={currentNote}
                  setNote={setCurrentNote}
                  audio={audio}
                />
              ) : (
                <GenerateVideoContent
                  note={currentNote}
                  setNote={setCurrentNote}
                  video={video}
                />
              )}
              <div className="fixed left-0 top-1/2 z-40" onClick={toggleTab}>
                {showTab ? (
                  <div
                    className="hidden sm:block py-4 px-0.5 rounded-r-2xl cursor-pointer bg-white dark:bg-secondaryDark border-t-2 border-r-2 border-b-2 border-l-0 border-solid border-t-secondary border-r-secondary border-b-secondary dark:border-borderDark"
                    style={{
                      transform:
                        "translateX(328px) translateY(-50%) rotate(0deg) translateZ(0px)",
                    }}
                  >
                    <LeftOutlined className="text-[#C5C9CA] text-xs" />
                  </div>
                ) : (
                  <div
                    className="py-5 px-0.5 rounded-l-2xl cursor-pointer bg-white dark:bg-tertiaryDark"
                    style={{
                      transform:
                        "translateX(0px) translateY(-50%) rotate(180deg) translateZ(0px)",
                    }}
                  >
                    <LeftOutlined className="text-[#C5C9CA] text-xs" />
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Generate;
