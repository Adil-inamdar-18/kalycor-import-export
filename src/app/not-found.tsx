import { PageHero } from "@/components/Sections";
import { Button } from "@/components/Button";
export default function NotFound() {
  return (
    <PageHero
      title="Page not found"
      intro="That page does not exist or has moved."
    >
      <Button href="/">Back to home</Button>
    </PageHero>
  );
}
