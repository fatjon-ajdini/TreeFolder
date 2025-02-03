import FolderStructure from "./components/FolderStructure";

function App() {
  return (
    <div className="bg-gray-200 h-screen flex">
      <div className="m-auto w-[400px] bg-white rounded-lg shadow-xl">
        <div className="p-4">
          <FolderStructure />
        </div>
      </div>
    </div>
  );
}

export default App;
