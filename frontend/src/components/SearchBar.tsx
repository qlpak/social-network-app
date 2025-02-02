import { useState } from "react";

interface SearchBarProps {
  onSearch: (filters: {
    first_name?: string;
    last_name?: string;
    city?: string;
    age?: string | number;
  }) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [filters, setFilters] = useState({
    first_name: "",
    last_name: "",
    city: "",
    age: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: name === "age" ? Number(value) || "" : value,
    });
  };

  return (
    <div className="flex flex-wrap gap-4 p-4 bg-gray-200 rounded-lg">
      <input
        type="text"
        name="first_name"
        placeholder="First Name"
        value={filters.first_name}
        onChange={handleChange}
        className="p-2 border rounded"
      />
      <input
        type="text"
        name="last_name"
        placeholder="Last Name"
        value={filters.last_name}
        onChange={handleChange}
        className="p-2 border rounded"
      />
      <input
        type="text"
        name="city"
        placeholder="City"
        value={filters.city}
        onChange={handleChange}
        className="p-2 border rounded"
      />
      <input
        type="number"
        name="age"
        placeholder="Age"
        value={filters.age}
        onChange={handleChange}
        className="p-2 border rounded"
      />
      <button
        onClick={() => onSearch(filters)}
        className="p-2 bg-blue-500 text-white rounded"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
