import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

// Mock data - replace with actual API calls in a real application
const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
];

const mockTodos = [
  { id: 1, userId: 1, title: 'Complete project', description: 'sfdsdfsdfsfsd',status: 'In Progress', dueDate: '2024-10-01' },
  { id: 2, userId: 1, title: 'Buy groceries',description: 'dfsfsdfsdfsf', status: 'Pending', dueDate: '2024-09-25' },
  { id: 3, userId: 2, title: 'Schedule meeting',description: 'sfsdfsfsdfsd', status: 'Completed', dueDate: '2024-09-20' },
];
const token = localStorage.getItem('token')
const AdminPanel = () => {
  const [users, setUsers] = useState(mockUsers);
  const [todos, setTodos] = useState(mockTodos);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newTodo, setNewTodo] = useState({ title: '', status: 'Pending', dueDate: '' });
  const [editingTodo, setEditingTodo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}` // Assuming it's a Bearer token, modify this if the token type is different
          }
        };
        const [usersResponse, todosResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/users`,config), // Replace with your API endpoint
          axios.get(`${import.meta.env.VITE_API_URL}/todos`,config), // Replace with your API endpoint
        ]);
        setUsers(usersResponse.data);
        setTodos(todosResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleAddTodo = async() => {
    // if (selectedUser && newTodo.title) {
    //   const todo = {
    //     id: todos.length + 1,
    //     userId: selectedUser.id,
    //     ...newTodo
    //   };
    //   setTodos([...todos, todo]);
    //   setNewTodo({ title: '', status: 'Pending', dueDate: '' });
    // }
    if (selectedUser && newTodo.title) {
      const todo = {
        userId: selectedUser.id,
        ...newTodo,
      };
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}` // Assuming it's a Bearer token, modify if necessary
          }
        };
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/todos`, todo,config); // Replace with your API endpoint
        setTodos([...todos, response.data]);
        setNewTodo({ title: '', status: 'Pending', dueDate: '' });
      } catch (error) {
        console.error('Error adding todo:', error);
      }
    }
  };

  const handleUpdateTodo = async() => {
    // if (editingTodo) {
    //   setTodos(todos.map(todo => todo.id === editingTodo.id ? editingTodo : todo));
    //   setEditingTodo(null);
    // }
    if (editingTodo) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}` // Assuming it's a Bearer token, modify if necessary
          }
        };
        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/todos/${editingTodo.id}`,config,
          editingTodo
        ); // Replace with your API endpoint
        setTodos(
          todos.map((todo) =>
            todo.id === editingTodo.id ? response.data : todo
          )
        );
        setEditingTodo(null);
      } catch (error) {
        console.error('Error updating todo:', error);
      }
    }
  };

  const handleDeleteTodo = async(id) => {
    // setTodos(todos.filter(todo => todo.id !== id));
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}` // Assuming it's a Bearer token, modify if necessary
        }
      };
      await axios.delete(`${import.meta.env.VITE_API_URL}/todos/${id}`,config); // Replace with your API endpoint
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  // const getUserTodos = (userId) => todos.filter(todo => todo.userId === userId);
   
  const getUserTodos = (userId) => {
    if (!userId) return [];
    return todos.filter((todo) => todo.userId === userId);
  };
  

  const getStatusCounts = () => {
    const counts = { Pending: 0, 'In Progress': 0, Completed: 0 };
    todos.forEach(todo => counts[todo.status]++);
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 teal-gradient p-6">
      <Card className="w-full h-full mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Admin Panel</CardTitle>
          <CardDescription>Manage users and their todos</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="users">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="chart">Chart</TabsTrigger>
            </TabsList>
            <TabsContent value="users">
              <div className="grid grid-cols-3 gap-4">
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {users.map(user => (
                        <li key={user.id}>
                          <Button
                            variant={selectedUser?.id === user.id ? "default" : "outline"}
                            className="w-full justify-start"
                            onClick={() => setSelectedUser(user)}
                          >
                            {user.name}
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                <Card className="col-span-2">
                  <CardHeader>
                    <CardTitle>{selectedUser ? `${selectedUser.name}'s Todos` : 'Todos'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedUser && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="mb-4">Add Todo</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add New Todo</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="title" className="text-right">Title</Label>
                              <Input id="title" className="col-span-3" value={newTodo.title} onChange={(e) => setNewTodo({...newTodo, title: e.target.value})} />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="status" className="text-right">Status</Label>
                              <Select onValueChange={(value) => setNewTodo({...newTodo, status: value})}>
                                <SelectTrigger className="col-span-3">
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Pending">Pending</SelectItem>
                                  <SelectItem value="In Progress">In Progress</SelectItem>
                                  <SelectItem value="Completed">Completed</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="dueDate" className="text-right">Due Date</Label>
                              <Input id="dueDate" type="date" className="col-span-3" value={newTodo.dueDate} onChange={(e) => setNewTodo({...newTodo, dueDate: e.target.value})} />
                            </div>
                          </div>
                          <Button onClick={handleAddTodo}>Add Todo</Button>
                        </DialogContent>
                      </Dialog>
                    )}
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Due Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getUserTodos(selectedUser?.id).map(todo => (
                          <TableRow key={todo.id}>
                            <TableCell>{todo.title}</TableCell>
                            <TableCell>{todo.status}</TableCell>
                            <TableCell>{todo.dueDate}</TableCell>
                            <TableCell>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" className="mr-2">Edit</Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Edit Todo</DialogTitle>
                                  </DialogHeader>
                                  <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="edit-title" className="text-right">Title</Label>
                                      <Input id="edit-title" className="col-span-3" value={editingTodo?.title} onChange={(e) => setEditingTodo({...editingTodo, title: e.target.value})} />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="edit-status" className="text-right">Status</Label>
                                      <Select onValueChange={(value) => setEditingTodo({...editingTodo, status: value})}>
                                        <SelectTrigger className="col-span-3">
                                          <SelectValue placeholder={editingTodo?.status} />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="Pending">Pending</SelectItem>
                                          <SelectItem value="In Progress">In Progress</SelectItem>
                                          <SelectItem value="Completed">Completed</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="edit-dueDate" className="text-right">Due Date</Label>
                                      <Input id="edit-dueDate" type="date" className="col-span-3" value={editingTodo?.dueDate} onChange={(e) => setEditingTodo({...editingTodo, dueDate: e.target.value})} />
                                    </div>
                                  </div>
                                  <Button onClick={handleUpdateTodo}>Update Todo</Button>
                                </DialogContent>
                              </Dialog>
                              <Button variant="destructive" onClick={() => handleDeleteTodo(todo.id)}>Delete</Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="chart">
              <Card>
                <CardHeader>
                  <CardTitle>Todo Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getStatusCounts()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPanel;