"use client";
import { Disclosure } from "@headlessui/react";
import { MinusSmallIcon, PlusSmallIcon } from "@heroicons/react/24/outline";
interface FAQsProps {}
const faqs = [
  {
    question: "Is Statebeing a personality test?",
    answer:
      "Whilst we do measure some personality traits, we take a much more holistic approach to understanding your current state. We measure a range of physiological signals, including brain waves and heart rate, to give you a comprehensive picture of the person you are. This means that the data you get back is much more reliable and accurate than a traditional personality test. Additionally, unlike a personality test none of the attributes we measure are fixed or permanent - they are simply a snapshot of your current state.",
  },
  {
    question: "Why is measurement done in person?",
    answer:
      "We believe that measuring your current state in a dedicated space is the best way to get accurate results. Physiological signals - particularly brain waves measured by EEG - are very sensitive to environmental stimuli like light and sound. In the Statebeing studio we’re able to control the environment that you’re in, meaning that the data you get back is much higher quality. By measuring in a controlled environment, we’re able to create a baseline that can be compared with future measurements.",
  },
  {
    question: "How accessible is the experience?",
    answer:
      "Our studio is fully accessible for wheelchair users and we have a range of accessibility options available. If you have any specific requirements, please get in touch with us and we’ll do our best to accommodate you.",
  },
  {
    question: "When will you be coming to my city?",
    answer:
      "Currently statebeing is only available in London, UK. We’re looking at expanding in the future, as well as running popups, so if you’d like us to come to your city please send us an email so we can keep in touch.",
  },

  {
    question: "How do you ensure data privacy?",
    answer:
      "We only collect the data that we need to provide you with the best possible experience, and we store it securely. We never share your data with third parties without your explicit consent. Read more in our privacy policy.",
  },
];
export const FAQs = ({}: FAQsProps) => {
  return (
    <div className="bg-white" id="faqs">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-32 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-4xl divide-y divide-gray-900/10">
          <h2 className="font-display text-4xl">FAQs</h2>
          <dl className="mt-4 space-y-6 divide-y divide-gray-900/10">
            {faqs.map((faq) => (
              <Disclosure as="div" key={faq.question} className="pt-6">
                {({ open }) => (
                  <>
                    <dt>
                      <Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-900">
                        <span className="text-base font-semibold leading-7">
                          {faq.question}
                        </span>
                        <span className="ml-6 flex h-7 items-center">
                          {open ? (
                            <MinusSmallIcon
                              className="h-6 w-6"
                              aria-hidden="true"
                            />
                          ) : (
                            <PlusSmallIcon
                              className="h-6 w-6"
                              aria-hidden="true"
                            />
                          )}
                        </span>
                      </Disclosure.Button>
                    </dt>
                    <Disclosure.Panel as="dd" className="mt-2 pr-12">
                      <p className="text-base leading-7 text-gray-600 font-normal">
                        {faq.answer}
                      </p>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};
