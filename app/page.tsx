import StudentLayout from "./(student)/app/layout";
import StudentHomePage from "./(student)/app/home/page";

export default function Page() {
  return (
    <StudentLayout>
      <StudentHomePage />
    </StudentLayout>
  );
}
