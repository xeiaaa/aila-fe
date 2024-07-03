import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "antd/es/layout/layout";
import {
  Button,
  Typography,
  Segmented,
  notification,
  Flex,
  Drawer,
  Tag,
  Popover,
} from "antd";
import {
  ArrowLeftOutlined,
  CheckOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { IoDiamond } from "react-icons/io5";
import Payment from "../../components/Payment";
import { useSubscription } from "../../context/SubscriptionContext";
import { useWindowSize } from "../../hooks/useWindowSize";
const { Title } = Typography;

const Pricing = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [offerType, setOfferType] = useState("");
  const [offerPrice, setOfferPrice] = useState(0);
  const {
    subscribedPlan,
    subscribedPlans,
    setSubscribedPlans,
    setCancelledPlans,
    credits,
    cancelledPlans,
    updateSubscriptionPlan,
  } = useSubscription();
  const [openHistory, setOpenHistory] = useState(false);
  const { width: screenWidth } = useWindowSize();
  const isMobile = screenWidth < 640;

  const showHistoryDrawer = () => {
    setOpenHistory(true);
  };
  const onHistoryClose = () => {
    setOpenHistory(false);
  };

  const showModal = (type, price) => {
    setOfferType(type);
    setOfferPrice(price);
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const subscriptionPlans = {
    recurring: {
      trial: {
        name: "Trial offer",
        description: "Perfect for new learners",
        credits: 5,
        price: 0,
        duration: "Free 1 Month",
        durationType: "monthly",
        videoConversion: 1,
        audioConversion: 1,
      },
      basic: {
        name: "Basic offer",
        description: "Ideal for casual learners",
        credits: 15,
        price: 160,
        duration: (
          <Flex className="items-baseline gap-1">
            <p className="dark:text-textDark">₱160</p>
            <p className="text-sm dark:text-textDark">/month</p>
          </Flex>
        ),
        durationType: "monthly",
        videoConversion: 3,
        audioConversion: 5,
      },
      premium: {
        name: "Premium offer",
        description: "Perfect for dedicated learners",
        credits: 30,
        price: 310,
        duration: (
          <Flex className="items-baseline gap-1 dark:text-textDark">
            <p className="dark:text-textDark">₱310</p>
            <p className="text-sm dark:text-textDark">/month</p>
          </Flex>
        ),
        durationType: "monthly",
        videoConversion: 6,
        audioConversion: 8,
      },
    },
    oneTime: {
      weekly: {
        name: "Weekly pass",
        description: "Perfect for casual learners",
        credits: 10,
        price: 110,
        duration: (
          <Flex className="items-baseline gap-1 dark:text-textDark">
            <p className="dark:text-textDark">₱110</p>
            <p className="text-sm dark:text-textDark">/week</p>
          </Flex>
        ),
        durationType: "weekly",
        videoConversion: 2,
        audioConversion: 4,
      },
      daily: {
        name: "Daily pass",
        description: "Perfect for learners engaging research",
        credits: 5,
        price: 60,
        duration: (
          <Flex className="items-baseline gap-1 dark:text-textDark">
            <p className="dark:text-textDark">₱60</p>
            <p className="text-sm dark:text-textDark">/day</p>
          </Flex>
        ),
        durationType: "daily",
        videoConversion: 1,
        audioConversion: 3,
      },
    },
  };

  const handleSubscription = (type, plan) => {
    const selectedPlan = subscriptionPlans[type][plan];

    if (subscribedPlans.some((sp) => sp.plan === selectedPlan.name)) {
      // Cancel existing subscription
      const subscribedPlan = subscribedPlans.find(
        (sp) => sp.plan === selectedPlan.name
      );

      if (subscribedPlan) {
        // Update the subscription status to cancelled
        const updatedSubscribedPlans = subscribedPlans.map((sp) =>
          sp.plan === selectedPlan.name ? { ...sp, status: "cancelled" } : sp
        );
        const updatedCancelledPlans = [
          ...cancelledPlans,
          { ...subscribedPlan, status: "cancelled" },
        ];

        // Update state and context
        setSubscribedPlans(updatedSubscribedPlans);
        setCancelledPlans(updatedCancelledPlans);
        updateSubscriptionPlan(
          "",
          updatedSubscribedPlans,
          updatedCancelledPlans,
          0,
          0,
          0
        );

        // Notify user only once
        notification.warning({
          message: "Subscription Cancelled",
          description: `Your subscription to the ${selectedPlan.name} plan has been cancelled.`,
        });
      }
    } else {
      // Add new subscription
      notification.success({
        message: "Subscription Confirmed",
        description: `You have successfully subscribed to the ${selectedPlan.name} plan.`,
      });

      const currentDate = new Date();
      const expirationDate = new Date();

      switch (selectedPlan.durationType) {
        case "monthly":
          expirationDate.setMonth(currentDate.getMonth() + 1);
          break;
        case "weekly":
          expirationDate.setDate(currentDate.getDate() + 7);
          break;
        case "daily":
          expirationDate.setDate(currentDate.getDate() + 1);
          break;
        default:
          expirationDate.setMonth(currentDate.getMonth() + 1);
          break;
      }

      const newSubscribedPlan = {
        key: `${type}-${plan}`,
        plan: selectedPlan.name,
        status: "active",
        total: selectedPlan.price,
        date: currentDate.toLocaleDateString(),
        expiration: expirationDate.toLocaleDateString(),
      };

      const updatedSubscribedPlans = [...subscribedPlans, newSubscribedPlan];

      // Update state and context
      setSubscribedPlans(updatedSubscribedPlans);
      updateSubscriptionPlan(
        selectedPlan.name,
        updatedSubscribedPlans,
        cancelledPlans,
        selectedPlan.credits,
        selectedPlan.videoConversion,
        selectedPlan.audioConversion
      );
    }
  };

  const [value, setValue] = useState("Recurring");
  const navigate = useNavigate();

  const data = subscribedPlans.map((sp) => ({
    key: sp.key,
    plan: sp.plan,
    status: sp.status,
    total: sp.total,
    date: sp.date,
    expiration: sp.expiration,
  }));

  const handleCancelSubscription = (key) => {
    // Find the subscription to cancel
    const subscriptionToCancel = subscribedPlans.find((sp) => sp.key === key);

    if (subscriptionToCancel) {
      // Notify user
      notification.warning({
        message: "Subscription Cancelled",
        description: `Your subscription to the ${subscriptionToCancel.plan} plan has been cancelled.`,
      });

      // Update the status to cancelled
      const updatedSubscribedPlans = subscribedPlans.filter(
        (sp) => sp.key !== key
      );
      const updatedCancelledPlans = [
        ...cancelledPlans,
        { ...subscriptionToCancel, status: "cancelled" },
      ];

      // Update state and context
      setSubscribedPlans(updatedSubscribedPlans);
      setCancelledPlans(updatedCancelledPlans);
      updateSubscriptionPlan(
        "",
        updatedSubscribedPlans,
        updatedCancelledPlans,
        0,
        0,
        0
      );
    }
  };

  return (
    <>
      <Header className="sticky top-0 z-10 flex items-center justify-center bg-tertiary shadow dark:bg-secondaryDark">
        <div className="absolute left-8 mr-5 flex items-center">
          <Button
            icon={<ArrowLeftOutlined className="dark:text-textDark" />}
            onClick={() => {
              navigate("/notes");
            }}
            className="border-none dark:!bg-tertiaryDark"
          ></Button>
        </div>
        <Title level={4} style={{ color: "white" }}>
          Pricing
        </Title>
        <div className="absolute right-8 flex gap-3">
          <Popover content="5 credits generates 1 video or audio">
            <div className="flex items-center px-3 py-1 bg-white h-10 rounded-md dark:bg-tertiaryDark">
              <IoDiamond className="mr-0 lg:mr-2 text-yellow-500" />
              <p className="hidden lg:block dark:text-textDark">Credits</p>
              <div className="w-[0.063rem] h-full bg-slate-300 mx-2"></div>
              <p className="dark:text-textDark">{credits}</p>
            </div>
          </Popover>
          {isMobile ? (
            <Button
              icon={<ShoppingCartOutlined />}
              className="h-10 bg-transparent text-white hover:!bg-transparent"
              onClick={showHistoryDrawer}
            />
          ) : (
            <Button
              icon={<ShoppingCartOutlined />}
              className="h-10 bg-transparent text-white hover:!bg-transparent"
              onClick={showHistoryDrawer}
            >
              Purchase history
            </Button>
          )}
        </div>
      </Header>
      <div className="flex flex-col justify-center items-center gap-7 py-8 px-4 mx-auto max-w-screen-xl lg:py-[1.375rem] lg:px-12">
        <Segmented
          options={[
            { label: <span>Recurring</span>, value: "Recurring" },
            { label: <span>One-time</span>, value: "One-time" },
          ]}
          value={value}
          onChange={(value) => {
            setValue(value);
          }}
          className="custom-segmented dark:bg-secondaryDark dark:border-borderDark"
        />
        {value === "Recurring" && (
          <div className="flex gap-7 flex-col lg:flex-row">
            {Object.keys(subscriptionPlans.recurring).map((plan) => (
              <div className="flex flex-col mx-auto w-80" key={plan}>
                <div
                  className={`w-full flex flex-col bg-[#40a9e81f] p-6 border-t-2 border-l-2 border-r-2 border-solid rounded-t-2xl border-[#40a9e81f]`}
                >
                  <h3 className="mb-1 text-2xl font-semibold dark:text-textDark">
                    {subscriptionPlans.recurring[plan].name}
                  </h3>
                  <p className="sm:text-lg lg:text-sm dark:text-gray-300">
                    {subscriptionPlans.recurring[plan].description}
                  </p>
                  <div className="flex items-baseline my-3">
                    <span className="mr-2 text-3xl font-bold dark:text-textDark">
                      {subscriptionPlans.recurring[plan].duration}
                    </span>
                  </div>
                  <Button
                    className="text-white hover:!text-white bg-primary hover:!bg-primaryHover font-medium rounded-md text-sm px-5 py-2.5 text-center mt-4 h-11 dark:border-borderDark dark:disabled:text-gray-400"
                    onClick={() => showModal("recurring", plan)}
                    disabled={
                      subscribedPlan === subscriptionPlans.recurring[plan].name
                    }
                  >
                    {subscribedPlan === subscriptionPlans.recurring[plan].name
                      ? "Current plan"
                      : "Choose plan"}
                  </Button>
                </div>

                <ul
                  role="list"
                  className="mb-0 lg:mb-8 space-y-4 text-left p-6 bg-white border-b-2 border-l-2 border-r-2 border-solid rounded-b-2xl border-[#40a9e81f] dark:bg-secondaryDark dark:text-textDark"
                >
                  <li className="flex items-center space-x-3">
                    <CheckOutlined className="text-primary" />
                    <span>
                      {subscriptionPlans.recurring[plan].credits} Credits
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckOutlined className="text-primary" />
                    <span>
                      {subscriptionPlans.recurring[plan].videoConversion} free
                      video conversion
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckOutlined className="text-primary" />
                    <span>
                      {subscriptionPlans.recurring[plan].audioConversion} free
                      audio conversion
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckOutlined className="text-primary" />
                    <span>Free access to all features</span>
                  </li>
                </ul>
              </div>
            ))}
          </div>
        )}
        {value === "One-time" && (
          <div className="flex gap-7 flex-col lg:flex-row">
            {Object.keys(subscriptionPlans.oneTime).map((plan) => (
              <div className="flex flex-col mx-auto w-80" key={plan}>
                <div
                  className={`w-full flex flex-col bg-[#40a9e81f] p-6 border-t-2 border-l-2 border-r-2 border-solid rounded-t-2xl border-[#40a9e81f]`}
                >
                  <h3 className="mb-1 text-2xl font-semibold dark:text-textDark">
                    {subscriptionPlans.oneTime[plan].name}
                  </h3>
                  <p className="sm:text-lg lg:text-sm dark:text-gray-300">
                    {subscriptionPlans.oneTime[plan].description}
                  </p>
                  <div className="flex items-baseline my-3">
                    <span className="mr-2 text-3xl font-bold dark:text-textDark">
                      {subscriptionPlans.oneTime[plan].duration}
                    </span>
                  </div>
                  <Button
                    className="text-white hover:!text-white bg-primary hover:!bg-primaryHover font-medium rounded-md text-sm px-5 py-2.5 text-center mt-4 h-11 dark:border-borderDark dark:disabled:text-gray-400"
                    onClick={() => showModal("oneTime", plan)}
                    disabled={
                      subscribedPlan === subscriptionPlans.oneTime[plan].name
                    }
                  >
                    {subscribedPlan === subscriptionPlans.oneTime[plan].name
                      ? "Current plan"
                      : "Choose plan"}
                  </Button>
                </div>

                <ul
                  role="list"
                  className="mb-0 lg:mb-8 space-y-4 text-left p-6 bg-white border-b-2 border-l-2 border-r-2 border-solid rounded-b-2xl border-[#40a9e81f] dark:bg-secondaryDark dark:text-textDark"
                >
                  <li className="flex items-center space-x-3">
                    <CheckOutlined className="text-primary" />
                    <span>
                      {subscriptionPlans.oneTime[plan].credits} Credits
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckOutlined className="text-primary" />
                    <span>
                      {subscriptionPlans.oneTime[plan].videoConversion} free
                      video conversion
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckOutlined className="text-primary" />
                    <span>
                      {subscriptionPlans.oneTime[plan].audioConversion} free
                      audio conversion
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckOutlined className="text-primary" />
                    <span>Free access to all features</span>
                  </li>
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Payment Modal */}
      <Payment
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        handleOk={handleOk}
        handleCancel={handleCancel}
        offerType={offerType}
        offerPrice={offerPrice}
        handleSubscription={() => handleSubscription(offerType, offerPrice)}
      />
      {/* History drawer */}
      <Drawer
        title={<span className="dark:text-textDark">Purchase history</span>}
        onClose={onHistoryClose}
        open={openHistory}
        width={isMobile ? "100%" : "60%"}
        className="dark:bg-backgroundDark dark:!text-textDark"
      >
        <div className="relative overflow-x-scroll p-5">
          <table className="w-full text-sm text-center rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-4 py-2">
                  Plan
                </th>
                <th scope="col" className="px-4 py-2">
                  Status
                </th>
                <th scope="col" className="px-4 py-2">
                  Total
                </th>
                <th scope="col" className="px-4 py-2">
                  Date Purchased
                </th>
                <th scope="col" className="px-4 py-2">
                  Expiration Date
                </th>
                <th scope="col" className="px-4 py-2">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((record) => (
                <tr
                  key={record.key}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <td
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-normal md:whitespace-nowrap dark:text-white"
                  >
                    {record.plan}
                  </td>
                  <td
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-normal md:whitespace-nowrap dark:text-white"
                  >
                    <Tag color={"green"}>{record.status.toUpperCase()}</Tag>
                  </td>
                  <td
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-normal md:whitespace-nowrap dark:text-white"
                  >
                    {record.total}
                  </td>
                  <td
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-normal md:whitespace-nowrap dark:text-white"
                  >
                    {record.date}
                  </td>
                  <td
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-normal md:whitespace-nowrap dark:text-white"
                  >
                    {record.expiration}
                  </td>
                  <td
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-normal md:whitespace-nowrap dark:text-white"
                  >
                    <Button
                      type="link"
                      danger
                      onClick={() => handleCancelSubscription(record.key)}
                      className="p-0"
                    >
                      Cancel
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Drawer>
    </>
  );
};
export default Pricing;
