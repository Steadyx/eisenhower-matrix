import QuadrantContainer from "@/components/quadrants/QuadrantContainer";
import ContextMenu from "@/components/context-menu"
function App() {
  return (
    <div className="min-h-screen bg-gray-800 text-white flex flex-col items-center justify-center w-full">
      <QuadrantContainer />
      <ContextMenu />
    </div>
  );
}

export default App;
