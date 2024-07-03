import { Input, Button, Modal, Drawer } from "antd";
import gcash from "../assets/GCash_logo.png";
import { useQuery } from "@tanstack/react-query";
import authAxios from "../api/authAxios";
import { API_URL } from "../config";
import gcashWhite from "../assets/gcash-white.png";
import scan from "../assets/option1.eccd65d.png";
import QRCode from "../assets/qrcode.png";
import gcashStep1 from "../assets/step1.png";
import gcashStep2 from "../assets/step2.png";
import gcashStep3 from "../assets/step3.png";
import gcashStep4 from "../assets/step4.png";
import { useWindowSize } from "../hooks/useWindowSize";
import { useState } from "react";

const Payment = ({
  isModalOpen,
  setIsModalOpen,
  handleOk,
  handleCancel,
  handleSubscription,
}) => {
  const { width: screenWidth } = useWindowSize();
  const isMobile = screenWidth < 640;
  const [open, setOpen] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await authAxios.get(`${API_URL}/auth/me`);
      return data;
    },
    staleTime: Infinity,
  });

  const handleConfirmSubscription = () => {
    handleSubscription();
  };

  const handlePayment = () => {
    if (isMobile) {
      openPayment();
    } else {
      const newWindow = window.open("", "_blank", "width=800,height=500");

      // content
      const Content = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Payment</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body>
    <div>
        <nav class="bg-[#1d59dc] w-full py-1.5 px-5">
          <img src="${gcashWhite}" alt="logo" width="62" height="15" />
        </nav>
        <div class="mt-8 pb-5 px-10 md:px-16 text-center">
          <p class="text-[#292b30] text-sm font-bold">Link GCash to pay in Canva</p>
          <p class="mt-3 text-xs text-[#808080]">
            To ensure the safety of your GCash Account, please continue with the
            linking process using your phone.
          </p>
        </div>
        <div class="relative flex flex-col justify-center items-center border border-black rounded-md p-5 mx-4 mb-24">
          <div class="flex justify-center items-center gap-7">
            <img src="${scan}" alt="scan" width="52.16" height="52.16" class="absolute left-5 top-5"/>
            <p class="mt-9 md:mt-0 p-4 text-[#007dff] text-center font-semibold text-sm">Scan the QR code with GCash App to continue</p>
          </div>
          <div>
            <img src="${QRCode}" alt="QRCode" width="130" height="130" />
          </div>
          <div class="flex flex-col justify-start items-start text-[#2a2b30] w-full mt-4">
        <p class="text-xs mb-1 font-semibold">Instructions</p>
        <div class="bg-[#2a2b30] h-[1px] w-52"></div>
        </div>
        <div class="flex flex-col md:flex-row pt-3">
         <div class="flex flex-col justify-between items-center p-2 w-full">
         <div class="rounded-full bg-[#007dff] text-[8px] text-white mb-3 py-1 px-1.5">
         <p>01</p>
         </div>
         <p class="text-[8px] text-[#58595b] text-center mb-3">
         Open your GCash app. In your dashboard, tap "<span class="font-semibold">Pay QR.</span>"
         </p>
       <img src="${gcashStep1}" alt="step 1" width="90.13" height="150"/>
         </div>
         <div class="flex flex-col justify-between items-center p-2 w-full">
         <div class="rounded-full bg-[#007dff] text-[8px] text-white mb-3 py-1 px-1.5">
         <p>02</p>
         </div>
         <p class="text-[8px] text-[#58595b] text-center mb-3">
         Tap "<span class="font-semibold">Scan QR Code.</span>"
         </p>
       <img src="${gcashStep2}" alt="step 2" width="90.13" height="150"/>
         </div>
         <div class="flex flex-col justify-between items-center p-2 w-full">
         <div class="rounded-full bg-[#007dff] text-[8px] text-white mb-3 py-1 px-1.5">
         <p>03</p>
         </div>
         <p class="text-[8px] text-[#58595b] text-center mb-3">
         Tap "<span class="font-semibold">Authorize</span>" to proceed with account linking.
         </p>
       <img src="${gcashStep3}" alt="step 3" width="90.13" height="150"/>
         </div>
         <div class="flex flex-col justify-between items-center p-2 w-full">
         <div class="rounded-full bg-[#007dff] text-[8px] text-white mb-3 py-1 px-1.5">
         <p>04</p>
         </div>
         <p class="text-[8px] text-[#58595b] text-center mb-3">
         Wait for the text message confirming your linked GCash account.
         </p>
       <img src="${gcashStep4}" alt="step 4" width="90.13" height="150"/>
         </div>
        </div>
        </div>
      </div>
    </body>
    </html>
    `;
      newWindow.document.write(Content);
      newWindow.document.close();
      handleCancel();

      newWindow.onbeforeunload = () => {
        handleConfirmSubscription();
      };
    }
  };

  const openPayment = () => {
    setOpen(true);
    setIsModalOpen(false);
  };

  const closePayment = () => {
    setOpen(false);
    handleConfirmSubscription();
  };

  return (
    <>
      <Modal
        title="Payment"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        width={400}
      >
        <div className="flex">
          {/* <div className="flex flex-col justify-center items-center py-5 text-center">
            <div>
              <div className="flex justify-center items-baseline my-3">
                <p className="text-base">
                  Subscribe to AILA {offerType} plan for <br />
                  <span className="text-3xl font-bold">₱{offerPrice}</span>
                </p>
              </div>
            </div>
          </div> */}
          <div className="flex flex-col gap-5 py-3 w-full">
            <div className="flex flex-col gap-2">
              <label className="font-medium">Contact Information</label>
              <Input
                prefix="Email:"
                disabled
                value={profile && profile.email}
              />
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-medium">Payment Method</p>
              <div
                className="flex items-center rounded-lg p-2 w-full"
                style={{ border: "1px solid #E5E9EA" }}
              >
                <img src={gcash} alt="GCash" className="w-20" />
              </div>

              <Button
                key="submit"
                className="text-white hover:!text-white bg-primary hover:!bg-primaryHover font-medium rounded-lg text-sm h-10 mt-3"
                block
                onClick={handlePayment}
              >
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </Modal>
      <Drawer
        placement="bottom"
        // closable={false}
        onClose={closePayment}
        open={open}
        key={"bottom"}
        height="100%"
      >
        <nav className="bg-[#1d59dc] w-full py-1.5 px-5">
          <img src={gcashWhite} alt="logo" width="62" height="15" />
        </nav>
        <div className="mt-8 pb-5 px-10 md:px-16 text-center">
          <p className="text-[#292b30] text-sm font-bold">
            Link GCash to pay in Canva
          </p>
          <p className="mt-3 text-xs text-[#808080]">
            To ensure the safety of your GCash Account, please continue with the
            linking process using your phone.
          </p>
        </div>
        <div className="relative flex flex-col justify-center items-center border border-black rounded-md p-5 mx-4 mb-24">
          <div className="flex justify-center items-center gap-7">
            <img
              src={scan}
              alt="scan"
              width="52.16"
              height="52.16"
              className="absolute left-5 top-5"
            />
            <p className="mt-9 md:mt-0 p-4 text-[#007dff] text-center font-semibold text-sm">
              Scan the QR code with GCash App to continue
            </p>
          </div>
          <div>
            <img src={QRCode} alt="QRCode" width="130" height="130" />
          </div>
          <div className="flex flex-col justify-start items-start text-[#2a2b30] w-full mt-4">
            <p className="text-xs mb-1 font-semibold">Instructions</p>
            <div className="bg-[#2a2b30] h-[1px] w-52"></div>
          </div>
          <div className="flex flex-col md:flex-row pt-3">
            <div className="flex flex-col justify-between items-center p-2 w-full">
              <div className="rounded-full bg-[#007dff] text-[8px] mb-3 py-1 px-1.5">
                <p className="text-white">01</p>
              </div>
              <p className="text-[8px] text-[#58595b] text-center mb-3">
                Open your GCash app. In your dashboard, tap &quot;
                <span className="font-semibold">Pay QR.</span>&quot;
              </p>
              <img src={gcashStep1} alt="step 1" className="w-full" />
            </div>
            <div className="flex flex-col justify-between items-center p-2 w-full">
              <div className="rounded-full bg-[#007dff] text-[8px] mb-3 py-1 px-1.5">
                <p className="text-white">02</p>
              </div>
              <p className="text-[8px] text-[#58595b] text-center mb-3">
                Tap &quot;<span className="font-semibold">Scan QR Code.</span>
                &quot;
              </p>
              <img src={gcashStep2} alt="step 2" className="w-full" />
            </div>
            <div className="flex flex-col justify-between items-center p-2 w-full">
              <div className="rounded-full bg-[#007dff] text-[8px] mb-3 py-1 px-1.5">
                <p className="text-white">03</p>
              </div>
              <p className="text-[8px] text-[#58595b] text-center mb-3">
                Tap &quot;<span className="font-semibold">Authorize</span>&quot;
                to proceed with account linking.
              </p>
              <img src={gcashStep3} alt="step 3" className="w-full" />
            </div>
            <div className="flex flex-col justify-between items-center p-2 w-full">
              <div className="rounded-full bg-[#007dff] text-[8px] mb-3 py-1 px-1.5">
                <p className="text-white">04</p>
              </div>
              <p className="text-[8px] text-[#58595b] text-center mb-3">
                Wait for the text message confirming your linked GCash account.
              </p>
              <img src={gcashStep4} alt="step 4" className="w-full" />
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
};
export default Payment;
