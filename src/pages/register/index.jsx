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

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [_, setTokens] = useLocalStorage(TOKEN_KEY, null);

  const mutation = useMutation({
    mutationFn: (payload) => {
      return axios.post(`${API_URL}/auth/register`, payload);
    },
  });

  const onFinish = async (values) => {
    try {
      setIsLoading(true);
      await mutation.mutateAsync(values);
    } catch (error) {
      message.error("Registering account failed!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (mutation.isSuccess && mutation.data.data.tokens) {
      setTokens(mutation.data.data.tokens);
      navigate("/notes", { replace: true });
      message.success("Register account successfully!");
    }
  }, [mutation.isSuccess, mutation.data, setTokens, navigate]);

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

        <Flex vertical>
          <Flex gap={5} className="justify-center mb-5">
            <p className="text-lg font-bold">Sign up with</p>
            <p className="text-lg font-bold border-0 border-b-4 border-solid border-b-[#4DB571]">
              Email
            </p>
          </Flex>
          <p className="text-sm text-center">
            Please enter you’re name, email & password <br /> to create an
            account.
          </p>
        </Flex>
        <Flex vertical>
          <Form
            name="basic"
            initialValues={{
              email: "",
              password: "",
              name: "",
            }}
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
            className="custom-forms flex flex-col gap-8 sm:px-0 px-10"
          >
            <Flex className="relative" vertical>
              <Form.Item
                label="Your name"
                name="name"
                className="custom-label"
                rules={[
                  {
                    required: true,
                    message: "Please input your name!",
                  },
                ]}
              >
                <Input className="border-t-0 border-l-0 border-r-0 rounded-none focus:shadow-none custom-input bg-transparent focus:border-[#4DB571] hover:border-[#4DB571]" />
              </Form.Item>

              <Form.Item
                label="Your email"
                name="email"
                className="custom-label relative"
                rules={[
                  {
                    required: true,
                    message: "Please input your email!",
                    type: "email",
                  },
                ]}
              >
                <Input className="border-t-0 border-l-0 border-r-0 rounded-none focus:shadow-none custom-input bg-transparent focus:border-[#4DB571] hover:border-[#4DB571]" />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                className="custom-label"
                rules={[
                  {
                    required: true,
                    message: "Please input your password!",
                  },
                ]}
              >
                <Input.Password className="border-t-0 border-l-0 border-r-0 rounded-none custom-input bg-transparent focus:border-[#4DB571] hover:border-[#4DB571]" />
              </Form.Item>
            </Flex>

            <Form.Item className="mb-0">
              <div className="space-y-4">
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={isLoading}
                  loading={isLoading}
                  className="bg-[#4DB571] hover:bg-white custom-button w-full h-12 rounded-xl"
                >
                  Create an account
                </Button>
                <p className="text-center">
                  Already have an account?&nbsp;
                  <Link to="/signin" className="text-[#4DB571]">
                    Sign In
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

export default Register;
