import ScrollStory from "./ScrollStory";
import { Section } from "./ui";

export default function Process() {
  return (
    <Section
      id="process"
      index="02"
      label="How it works"
      title="Audit. Ship. Measure. Repeat."
      intro="Every week the engine ships. Every month you show up in more answers, ahead of your competitors."
      bodyClassName="mt-4 md:mt-6"
    >
      <ScrollStory />
    </Section>
  );
}
