/* =============================================
   MOCK-DATA.JS — Shared static mock datasets
   used across landing & other marketing pages.
============================================= */

var MERIDIAN_MOCK = {
  testimonials: [
    {
      quote: "Meridian took our lead research process from three days to three hours. Our reps now spend that time actually selling.",
      name: "Sarah Chen",
      title: "VP of Sales, Northwind Logistics",
      initials: "SC"
    },
    {
      quote: "We rolled out our first agent in an afternoon. No engineering ticket, no waiting on IT — just results.",
      name: "Marcus Alden",
      title: "Head of Ops, Fenwick Retail",
      initials: "MA"
    },
    {
      quote: "The approval workflow is what sold our security team. Every agent action is logged and reviewable.",
      name: "Priya Raman",
      title: "Director of IT, Cascade Health",
      initials: "PR"
    }
  ],
  useCases: [
    { persona: "Sales", headline: "Qualify leads while your reps sleep", metric: "3x more leads qualified" },
    { persona: "Support", headline: "Triage tickets before they hit your queue", metric: "42% faster first response" },
    { persona: "Ops", headline: "Turn weekly reporting into a 2-minute task", metric: "12 hrs saved per week" },
    { persona: "Marketing", headline: "Draft campaign briefs from a single prompt", metric: "5x faster campaign kickoff" }
  ],
  tryAgent: {
    lead: {
      tabLabel: "Lead Qualifier",
      fieldLabel: "Lead description",
      placeholder: "Paste a lead description, e.g. a name, title, company, and what they did on your site...",
      steps: ["Reading lead details", "Scoring against your ICP", "Drafting routing recommendation"],
      examples: [
        "Jane Doe, VP of Operations at a 200-person logistics company, downloaded our pricing page and requested a demo.",
        "Tom Reyes, a student, signed up with a personal email and hasn't opened any emails."
      ]
    },
    ticket: {
      tabLabel: "Ticket Triage",
      fieldLabel: "Support message",
      placeholder: "Paste an incoming support message to see how the agent triages it...",
      steps: ["Reading the message", "Detecting category and urgency", "Drafting a first response"],
      examples: [
        "I was charged twice this month for my Growth plan and need a refund ASAP, this is urgent.",
        "Quick question — does Meridian support exporting agent run history to CSV?"
      ]
    },
    meeting: {
      tabLabel: "Meeting Summarizer",
      fieldLabel: "Meeting notes or transcript",
      placeholder: "Paste rough meeting notes or a transcript snippet to summarize...",
      steps: ["Reading the transcript", "Identifying decisions and owners", "Writing the summary"],
      examples: [
        "Team agreed to push the launch to Oct 14. Priya will finalize pricing page copy by Friday. Marcus to loop in legal on the new ToS.",
        "Discussed Q3 roadmap. Decided to deprioritize the mobile app. Sarah owns the customer interview plan, due next week."
      ]
    }
  }
};
