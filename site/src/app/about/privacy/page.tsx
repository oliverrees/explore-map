import { Container } from "@/app/components/Container";
import { Header } from "@/app/components/Header";
import React from "react";

export default function PrivacyPage() {
  const privacyPolicy = {
    effectiveDate: "16th August 2024",
    sections: {
      introduction: {
        title: "1. Introduction",
        content: `Welcome to ExploreMap (“Service”), operated by OR Innovation Limited
        (“Company”, “we”, “us”, or “our”). We respect your privacy and are
        committed to protecting your personal data. This Privacy Policy
        explains how we collect, use, disclose, and safeguard your information
        when you use our Service.`,
      },
      informationWeCollect: {
        title: "2. Information We Collect",
        content: [
          {
            type: "text",
            content: `We collect various types of information to provide and improve our Service.`,
          },
          {
            type: "list",
            items: [
              {
                title: "Strava Data:",
                content: `When you connect your Strava account to ExploreMap, we collect data from your Strava account, including but not limited to activity details (such as route, distance, and duration) and personal information (such as profile details and preferences).`,
              },
              {
                title: "Personal Information:",
                content: `We may collect personal information such as your name, email address, and any other information you provide directly to us when using our Service. This data is essential for account creation, communication, and personalized experiences.`,
              },
              {
                title: "Usage Data:",
                content: `We collect information on how you interact with our Service, including your IP address, browser type, operating system, and pages visited. This data helps us understand user behavior and improve our platform.`,
              },
              {
                title: "Cookies:",
                content: `We use cookies and similar tracking technologies to monitor activity on our Service and store certain information. Cookies help us provide a more seamless experience by remembering your preferences and login details.`,
              },
            ],
          },
        ],
      },
      howWeUseYourData: {
        title: "3. How We Use Your Data",
        content: `We use the data we collect to: provide, maintain, and improve our Service, ensuring that it meets your needs; personalize your experience by displaying content relevant to your interests Communicate with you regarding updates, promotions, and service-related matters; ensure the security of your account by monitoring for suspicious activity; comply with legal obligations and enforce our terms and conditions.`,
      },
      dataSecurity: {
        title: "4. Data Security",
        content: `We implement a variety of security measures, including encryption and secure access protocols, to protect your information from unauthorized access, disclosure, or destruction. However, please note that no method of transmission over the internet or method of electronic storage is completely secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.`,
      },
      dataDeletion: {
        title: "5. Data Deletion",
        content: `If you decide to de-authorize ExploreMap from your Strava account, we will delete all associated data from our systems within a reasonable time frame. This includes all personal data, activity details, and any other information related to your use of the Service. You can also request the deletion of your data at any time by contacting us directly.`,
      },
      changesToPolicy: {
        title: "6. Changes to This Policy",
        content: `We may update this Privacy Policy from time to time to reflect changes in our practices or legal obligations. When we make changes, we will update the effective date at the top of this page and notify you of any significant changes through email or a prominent notice on our website. Your continued use of the Service after such changes constitutes your acceptance of the updated Privacy Policy.`,
      },
      contactUs: {
        title: "7. Contact Us",
        content: `If you have any questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact us at hello@or-innovation.com. We are committed to addressing your inquiries and will respond to your request as soon as possible.`,
      },
    },
  };

  return (
    <>
      <Header />
      <Container customPadding="py-6 px-6 lg:px-0 font-light">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <p className="mb-4">Effective Date: {privacyPolicy.effectiveDate}</p>

        {Object.values(privacyPolicy.sections).map((section, index) => (
          <div key={index} className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
            {Array.isArray(section.content) ? (
              section.content.map((contentItem: any, idx) => {
                if (contentItem.type === "text") {
                  return (
                    <p key={idx} className="mb-4">
                      {contentItem.content}
                    </p>
                  );
                } else if (contentItem.type === "list") {
                  return (
                    <ul
                      key={idx}
                      className="list-disc pl-6 mb-4 flex flex-col gap-4"
                    >
                      {contentItem.items.map((item: any, itemIdx: number) => (
                        <li key={itemIdx}>
                          <strong>{item.title}</strong> {item.content}
                        </li>
                      ))}
                    </ul>
                  );
                }
              })
            ) : (
              <p className="mb-4">{section.content}</p>
            )}
          </div>
        ))}
      </Container>
    </>
  );
}
