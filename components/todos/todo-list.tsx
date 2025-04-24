"use client"

import type React from "react"

import { useState } from "react"
import { type Todo, addTodo, updateTodoStatus, deleteTodo } from "@/lib/services/todos-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2 } from "lucide-react"

interface TodoListProps {
  initialTodos: Todo[]
}

export default function TodoList({ initialTodos }: TodoListProps) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos)
  const [newTask, setNewTask] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTask.trim()) return

    setIsLoading(true)
    setError(null)

    const { data, error } = await addTodo(newTask)

    setIsLoading(false)

    if (error) {
      setError(error)
      return
    }

    if (data) {
      setTodos([...todos, ...data])
      setNewTask("")
    }
  }

  const handleToggleComplete = async (id: number, currentStatus: boolean) => {
    const { data, error } = await updateTodoStatus(id, !currentStatus)

    if (error) {
      setError(error)
      return
    }

    if (data) {
      setTodos(todos.map((todo) => (todo.id === id ? data[0] : todo)))
    }
  }

  const handleDeleteTodo = async (id: number) => {
    const { success, error } = await deleteTodo(id)

    if (error) {
      setError(error)
      return
    }

    if (success) {
      setTodos(todos.filter((todo) => todo.id !== id))
    }
  }

  return (
    <div>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleAddTodo} className="flex gap-2 mb-6">
        <Input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          disabled={isLoading}
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Adding..." : "Add Task"}
        </Button>
      </form>

      <ul className="space-y-2">
        {todos.length === 0 ? (
          <li className="text-gray-500">No todos yet. Add one above!</li>
        ) : (
          todos.map((todo) => (
            <li key={todo.id} className="flex items-center justify-between p-3 border rounded hover:bg-gray-50">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={todo.is_complete}
                  onCheckedChange={() => handleToggleComplete(todo.id, todo.is_complete)}
                  id={`todo-${todo.id}`}
                />
                <label
                  htmlFor={`todo-${todo.id}`}
                  className={`${todo.is_complete ? "line-through text-gray-500" : ""}`}
                >
                  {todo.task}
                </label>
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleDeleteTodo(todo.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}
