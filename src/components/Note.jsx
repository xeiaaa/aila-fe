import {
  Button,
  Divider,
  Flex,
  Modal,
  message,
  Typography,
  Tooltip,
} from "antd";
import moment from "moment";
import YouTube from "react-youtube";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { CopyOutlined, EditOutlined, RedoOutlined } from "@ant-design/icons";
import generatePDF, { Margin, Resolution } from "react-to-pdf";

import authAxios from "../api/authAxios";
import { API_URL } from "../config";
import useNoteContext from "../context/useNoteContext";
import NotesCategory from "./NotesCategory";
import WarningArea from "./WarningArea";
import CreateNoteModal from "./CreateNoteModal";

const { Text } = Typography;

const options = {
  method: "open",
  resolution: Resolution.HIGH,
  page: {
    margin: Margin.MEDIUM,
    format: "letter",
    orientation: "portrait",
  },
  canvas: {
    mimeType: "image/png",
    qualityRatio: 1,
  },
  overrides: {
    pdf: {
      compress: true,
    },
    canvas: {
      useCORS: true,
    },
  },
};

const Note = () => {
  const queryClient = useQueryClient();
  const { setSelectedNote, selectedNote } = useNoteContext();

  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const targetRef = useRef();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleDownloadPdf = () => {
    setIsGeneratingPdf(true);
    generatePDF(targetRef, { ...options, filename: `${new Date()}.pdf` })
      .then(() => setIsGeneratingPdf(false))
      .catch((error) => {
        setIsGeneratingPdf(false);
        console.error("Error generating PDF:", error);
      });
  };

  const archivedMutation = useMutation({
    mutationFn: () => {
      if (!selectedNote._id) return;
      return authAxios.post(`${API_URL}/notes/${selectedNote._id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["archive-notes"] });
    },
  });

  const editMutation = useMutation({
    mutationFn: (title) => {
      if (!selectedNote._id) return;
      return authAxios.patch(`${API_URL}/notes/${selectedNote._id}`, { title });
    },
    onSuccess: ({ data }) => {
      setSelectedNote(data);
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const { data: response } = useQuery({
    queryKey: ["notes", selectedNote._id],
    queryFn: async () => {
      const { data } = await authAxios.get(
        `${API_URL}/notes/${selectedNote._id}`
      );
      return data;
    },
    staleTime: 0,
    refetchInterval: isComplete === false ? 2000 : false,
    enabled: isComplete === false,
  });

  useEffect(() => {
    if (response && response.status === "success") {
      setSelectedNote(response);
      setIsComplete(true);
    } else {
      setIsComplete(false);
      setIsLoading(false);
    }
  }, [response, setSelectedNote]);

  const handleArchiveNote = async () => {
    try {
      setIsLoading(true);
      await archivedMutation.mutateAsync();
      setSelectedNote(null);
      message.success("Note archived successfully!");
    } catch (err) {
      message.error("Failed to archive the note!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSummarize = useCallback(async () => {
    if (!selectedNote) {
      return;
    }
    try {
      setIsSummaryLoading(true);
      const response = await authAxios.get(
        `${API_URL}/notes/${selectedNote._id}/summarize`
      );
      setSelectedNote((prevNote) => ({
        ...prevNote,
        summary: response.data.response,
      }));
      message.success("The summary was generated successfully.");
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    } catch (error) {
      message.error(
        "It seems an error occurred while attempting to retrieve the summary"
      );
    } finally {
      setIsSummaryLoading(false);
    }
  }, [selectedNote, queryClient, setSelectedNote]);

  if (!selectedNote) {
    return null;
  }

  const copyTextToClipboard = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(selectedNote.summary);

        return Promise.resolve(true);
      }
    } catch (error) {
      console.error("Unable to copy script to clipboard:", error);
      return Promise.reject(false);
    }
  };

  const renderMedia = () => {
    switch (selectedNote.type) {
      case "pdf":
        return <iframe src={selectedNote.url} className="w-full h-96"></iframe>;
      case "url":
        return <iframe src={selectedNote.url} className="w-full h-96"></iframe>;

      case "video":
        return (
          <video width="100%" autoPlay={false} controls={true}>
            <source src={selectedNote.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );
      case "audio":
        return (
          <audio controls>
            <source src={selectedNote.url} type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
        );
      case "text":
        return null;
      case "youtube":
        const params = selectedNote.url.split("?")[1];
        const searchParams = new URLSearchParams(params);
        const videoId = searchParams.get("v");

        if (!videoId) {
          return null;
        }

        return (
          // <>
          //   <iframe
          //     width="560"
          //     height="315"
          //     src="https://www.youtube.com/embed/tgbNymZ7vqY?controls=0"
          //     title="YouTube video player"
          //     frameborder="0"
          //     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          //     allowfullscreen
          //   ></iframe>
          // </>

          <YouTube
            videoId={videoId}
            opts={{
              height: "390",
              width: "100%",
              playerVars: {
                // https://developers.google.com/youtube/player_parameters
                autoplay: 0,
              },
            }}
          />
        );
      case "default":
        return <pre>{JSON.stringify(selectedNote, null, 1)}</pre>;
    }
  };

  return (
    <Flex
      vertical
      className="max-w-full md:max-w-xl lg:max-w-2xl xl:max-w-5xl 2xl:max-w-4xl mx-auto"
    >
      <Flex
        className="w-full justify-center items-center flex-col sm:flex-row"
        gap={15}
      >
        <CreateNoteModal />
      </Flex>

      <Divider className="border-none m-3" />

      <Flex className="px-0 sm:px-0 justify-between">
        <Flex vertical>
          <Typography.Title
            editable={{
              icon: <EditOutlined className="text-primary dark:text-primaryDark" />,
              onChange: (e) => editMutation.mutateAsync(e),
              text: selectedNote.title,
            }}
            level={4}
            className="dark:text-textDark"
          >
            {selectedNote.title}
          </Typography.Title>
          <div className="flex flex-col">
            <Text type="secondary" className="dark:text-gray-400">
              Date Created: &nbsp;
              {moment(selectedNote.createdAt).format("MMM DD, YYYY")}
            </Text>
            <Text type="secondary" className="dark:text-gray-400">
              Last Update: &nbsp;
              {moment(selectedNote.updatedAt).format("MMM DD, YYYY")}
            </Text>
          </div>
        </Flex>
        <WarningArea id={selectedNote._id} onArchive={handleArchiveNote} />
      </Flex>

      <Divider className="border-none m-3" />

      <Flex vertical>
        {selectedNote.type !== "text" && (
          <>
            <Text strong style={{ marginBottom: "15px", color: "#8C8F92" }}>
              Media
            </Text>
          </>
        )}
        <div className="flex justify-center items-center">{renderMedia()}</div>
      </Flex>

      <Divider className="border-none m-3" />

      {!isComplete && response && <p>The note is still processing..</p>}
      {isSummaryLoading ? (
        <p>Summary is still processing..</p>
      ) : (
        selectedNote.summary && (
          <>
            <Flex className="border border-solid border-[#E0E0E0] bg-white shadow rounded-lg p-5 dark:bg-secondaryDark dark:border-borderDark">
              <div className="flex-1" ref={targetRef}>
                <Text type="secondary dark:text-gray-400">Summary</Text>
                <p className="w-full mt-2 leading-6 text-sm sm:text-base dark:text-textDark">{selectedNote.summary}</p>
              </div>
              <Flex vertical className="pl-2">
                <Tooltip title="Copy" color="#2db7f5">
                  <Button type="text" className="p-0">
                    <CopyOutlined
                      onClick={copyTextToClipboard}
                      className="text-gray-400 text-base"
                    />
                  </Button>
                </Tooltip>
                <Tooltip title="Regenerate" color="#2db7f5">
                  <Button
                    type="text"
                    onClick={() => {
                      if (selectedNote.summary) {
                        Modal.confirm({
                          title: "Summarize notes",
                          content:
                            "Are you certain of your intention to re-summarize your transcription? This action will result in the loss of the current summary.",
                          onOk: handleSummarize,
                          footer: (_, { OkBtn, CancelBtn }) => (
                            <>
                              <CancelBtn />
                              <OkBtn />
                            </>
                          ),
                        });
                        return;
                      }
                      handleSummarize();
                    }}
                    className="p-0"
                  >
                    <RedoOutlined className="text-gray-400 text-base" />
                  </Button>
                </Tooltip>
              </Flex>
            </Flex>
            <Divider />
            <Flex>
              <NotesCategory
                handleDownloadPdf={handleDownloadPdf}
                isGeneratingPdf={isGeneratingPdf}
              />
            </Flex>
          </>
        )
      )}
      <Divider className="border-none m-3" />
      {/* <Files /> */}
    </Flex>
  );
};

export default Note;
