import { Container } from "@/app/components/Container";
import { Header } from "@/app/components/Header";
import React from "react";

export default function TermsPage() {
  const termsOfService = {
    effectiveDate: "16th August 2024",
    sections: {
      introduction: {
        title: "1. Introduction",
        content: `Welcome to ExploreMap (“Service”), operated by OR Innovation Limited
        (“Company”, “we”, “us”, or “our”). These Terms of Service govern your use of our Service. By accessing or using the Service, you agree to be bound by these Terms.`,
      },
      acceptanceOfTerms: {
        title: "2. Acceptance of Terms",
        content: `By accessing or using our Service, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree with any part of these Terms, you must not use our Service.`,
      },
      stravaIntegration: {
        title: "3. Strava Integration",
        content: `ExploreMap integrates with Strava to visualize your activities on an interactive map. By connecting your Strava account, you grant us permission to access your Strava data, including activity details and personal information, in accordance with Strava's API Agreement.`,
      },
      userResponsibilities: {
        title: "4. User Responsibilities",
        content: [
          {
            type: "text",
            content: `As a user of our Service, you agree to:`,
          },
          {
            type: "list",
            items: [
              {
                title: "Provide Accurate Information:",
                content: `You agree to provide accurate and complete information when creating an account and using our Service. You are responsible for maintaining the confidentiality of your account information.`,
              },
              {
                title: "Use the Service Lawfully:",
                content: `You agree to use the Service in compliance with all applicable laws and regulations. You must not use the Service for any unlawful or prohibited activities.`,
              },
              {
                title: "Respect Intellectual Property:",
                content: `You agree not to infringe on the intellectual property rights of the Company or any third party while using the Service.`,
              },
            ],
          },
        ],
      },
      termination: {
        title: "5. Termination",
        content: `We reserve the right to terminate or suspend your access to the Service at any time, without notice or liability, if we determine that you have violated these Terms or engaged in any conduct that we deem inappropriate.`,
      },
      liabilityLimitation: {
        title: "6. Limitation of Liability",
        content: `To the fullest extent permitted by law, OR Innovation Limited shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from your access to or use of, or inability to access or use, the Service.`,
      },
      changesToTerms: {
        title: "7. Changes to These Terms",
        content: `We may update these Terms of Service from time to time. We will notify you of any changes by posting the updated Terms on this page. Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.`,
      },
      governingLaw: {
        title: "8. Governing Law",
        content: `These Terms shall be governed and construed in accordance with the laws of England and Wales, without regard to its conflict of law provisions.`,
      },
      contactUs: {
        title: "9. Contact Us",
        content: `If you have any questions or concerns about these Terms of Service, please contact us at hello@or-innovation.com`,
      },
    },
  };

  return (
    <>
      <Header />
      <Container customPadding="py-6 font-light">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        <p className="mb-4">Effective Date: {termsOfService.effectiveDate}</p>

        {Object.values(termsOfService.sections).map((section, index) => (
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
