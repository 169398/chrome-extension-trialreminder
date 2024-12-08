import { TrialForm } from "@/components/TrialForm";
import { ModeToggle } from "@/components/themes/mode-toggle";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container p-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Trial Reminder</h1>
          <ModeToggle />
        </div>
        <TrialForm />
      </div>
    </main>
  );
}
