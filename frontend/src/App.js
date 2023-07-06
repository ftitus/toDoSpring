import React, { useState, useEffect } from "react";
import "./App.css"; // Import the CSS file for styling

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    fetch("/api/todo")
      .then((response) => response.json())
      .then((data) => setTodos(data));
  }, []);

  const handleInputChange = (event) => {
    setNewTodo(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!newTodo.trim()) return;

    const todoItem = { title: newTodo, completed: false };

    fetch("/api/todo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todoItem),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error adding todo");
        }
        return response.json();
      })
      .then((data) => {
        setTodos((prevTodos) => [...prevTodos, data]); // Use functional update to ensure previous state is updated correctly
        setNewTodo("");
      })
      .catch((error) => console.error(error));
  };

  const handleComplete = (todoId) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === todoId) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });

    setTodos(updatedTodos);
  };

  const handleRemove = (todoId) => {
    fetch(`/api/todo/${todoId}`, {
      method: "DELETE",
    })
      .then(() => {
        const updatedTodos = todos.filter((todo) => todo.id !== todoId);
        setTodos(updatedTodos);
      })
      .catch((error) => console.error("Error deleting todo:", error));
  };

  return (
    <div className="app-container">
      <h1>To-Do List</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newTodo}
          onChange={handleInputChange}
          placeholder="Add a new task"
        />
        <button type="submit">Add</button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} className={todo.completed ? "completed" : ""}>
            <span onClick={() => handleComplete(todo.id)}>{todo.title}</span>
            <button onClick={() => handleRemove(todo.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
