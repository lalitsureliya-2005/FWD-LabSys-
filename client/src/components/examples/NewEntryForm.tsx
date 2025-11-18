import NewEntryForm from '../NewEntryForm';

export default function NewEntryFormExample() {
  return (
    <div className="p-8">
      <NewEntryForm onSubmit={(data) => console.log('Form submitted:', data)} />
    </div>
  );
}
