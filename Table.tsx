import React, { useState, useEffect, ChangeEvent } from "react";

interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export default function App() {
  const URL = "https://jsonplaceholder.typicode.com/todos";
  const [data, setData] = useState<Todo[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [filterData, setFilterData] = useState<Todo[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  useEffect(() => {
    fetch(URL)
      .then((response) => response.json())
      .then((res: Todo[]) => {
        setData(res);
        setFilterData(res);
      });
  }, []);

  // Search function
  const handleSearch = (serTxt: string) => {
    setSearchText(serTxt);
    const filteredData = data.filter((res) =>
      res.title.startsWith(serTxt)
    );
    setFilterData(filteredData);
    setCurrentPage(1); 
  };

  // Sorting function
  const handleSort = () => {
    const sortedData = [...filterData].sort((a, b) => {
      if (sortOrder === "asc") {
        return a.title.localeCompare(b.title);
      } else {
        return b.title.localeCompare(a.title);
      }
    });
    setFilterData(sortedData);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filterData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="App">
      <h1>Table-sort-pagination</h1>
      <div style={{ padding: "20px" }}>
        <input
          placeholder="Please Search"
          value={searchText}
          onChange={(e:any) =>
            handleSearch(e.target.value)
          }
        />
      </div>
      <table style={{ border: "2px solid black" }}>
        <thead>
          <tr style={{ border: "2px solid black" }}>
            <td
              style={{ border: "2px solid black", cursor: "pointer" }}
              onClick={handleSort}
            >
              Title {sortOrder === "asc" ? "▲" : "▼"}
            </td>
            <td style={{ border: "2px solid black" }}>Completed</td>
          </tr>
        </thead>
        <tbody>
          {currentItems &&
            currentItems.map((item) => (
              <tr style={{ border: "2px solid black" }} key={item.id}>
                <td style={{ border: "2px solid black" }}>{item.title}</td>
                <td style={{ border: "2px solid black" }}>
                  {item.completed ? 1 : 0}
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <div style={{ marginTop: "20px" }}>
        {Array.from({
          length: Math.ceil(filterData.length / itemsPerPage),
        }).map((_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            style={{
              margin: "0 5px",
              backgroundColor: currentPage === index + 1 ? "gray" : "white",
            }}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
