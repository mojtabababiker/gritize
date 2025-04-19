import Image from "next/image";
import Bounded from "../common/Bounded";
import Heading from "../common/Heading";
import FAQsContainer from "./FAQsContainer";

const getFAGs = Promise.resolve([
  {
    question: "What Exactly Is Gritize",
    answer:
      "Gritize is an open-source platform built to sharpen your problem-solving mindset and coding skills using generative AI. It’s more than a practice tool—it’s a movement empowering developers to grow, contribute, and stand out",
  },
  {
    question: "Who is Gritize for?",
    answer:
      "Primarily for junior and mid-level developers, but open to anyone hungry to grow. Whether you’re practicing for interviews or looking to contribute to a real project, Gritize welcomes you.",
  },
  {
    question: "Is Gritize free to use?",
    answer:
      "Yes—100% free and open source. Built by a developer who knows what it’s like to be overlooked, Gritize is made for you, not for profit.",
  },
  {
    question: "What services does Gritize offer?",
    answer:
      "Currently, two core paths: Practicing General Algorithms and Mastering Coding Techniques. Both focus on mindset over memorization—and prepare you to face real-world assessments confidently.",
  },
  {
    question: "Can I contribute to Gritize as a developer?",
    answer:
      "Absolutely. Gritize thrives on community contributions—from fixing bugs to improving problem sets or refining the experience. Check out our GitHub repo and become part of the mission.",
  },
  {
    question: "How does Gritize use AI?",
    answer:
      "We use generative AI to craft personalized, real-world problem sets that guide you step by step through solving and mastering coding challenges.",
  },
  {
    question: "Can I support Gritize financially?",
    answer:
      "Yes! If you believe in our mission, consider donating to help us keep Gritize growing and accessible for all.",
  },
]);
async function FAQs() {
  const fags = await getFAGs;
  return (
    <Bounded as="section" className="py-16 bg-surface text-bg">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* content */}
        <div className="flex-1 sm:min-w-[320px] flex flex-col gap-6">
          <Heading as="h2" size="lg" className="font-black">
            Frequently A/Q
          </Heading>

          {/* faqs */}
          <div className="flex-1 flex flex-col gap-0">
            {/* fags card here */}
            <FAQsContainer faqs={fags} />
          </div>
        </div>

        {/* image */}
        <div className="flex-1 min-w-full sm:min-w-[420px] flex items-center justify-center">
          <Image
            src={"/images/faq-bg.png"}
            alt=""
            width={640}
            height={640}
            className="w-full h-auto object-cover"
          />
        </div>
      </div>
    </Bounded>
  );
}

export default FAQs;
