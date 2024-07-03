import {
  CheckCircleFilled,
  CloseCircleFilled,
  UserOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Typography, Avatar, message } from "antd";
import authAxios from "../api/authAxios";
import { API_URL } from "../config";

const { Title } = Typography;
const ProfilePage = () => {
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await authAxios.get(`${API_URL}/auth/me`);
      return data;
    },
    staleTime: Infinity,
  });

  const verifyEmailMutation = useMutation({
    mutationFn: () => {
      return authAxios.post(`${API_URL}/auth/send-verification-email`);
    },
    onSuccess: () => {
      message.success("Check your email");
    },
    onError: () => {
      message.error("Something went wrong, please contact your admin");
    },
  });

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : <UserOutlined />;
  };

  return (
    <div className="flex items-center justify-center p-9 md:p-0">
      <div className="flex flex-col items-center justify-center gap-3">
        <Avatar size={50} className="dark:bg-textDark dark:text-black">
          {getInitial(profile?.name)}
        </Avatar>
        <Button
          className="flex items-center dark:bg-transparent dark:text-textDark"
          icon={
            profile && profile.isEmailVerified ? (
              <CheckCircleFilled className="text-xl text-green-500" />
            ) : (
              <CloseCircleFilled className="text-xl text-red-500" />
            )
          }
          disabled={profile && profile.isEmailVerified}
          onClick={() => verifyEmailMutation.mutateAsync()}
          loading={verifyEmailMutation.isPending}
        >
          {profile && profile.isEmailVerified ? "Verified" : "Verify Email"}
        </Button>
        <Title level={3} className="!mb-0 dark:text-textDark">
          {profile?.name ? (
            profile.name
          ) : (
            "Loading..."
          )}
        </Title>
        <span>
          {profile?.email ? (
            profile.email
          ) : (
            "Loading..."
          )}
        </span>
      </div>
    </div>
  );
};

export default ProfilePage;
