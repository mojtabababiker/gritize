"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/base/Accordion";
import Paragraph from "@/components/common/Paragraph";
import Heading from "@/components/common/Heading";

type Faq = {
  question: string;
  answer: string;
};
type Props = {
  faqs: Faq[];
};

function FAQsContainer({ faqs }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <Accordion type="single" collapsible>
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`faq-${index}`}>
            <AccordionTrigger>
              <Heading
                as="h3"
                size="sm"
                className="font-semibold text-bg hover:text-bg/80 active:scale-105"
              >
                {faq.question}
              </Heading>
            </AccordionTrigger>
            <AccordionContent>
              <Paragraph
                size="sm"
                className="bg-primary text-surface px-4 py-2"
              >
                {faq.answer}
              </Paragraph>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

export default FAQsContainer;
