import { Flex, Button, Typography } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Header } from "antd/es/layout/layout";
const { Title } = Typography;

const Policies = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header className="sticky top-0 flex items-center justify-center bg-tertiary shadow dark:bg-secondaryDark">
        <div className="logo absolute left-8  mr-5 flex items-center">
          <Button
            icon={<ArrowLeftOutlined className="dark:text-textDark" />}
            onClick={() => {
              navigate("/notes");
            }}
            className="border-none dark:!bg-tertiaryDark"
          ></Button>
        </div>
        <Title level={4} style={{ color: "white" }}>
          {/* Terms & Policies */}
          Legal Center
        </Title>
      </Header>

      {/* <Flex className="py-7 px-12 justify-center gap-10 items-center dark:text-textDark" vertical>
        <Flex className="w-full sm:w-3/5" vertical gap={40}>
          <Flex className="mb-3" vertical>
            <p className="font-semibold text-xl mb-3 dark:text-textDark">
              Legal
            </p>
            <ul className="flex flex-col gap-1 text-base dark:text-textDark">
              <li>
                <span className="underline underline-offset-2">
                  Terms of Use:
                </span>
                &nbsp; Terms that control how AILA is used, including the tools
                for creating material, chatbot interactions, and educational
                services.
              </li>
              <li>
                <span className="underline underline-offset-2">
                  Privacy Policy:
                </span>
                &nbsp; Procedures for gathering, using, and safeguarding
                user-provided personal data, including passwords, email
                addresses, and names.
              </li>
              <li>
                <span className="underline underline-offset-2">
                  Service Terms:
                </span>
                &nbsp; Additional terms that regulate the usage of particular
                AILA services, like media creation and content uploads.
              </li>
              <li>
                <span className="underline underline-offset-2">
                  Data Processing Addendum:
                </span>
                &nbsp; Ensuring that personal data is handled securely and
                suitably in compliance with the applicable laws.
              </li>
              <li>
                <span className="underline underline-offset-2">
                  Service Credit Terms:
                </span>
                &nbsp; Terms governing any credits redeemable for AILA&apos;s
                services.
              </li>
              <li>
                <span className="underline underline-offset-2">
                  Business Terms:
                </span>
                &nbsp; Conditions that apply to businesses, developers, and
                educational institutions using AILA&apos;s services.
              </li>
            </ul>
          </Flex>
          <Flex className="mb-3" vertical>
            <p className="font-semibold text-xl mb-3 dark:text-textDark">
              Policies
            </p>
            <ul className="flex flex-col gap-1 text-base dark:text-textDark">
              <li>
                <span className="underline underline-offset-2">
                  Usage Policies:
                </span>
                &nbsp; Rules to guarantee the ethical and responsible usage of
                AILA&apos;s technology.
              </li>
              <li>
                <span className="underline underline-offset-2">
                  Privacy Practices:
                </span>
                &nbsp; Specific guidelines on the management of user data,
                particularly for enterprise and educational users.
              </li>
              <li>
                <span className="underline underline-offset-2">
                  Sharing & Publication Policy:
                </span>
                &nbsp; Guidelines for sharing, publishing, and research access
                that are relevant to the services provided by AILA.
              </li>
              <li>
                <span className="underline underline-offset-2">
                  Vulnerability Disclosure Policy:
                </span>
                &nbsp; Definition of good faith in finding and reporting
                security vulnerabilities in AILA&apos;s systems.
              </li>
            </ul>
          </Flex>
        </Flex>
      </Flex> */}

      <Flex
        className="py-7 px-5 lg:px-12 justify-center gap-5 items-center dark:text-textDark"
        vertical
      >
        <Flex
          className="bg-white p-5 shadow-md dark:bg-tertiaryDark rounded-lg"
          vertical
        >
          <Flex className="mb-3" vertical>
            <p className="font-bold text-xl mb-3 dark:text-textDark">
              Terms and Conditions
            </p>
            <p className="font-medium text-lg dark:text-textDark">
              Terms of Use:
            </p>
            <p className="text-base dark:text-textDark">
              Welcome to AILA, your personalized learning assistant. By using
              our services, you agree to abide by our terms of use, which
              outline how you can access and utilize our platform, including
              content creation, interaction with features, and community
              guidelines.
            </p>
          </Flex>
          <Flex className="mb-3" vertical>
            <p className="font-medium text-lg dark:text-textDark">
              Service Terms:
            </p>
            <p className="text-base dark:text-textDark">
              Certain features within AILA may have specific terms and
              conditions that govern their use. These include but are not
              limited to chatbot interactions, content generation tools, and
              educational resources available through our platform.
            </p>
          </Flex>
          <Flex className="mb-3" vertical>
            <p className="font-medium text-lg dark:text-textDark">
              Business Terms:
            </p>
            <p className="text-base dark:text-textDark">
              Organizations, institutions, or developers using AILA for
              commercial purposes must adhere to our business terms. These terms
              cover licensing, payment terms, and responsibilities for
              enterprise-level usage of our services.
            </p>
          </Flex>
          <Flex className="mb-3" vertical>
            <p className="font-medium text-lg dark:text-textDark">
              Generate Media Downtime Policy:
            </p>
            <p className="text-base dark:text-textDark">
              In the event of generate media downtime due to maintenance or other issues,
              we will extend your subscription based on the duration of the
              downtime. This ensures you receive the full value of your
              subscription without any loss of access.
            </p>
          </Flex>
        </Flex>
        <Flex
          className="bg-white p-5 shadow-md dark:bg-tertiaryDark rounded-lg"
          vertical
        >
          <Flex className="mb-3" vertical>
            <p className="font-bold text-xl mb-3 dark:text-textDark">
              Data Privacy
            </p>
            <p className="font-medium text-lg dark:text-textDark">
              Business Terms:
            </p>
            <p className="text-base dark:text-textDark">
              Organizations, institutions, or developers using AILA for
              commercial purposes must adhere to our business terms. These terms
              cover licensing, payment terms, and responsibilities for
              enterprise-level usage of our services.
            </p>
          </Flex>
          <Flex className="mb-3" vertical>
            <p className="font-medium text-lg dark:text-textDark">
              Privacy Policy:
            </p>
            <p className="text-base dark:text-textDark">
              At AILA, we prioritize your privacy and security. Our privacy
              policy outlines how we collect, store, use, and protect your
              personal information. This includes data gathered during account
              creation, interactions with our chatbot, and usage of educational
              materials.
            </p>
          </Flex>
          <Flex className="mb-3" vertical>
            <p className="font-medium text-lg dark:text-textDark">
              Data Processing Addendum:
            </p>
            <p className="text-base dark:text-textDark">
              To ensure compliance with global data protection laws, our data
              processing addendum details how we securely handle and process
              personal data. This includes encryption methods, data retention
              policies, and user rights regarding their personal information.
            </p>
          </Flex>
          <Flex className="mb-3" vertical>
            <p className="font-medium text-lg dark:text-textDark">
              Privacy Practices:
            </p>
            <p className="text-base dark:text-textDark">
              AILA maintains strict privacy practices, particularly for
              enterprise and educational users. We provide transparent
              guidelines on data management, ensuring compliance with industry
              standards and regulatory requirements.
            </p>
          </Flex>
        </Flex>
        <Flex
          className="bg-white p-5 shadow-md dark:bg-tertiaryDark rounded-lg"
          vertical
        >
          <Flex className="mb-3" vertical>
            <p className="font-bold text-xl mb-3 dark:text-textDark">
              Policies
            </p>
            <p className="font-medium text-lg dark:text-textDark">
              Usage Policies:
            </p>
            <p className="text-base dark:text-textDark">
              Users must adhere to AILA’s usage policies, which promote
              responsible and ethical use of our platform. This includes
              respecting intellectual property rights, refraining from illegal
              activities, and maintaining a positive community environment.
            </p>
          </Flex>
          <Flex className="mb-3" vertical>
            <p className="font-medium text-lg dark:text-textDark">
              Sharing & Publication Policy:
            </p>
            <p className="text-base dark:text-textDark">
              Our sharing and publication policy governs how users can share,
              publish, or distribute content accessed through AILA. It ensures
              proper attribution and compliance with copyright laws, fostering a
              respectful sharing environment.
            </p>
          </Flex>
          <Flex className="mb-3" vertical>
            <p className="font-medium text-lg dark:text-textDark">
              Vulnerability Disclosure Policy:
            </p>
            <p className="text-base dark:text-textDark">
              AILA is committed to maintaining a secure platform. Our
              vulnerability disclosure policy outlines procedures for reporting
              and addressing security vulnerabilities. This promotes
              collaboration with security researchers and safeguards user data.
            </p>
          </Flex>
        </Flex>
        <Flex
          className="bg-white p-5 shadow-md dark:bg-tertiaryDark rounded-lg"
          vertical
        >
          <p className="font-bold text-xl mb-3 dark:text-textDark">
            Implementation
          </p>
          <p className="text-base dark:text-textDark">
            Accessibility: Terms and Privacy policies are easily accessible
            through AILA&apos;s settings menu and within our app.
          </p>
          <p className="text-base dark:text-textDark">
            Clarity: We strive to communicate these policies clearly and
            concisely, avoiding technical jargon to enhance user understanding.
          </p>
          <p className="text-base dark:text-textDark">
            Updates: Regular updates to our terms and policies reflect changes
            in our services, technologies, and legal obligations. Users are
            notified of any updates to ensure continued compliance and trust.
          </p>
        </Flex>
      </Flex>
    </>
  );
};
export default Policies;
