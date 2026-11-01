import ScrollStory from "./ScrollStory";
import { Section } from "./ui";

export default function Process() {
  return (
    <Section id="process" index="02" label="How it works" title="One build. Every channel." bodyClassName="mt-4 md:mt-6">
      <ScrollStory />
    </Section>
  );
}
