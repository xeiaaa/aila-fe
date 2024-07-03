import { Flex, Avatar, Button, Input, Typography, message, Spin } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSubscription } from "../context/SubscriptionContext";

import authAxios from "../api/authAxios";
import { API_URL } from "../config";
import UploadModal from "./UploadModal";
import sparkleIcon from "../assets/sparkle-icon.svg";
import { useEffect, useState } from "react";
import VoiceModal from "./VoicesModal";

function VideoDrawer({ note, setNote }) {
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const {
    subscribedPlan,
    subscribedPlans,
    cancelledPlans,
    credits,
    videoConversion,
    audioConversion,
    updateSubscriptionPlan,
  } = useSubscription();

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

  const deleteVideoMutation = useMutation({
    mutationFn: (id) => {
      return authAxios.delete(`${API_URL}/talkingPhotos/${id}`);
    },
    onSuccess: () => {
      message.success("Successfully deleted!");
      queryClient.invalidateQueries({ queryKey: ["avatars"] });
    },
  });

  const handleGenerateVideo = async () => {
    try {
      if (
        !selectedAvatar.photoId ||
        !note.summary ||
        !selectedVoice.voice_id ||
        !note._id
      ) {
        message.error("Please select a photo and voice");
        return;
      }

      setIsLoading(true);

      const payload = {
        photoId: selectedAvatar.photoId,
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
            photoId: selectedAvatar.photoId,
            voiceId: selectedVoice.voice_id,
          },
          type: "video",
        };

        const media = await authAxios.post(`${API_URL}/medias/`, mediaPayload);
        await generateVideoMutation.mutateAsync(mediaPayload);
        console.info({ media });

        // Minus credits if generation is successful
        const newCredits = credits ? credits - 5 : 0;
        updateSubscriptionPlan(
          subscribedPlan,
          subscribedPlans,
          cancelledPlans,
          newCredits,
          videoConversion,
          audioConversion
        );
      } else {
        // Extend the subscription date by one day if generation failed
        const currentSubscription = subscribedPlans.find(
          (sp) => sp.plan === subscribedPlan
        );

        if (currentSubscription) {
          const currentExpirationDate = new Date(
            currentSubscription.expiration
          );
          currentExpirationDate.setDate(currentExpirationDate.getDate() + 1);

          const updatedSubscribedPlans = subscribedPlans.map((sp) =>
            sp.plan === subscribedPlan
              ? {
                  ...sp,
                  expiration: currentExpirationDate.toLocaleDateString(),
                }
              : sp
          );

          // Update state and context
          updateSubscriptionPlan(
            subscribedPlan,
            updatedSubscribedPlans,
            cancelledPlans,
            credits,
            videoConversion,
            audioConversion
          );
        }
      }
    } catch (error) {
      console.error("Error generating video:", error);
      message.error("Failed to generate video. Please try again later.");
    } finally {
      setIsLoading(false);
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
          {/*
          <Flex vertical>
            <div className="flex gap-3 justify-center items-center">
              <Typography.Paragraph className="!mb-2 !text-base sm:!text-sm">
                Pitch
              </Typography.Paragraph>
              <Slider
                defaultValue={1}
                max={16}
                tooltip={{ formatter: null }}
                className="flex-1"
              />
            </div>

            <div className="flex gap-3 justify-center items-center">
              <Typography.Paragraph className="!mb-2 !text-base sm:!text-sm">
                Speed
              </Typography.Paragraph>
              <Slider
                defaultValue={1}
                max={16}
                tooltip={{ formatter: null }}
                className="flex-1"
              />
            </div>
          </Flex> */}
        </Flex>
        <div>
          <Typography.Paragraph className="!mb-2 !text-base sm:!text-sm">
            Avatar
          </Typography.Paragraph>
          <div
            className="h-14 opacity-90 flex items-center gap-2 rounded-lg px-2"
            style={{ border: "1px solid #40A9E8" }}
          >
            <div className="flex gap-3">
              {avatars && Array.isArray(avatars.results)
                ? avatars.results.map((avatar) => (
                    <div key={avatar._id} className="relative">
                      <Avatar
                        size={40}
                        src={avatar.url}
                        onClick={() => setSelectedAvatar(avatar)}
                        className={`${
                          selectedAvatar && selectedAvatar._id === avatar._id
                            ? "border-primary border-6"
                            : ""
                        }`}
                      ></Avatar>
                      <CloseCircleOutlined
                        className="text-md text-red-500 hover:text-red-700 bg-white rounded-full top-0 right-0 absolute cursor-pointer"
                        onClick={() =>
                          deleteVideoMutation.mutateAsync(avatar._id)
                        }
                      />
                    </div>
                  ))
                : null}
            </div>
            <UploadModal />
          </div>
        </div>

        {/* <div>
          <Typography.Paragraph className="!mb-2 !text-base sm:!text-sm">
            Background Color
          </Typography.Paragraph>
          <Button
            type="Text"
            size="large"
            block
            className="!h-11 !max-h-[3rem] opacity-90 border-primary flex items-center justify-between"
          >
            Select a color <ColorPicker defaultValue="#1677ff" />
          </Button>
        </div> */}
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
              Generate Video
            </Typography.Text>
          </div>
        )}
      </Button>
    </div>
  );
}

export default VideoDrawer;
