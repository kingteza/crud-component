import { setupI18n } from "./locale";
import { CrudComponent } from ".";

// Initialize with your custom translations
setupI18n();

function App() {
  return (
    <div className="">
      <CrudComponent
        fields={[{ type: "text", name: "name", label: "Name" }]}
        data={[]}
      />
    </div>
  );
}

export default App;
