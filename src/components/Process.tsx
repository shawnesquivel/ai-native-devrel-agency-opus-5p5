import ScrollStory from "./ScrollStory";
import { ENGINE } from "@/lib/site";
import { Section } from "./ui";

export default function Process() {
  return (
    <Section
      id="process"
      index="02"
      label="How it works"
      title="Audit. Ship. Measure. Repeat."
      intro={ENGINE}
      bodyClassName="mt-4 md:mt-6"
    >
      <ScrollStory />
    </Section>
  );
}
