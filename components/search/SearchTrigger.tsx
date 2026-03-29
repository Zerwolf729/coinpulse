"use client";

import { Search } from "lucide-react";
import { useSearch } from "./SearchProvider";

const SearchTrigger = () => {
  const { setOpen } = useSearch();

  return (
    <button
      onClick={() => setOpen(true)}
      className="nav-link flex items-center gap-2"
    >
      <Search size={16} />
      Search
      <kbd className="kbd">⌘K</kbd>
    </button>
  );
};

export default SearchTrigger;
