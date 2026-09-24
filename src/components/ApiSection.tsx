import Reveal from "@/components/Reveal";
import RequestPlayground from "@/components/RequestPlayground";
import { Section, SectionHeading, Serif } from "@/components/Section";

export default function ApiSection() {
  return (
    <Section id="api" className="relative border-t border-line">
      <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-80 max-w-3xl rounded-full bg-violet/10 blur-[120px]" />
      <SectionHeading
        eyebrow="Agent-native requests"
        title={
          <>
            Request content like you <Serif>call an API.</Serif>
          </>
        }
        description="Every request is a structured ticket, so your team — or your agent — can file one from anywhere. The official MCP server is next: Cursor, Claude Code, and Codex will file and track requests for you."
      />
      <Reveal>
        <RequestPlayground />
      </Reveal>
    </Section>
  );
}
