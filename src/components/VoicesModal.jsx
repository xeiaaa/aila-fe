import { useState } from 'react';
import { Button, Modal, Flex, Card, Typography, Radio } from 'antd';

const VoiceModal = ({ voices, selectedVoice, setSelectedVoice }) => {
  const [open, setOpen] = useState(false);

  const onChange = (e) => {
    setSelectedVoice(e.target.value);
  };

  const showModal = () => setOpen(true);
  const handleCancel = () => setOpen(false)

  if (!Array.isArray(voices)) return null

  return (
    <>
      <Button
        type="Text"
        size="large"
        block
        className="h-12 opacity-90 border-solid border-primary dark:text-textDark dark:border-primaryDark"
        onClick={showModal}
      >
        {selectedVoice && selectedVoice.display_name || ""}
      </Button>
      <Modal
        title="Select Voice"
        open={open}
        onCancel={handleCancel}
        cancelButtonProps={{
          disabled: true,
          hidden: true
        }}
        footer={null}
        width='80%'
      >
        <Flex gap="25px">
          <div style={{ flex: 1 }}>
            <Radio.Group onChange={onChange} value={selectedVoice}>
              <div className='flex flex-wrap gap-5 items-center justify-center h-[400px] overflow-y-auto' >
                {voices.map((voice) => (
                  <Card
                    className='w-[280px] flex flex-col'
                    key={voice.voice_id}
                  >
                    <Flex style={{ justifyContent: 'space-between', alignItems: "center", marginBottom: '10px' }}>
                      <Radio value={voice}>
                        <Typography.Text>{voice.display_name}</Typography.Text>
                      </Radio>
                      <img src={voice.flag} alt={voice.display_name} style={{ borderRadius: '50%' }} height={25} width={25} />
                    </Flex>
                    <audio controls style={{ width: '100%' }}>
                      <source src={voice.preview.movio} type="audio/mp3" />
                      Your browser does not support the audio element.
                    </audio>
                  </Card>
                ))}
              </div>
            </Radio.Group>
          </div>
        </Flex>
      </Modal >
    </>
  );
};
export default VoiceModal;