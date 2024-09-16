import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// Definimos el tipo de tarea
interface Task {
  id: number;
  text: string;
}

// Simulamos una llamada a una API con un retraso y un fallo aleatorio
const mockCreateTask = (newTask: Task): Promise<Task> =>
  new Promise((resolve, reject) => {
    const shouldFail = Math.random() < 0.5; // 50% de probabilidad de falla
    setTimeout(() => {
      if (shouldFail) {
        reject("Error: La API ha fallado.");
      } else {
        resolve(newTask);
      }
    }, 3000); // 3 segundos
  });


const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [task, setTask] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const addTask = async () => {
    if (!task) return;

    // Optimistic Response: Creación de una nueva tarea localmente
    const newTask: Task = { id: Date.now(), text: task };

    setTask(""); // Limpiamos el input

    setIsLoading(true);
    try {
      const task = await mockCreateTask(newTask); // Simulamos la llamada al servidor
      setTasks((prev) => [...prev, task]); // Añadimos la tarea optimistamente
    } catch (error) {
      alert(error)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
          <CardDescription>Optimistic tasks test.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            <Input
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Agregar nueva tarea"
            />
            <Button onClick={addTask} disabled={isLoading}>
              {isLoading ? "Agregando..." : "Agregar"}
            </Button>
          </div>
          <ul className="mt-4 space-y-2">
            {tasks.map((t) => (
              <li key={t.id} className="bg-gray-100 p-2 rounded-md">
                {t.text}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default App;