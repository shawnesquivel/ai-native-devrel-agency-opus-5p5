import ScrollStory from "./ScrollStory";
import { Section } from "./ui";

export default function Process() {
  return (
    <Section
      id="process"
      title="Audit. Strategize. Ship. Compound."
      bodyClassName="mt-6 md:mt-8"
    >
      <ScrollStory />
    </Section>
  );
}
