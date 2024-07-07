import Card from "../../components/Card";

export default function NotesPage() {
  return (
    <div className="flex flex-col ml-8 mt-3">
      <h1 className="text-4xl font-bold mb-8">Notes</h1>
      <div className="grid grid-cols-4 gap-4">
        {[...Array(12)].map((_, index) => (
          <Card key={index} />
        ))}
      </div>
    </div>
  );
}
