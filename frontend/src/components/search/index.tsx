import { useDispatch } from "react-redux";
import { setSearchQuery } from "@/redux/slices/taskSlice";

const SearchBar: React.FC = () => {
  const dispatch = useDispatch();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value));
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search tasks..."
        onChange={handleSearchChange}
        className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800"
      />
    </div>
  );
};

export default SearchBar;
