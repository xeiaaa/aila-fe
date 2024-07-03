import { useMutation } from "@tanstack/react-query";
import { Flex, message } from "antd";
import axios from "axios";
import { useEffect, } from "react";
import { Link, } from "react-router-dom";

import { API_URL } from "../../config";
import Robot from "../../assets/aila-icon.png";

const VerifyEmailPage = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get('token');

  const mutation = useMutation({
    mutationFn: () => {
      if (token) {
        return axios.post(`${API_URL}/auth/verify-email?token=${token}`);
      } else {
        return Promise.resolve();
      }
    },
  });

  useEffect(() => {
    if (token) {
      mutation.mutateAsync()
    }
  }, [token])

  useEffect(() => {
    if (mutation.isSuccess && mutation.data) {
      message.success("Your email is verified!");
    }
  }, [mutation.isSuccess, mutation.data]);

  return (
    <Flex
      style={{
        width: "100%",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
      }}
      className="bg-gradient-to-r from-sky-700 to-sky-900"
    >
      <div className="absolute flex flex-col sm:rounded-xl bg-white py-0 sm:py-10 px-0 sm:px-7 md:m-0 w-screen h-screen sm:w-[24.375rem] sm:h-auto gap-10 z-10">
        <Flex className="block sm:hidden bg-gradient-to-r from-sky-700 to-sky-900 rounded-bl-[70px] rounded-br-[70px] h-60 text-center shadow-lg">
          <img src={Robot} alt="robot" width={200} />
        </Flex>
        {
          mutation.isSuccess ? <Flex vertical className="items-center gap-3">
            <p className="text-sm text-center">
              Your email has been verified. You can now log in!
            </p>
            <Link to="/signin" className="text-[#4DB571]">
              Sign In
            </Link>
          </Flex> : <p className="text-sm text-center">Verifying your email</p>
        }
      </div>
    </Flex>
  );
};

export default VerifyEmailPage;



