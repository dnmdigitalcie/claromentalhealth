import { getTodos } from "@/lib/services/todos-service"
import TodoList from "@/components/todos/todo-list"

export default async function TodosPage() {
  const { data: todos, error } = await getTodos()

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Todo List</h1>

      {error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error loading todos: {error}
        </div>
      ) : (
        <TodoList initialTodos={todos || []} />
      )}
    </div>
  )
}
