
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { list as listIcon } from "lucide-react";

// Demo data
type Task = {
  id: string;
  title: string;
  priority: string;
  status: string;
  company?: string;
  contact?: string;
  dueDate?: string;
};

const demoTasks: Task[] = [
  { id: "1", title: "Call Michael Becker", priority: "High", status: "Open", contact: "Michael Becker", dueDate: "2024-07-01" },
  { id: "2", title: "Review contract from Müller Hausverwaltung", priority: "Medium", status: "In Progress", company: "Müller Hausverwaltung" },
];

const TaskManager: React.FC = () => {
  const [selected, setSelected] = useState<Task | null>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tasks</CardTitle>
        <CardDescription>Keep track of your CRM-related tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-[300px] w-full text-sm">
            <thead>
              <tr className="text-muted-foreground">
                <th className="py-2 px-2 text-left">Title</th>
                <th className="py-2 px-2 text-left">Priority</th>
                <th className="py-2 px-2 text-left">Status</th>
                <th className="py-2 px-2 text-left">Due</th>
                <th className="py-2 px-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {demoTasks.map((task) => (
                <tr key={task.id} className="border-b hover:bg-muted/40">
                  <td className="py-2 px-2">{task.title}</td>
                  <td className="py-2 px-2">{task.priority}</td>
                  <td className="py-2 px-2">{task.status}</td>
                  <td className="py-2 px-2">{task.dueDate ? task.dueDate : "-"}</td>
                  <td className="py-2 px-2">
                    <Button size="sm" variant="outline" onClick={() => setSelected(task)}>View details</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {selected && (
            <div className="mt-6 p-4 bg-muted rounded">
              <h4 className="font-semibold mb-2 flex gap-2 items-center">
                <listIcon className="h-4 w-4" /> Task Details
              </h4>
              <div>Title: <b>{selected.title}</b></div>
              <div>Status: {selected.status}</div>
              <div>Priority: {selected.priority}</div>
              <div>
                Linked to: 
                {selected.contact && <span>Contact: <b>{selected.contact}</b> </span>}
                {selected.company && <span>Company: <b>{selected.company}</b></span>}
              </div>
              <div>Due date: {selected.dueDate ? selected.dueDate : "N/A"}</div>
              <Button size="sm" className="mt-4" onClick={() => setSelected(null)}>Close</Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskManager;
