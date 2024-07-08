import Card from "../../components/Card";

export default function NotesPage() {
  return (
    <div className="flex flex-col h-screen">
      <h1 className="text-4xl font-bold mb-8 ml-8 mt-3">Notes</h1>
      <div className="flex-grow overflow-y-auto px-8 pb-8">
        <div className="grid grid-cols-3 gap-3">
          {[...Array(18)].map((_, index) => (
            <Card key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
