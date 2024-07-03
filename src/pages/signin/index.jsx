import { useMutation } from "@tanstack/react-query";
import { Button, Flex, Form, Input, message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

import useLocalStorage from "../../hooks/useLocalStorage";
import { TOKEN_KEY } from "../../constants";
import { API_URL } from "../../config";

import Robot from "../../assets/aila-icon.png";

// import Onboarding from "../../components/OnBoarding";

const Signin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  // const [onBoardingModalIsOpen, setOnBoardingModalIsOpen] = useState(true);

  const [_, setTokens] = useLocalStorage(TOKEN_KEY, null);

  const mutation = useMutation({
    mutationFn: (payload) => {
      return axios.post(`${API_URL}/auth/login`, payload);
    },
  });

  const onFinish = async (values) => {
    try {
      setIsLoading(true);
      await mutation.mutateAsync(values);
    } catch (error) {
      message.error("An error occurred during login!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (mutation.isSuccess && mutation.data.data.tokens) {
      setTokens(mutation.data.data.tokens);
      navigate("/notes", { replace: true });
      message.success("Login successfully!");
    }
  }, [mutation.isSuccess, mutation.data, setTokens, navigate]);

  // const handleCancel = () => {
  //   setOnBoardingModalIsOpen(false);
  // };
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

        {/* header */}
        <Flex vertical>
          <Flex gap={5} className="justify-center mb-5">
            <p className="text-lg font-bold border-0 border-b-4 border-solid border-b-[#4DB571]">
              Login
            </p>
            <p className="text-lg font-bold">to AILA</p>
          </Flex>
          {/* sub header */}
          <p className="text-sm text-center">
            Welcome back! Sign in using your email to <br /> continue to us.
          </p>
        </Flex>
        {/* form */}
        <Flex vertical>
          {/* flex-1  */}
          <Form
            name="basic"
            initialValues={{
              email: "",
              password: "",
            }}
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
            className="custom-forms flex flex-col gap-20 sm:px-0 px-10"
          >
            {/* h-full */}
            <Flex className="relative" vertical>
              <Form.Item
                label="Your Email"
                name="email"
                className="custom-label"
                rules={[
                  {
                    required: true,
                    message: "Please input your email!",
                    type: "email",
                  },
                ]}
              >
                <Input className="border-t-0 border-l-0 border-r-0 rounded-none focus:shadow-none custom-input bg-transparent focus:!border-[#4DB571] hover:border-[#4DB571]" />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                className="custom-label relative"
                rules={[
                  {
                    required: true,
                    message: "Please input your password!",
                  },
                ]}
              >
                <Input.Password className="border-t-0 border-l-0 border-r-0 rounded-none custom-input bg-transparent focus:!border-[#4DB571] hover:border-[#4DB571]" />
              </Form.Item>
              <div className="text-center pt-5 absolute bottom-0 right-0 invisible">
                <a href="#" className=" text-[#4DB571]">
                  Forgot Password?
                </a>
              </div>
            </Flex>

            <Form.Item className="mb-0">
              <div className="space-y-4">
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={isLoading}
                  loading={isLoading}
                  className="bg-[#4DB571] hover:bg-white custom-button h-12 rounded-xl"
                  block
                >
                  Login
                </Button>
                <p className="text-center">
                  Don&apos;t have an account yet?&nbsp;
                  <Link to="/register" className="text-[#4DB571]">
                    Sign up
                  </Link>
                </p>
              </div>
            </Form.Item>
          </Form>
          {/* <Flex style={{ justifyContent: "space-between" }}>
            <Link to="/register">Register</Link>
          </Flex> */}
        </Flex>
      </div>
      <div className="area">
        <ul className="circles">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
    </Flex>
  );
};

export default Signin;
