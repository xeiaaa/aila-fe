import { Flex, Button, Input, Typography, message, Spin } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import authAxios from "../api/authAxios";
import { API_URL } from "../config";
import sparkleIcon from "../assets/sparkle-icon.svg";
import { useEffect, useState } from "react";
import VoiceModal from "./VoicesModal";

function AudioDrawer({ note, setNote }) {
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { data: avatars } = useQuery({
    queryKey: ["avatars"],
    queryFn: async () => {
      const { data } = await authAxios.get(`${API_URL}/talkingPhotos`);
      return data;
    },
    staleTime: Infinity,
  });

  const { data: voices } = useQuery({
    queryKey: ["voices"],
    queryFn: async () => {
      const { data } = await authAxios.get(`${API_URL}/avatars/voices`);
      return data;
    },
    staleTime: Infinity,
  });

  useEffect(() => {
    if (voices && Array.isArray(voices)) {
      setSelectedVoice(voices[0]);
    }
  }, [voices]);

  const handleInputChange = (e) => {
    setNote((prevNote) => ({ ...prevNote, [e.target.name]: e.target.value }));
  };
  const queryClient = useQueryClient();

  const generateVideoMutation = useMutation({
    mutationFn: (mediaPayload) => {
      return authAxios.post(`${API_URL}/medias/`, mediaPayload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", note._id] });
    },
  });

  const handleGenerateVideo = async () => {
    try {
      if (!note.summary && !selectedVoice.voice_id && !note._id) {
        message.error("Please select a voice");
        return;
      }

      setIsLoading(true);

      const payload = {
        photoId: avatars.results[0].photoId,
        summary: note.summary,
        voiceId: selectedVoice.voice_id,
      };
      const { data } = await authAxios.post(
        `${API_URL}/heygens/generate-video`,
        payload
      );

      if (data && data.data && data.data.video_id) {
        const mediaPayload = {
          note: note._id,
          metaData: {
            videoId: data.data.video_id,
            photoId: avatars.results[0].photoId,
            voiceId: selectedVoice.voice_id,
          },
          type: "audio",
        };
        const media = await authAxios.post(`${API_URL}/medias/`, mediaPayload);
        await generateVideoMutation.mutateAsync(mediaPayload);
        console.info({ media });
      }
    } catch (error) {
      console.info({ error });
    }
  };

  if (!note) return null;

  return (
    <div className="px-3 sm:px-7 py-3 sm:py-6 flex flex-col justify-between flex-1 bg-white h-full">
      <div className="flex flex-col justify-between gap-6 sm:gap-7">
        <div>
          <Typography.Paragraph className="!mb-2 !text-base sm:!text-sm">
            Content Title
          </Typography.Paragraph>

          <Input
            className="!border-t-0 !border-l-0 !border-r-0 !bg-transparent !rounded-none"
            name="title"
            value={(note && note.title) || ""}
            onChange={handleInputChange}
          />
        </div>

        <Flex vertical gap={10}>
          <Flex vertical>
            <Typography.Paragraph className="!mb-2 !text-base sm:!text-sm">
              Voice Type
            </Typography.Paragraph>
            <VoiceModal
              voices={voices}
              selectedVoice={selectedVoice}
              setSelectedVoice={setSelectedVoice}
            />
          </Flex>
        </Flex>
      </div>

      <Button
        block
        type="primary"
        size="large"
        className="bg-primary hover:!bg-[#359EDD] h-12 sm:h-11"
        disabled={isLoading}
        onClick={handleGenerateVideo}
      >
        {isLoading ? (
          <Spin />
        ) : (
          <div className="flex items-center justify-center gap-2">
            <img className="h-5 aspect-square" src={sparkleIcon} />
            <Typography.Text className="text-white text-base sm:!text-base">
              Generate Audio
            </Typography.Text>
          </div>
        )}
      </Button>
    </div>
  );
}

export default AudioDrawer;
