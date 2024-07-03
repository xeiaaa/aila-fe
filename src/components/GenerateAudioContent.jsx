import { Input, Typography } from "antd";
const { TextArea } = Input;

function GenerateAudioContent({ note, setNote, audio }) {
  if (!note) return null;

  return (
    <>
      <div className="basis-5/12 bg-secondary flex justify-center items-center dark:bg-backgroundDark">
        {audio && (
          <>
            <audio controls autoPlay={false} className="w-10/12 sm:w-8/12">
              <source src={audio.url} type="audio/ogg" />
              <source src={audio.url} type="audio/mpeg" />
            </audio>
          </>
        )}
      </div>
      <div className="basis-8/12 flex justify-center items-end">
        <div className="w-full h-full bg-white xl:w-[53.125rem] 2xl:w-[65rem] p-5 mb-5 mx-5 sm:mx-0 rounded-lg dark:bg-secondaryDark dark:border dark:border-solid dark:border-borderDark">
          <Typography.Title
            level={5}
            type="secondary"
            className="dark:text-gray-400"
          >
            Summary
          </Typography.Title>
          <TextArea
            autoSize={{ minRows: 12, maxRows: 12 }}
            className="w-full flex-1 border-0 p-0 mt-2 dark:bg-secondaryDark dark:text-textDark"
            value={note.summary}
            onChange={(e) => {
              setNote((prevNote) => ({
                ...prevNote,
                summary: e.target.value,
              }));
            }}
          ></TextArea>
        </div>
      </div>
    </>
  );
}

export default GenerateAudioContent;
