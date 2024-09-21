

import { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { Progress } from "@/components/ui/progress"
import { CalendarIcon, Trash2Icon } from 'lucide-react'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose
} from "@/components/ui/dialog"
import axios from 'axios'
import { logout } from '@/store/slices/authSlice'
import { useDispatch } from 'react-redux'

type Todo = {
  id: string
  title: string
  description: string
  dueDate: string
  status: 'Pending' | 'In Progress' | 'Completed'
}

type Column = {
  id: 'Pending' | 'In Progress' | 'Completed'
  title: string
}

const columns: Column[] = [
  { id: 'Pending', title: 'Pending' },
  { id: 'In Progress', title: 'In Progress' },
  { id: 'Completed', title: 'Completed' },
]
const  token  = localStorage.getItem('token')
export default function Todo() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState<Omit<Todo, 'id'>>({
    title: '',
    description: '',
    dueDate: '',
    status: 'Pending',
  })

  const dispatch = useDispatch()

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/todos`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }}); // Replace with your API endpoint
        setTodos(response.data);
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };

    fetchTodos();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewTodo({ ...newTodo, [e.target.name]: e.target.value })
  }

  const logoutOut = () => {
    dispatch(logout())
  }

  const handleStatusChange = (value: string) => {
    setNewTodo({ ...newTodo, status: value as Todo['status'] })
  }

  const handleAddTodo = async () => {
    if (newTodo.title.trim() === '') return

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/todos`, newTodo,{
        headers: {
          Authorization: `Bearer ${token}`,
        }}); // Replace with your API endpoint
      setTodos([...todos, response.data]);
      setNewTodo({ title: '', description: '', dueDate: '', status: 'Pending' });
    } catch (error) {
      console.error('Error adding todo:', error);
    }
    // setTodos([...todos, { ...newTodo, id: Date.now().toString() }])
    // setNewTodo({ title: '', description: '', dueDate: '', status: 'Pending' })
  }

  const handleDeleteTodo = async (id: string) => {
    // setTodos(todos.filter(todo => todo.id !== id))
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/todos/${id}`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }); // Replace with your API endpoint
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  }

  const onDragEnd = (result: any) => {
    if (!result.destination) return

    const newTodos = Array.from(todos)
    const [reorderedItem] = newTodos.splice(result.source.index, 1)
    reorderedItem.status = result.destination.droppableId as Todo['status']
    newTodos.splice(result.destination.index, 0, reorderedItem)

    setTodos(newTodos)
  }

  const getCompletionData = () => {
    const data: { [key: string]: { date: string, completed: number, total: number } } = {}
    todos.forEach(todo => {
      const date = todo.dueDate
      if (!data[date]) {
        data[date] = { date, completed: 0, total: 0 }
      }
      data[date].total++
      if (todo.status === 'Completed') {
        data[date].completed++
      }
    })
    return Object.values(data).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }

  const completedPercentage = Math.round((todos.filter(todo => todo.status === 'Completed').length / todos.length) * 100) || 0

  return (
    <div className='teal-gradient'>

      <div className="container mx-auto p-4 ">

        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-white ">Todo Management</h1>


          <Menubar>
            <MenubarMenu>
              <MenubarTrigger>
                <div className="flex items-center space-x-2">
                  <Avatar>
                    <AvatarImage src="/path-to-user-image.jpg" alt={'Aryan Hussain'} />
                    <AvatarFallback>AH</AvatarFallback>
                  </Avatar>
                  <div className="text-lg font-medium text-muted-foreground">
                    Aryan Hussain
                  </div>
                </div>
              </MenubarTrigger>
              <MenubarContent>

                

                <MenubarSeparator />
                <MenubarSub >
                  <MenubarSubTrigger onClick={logoutOut}>Logout</MenubarSubTrigger>
                  <MenubarSubContent className='hidden'>
                    {/* <MenubarItem>Email link</MenubarItem>
            <MenubarItem>Messages</MenubarItem>
            <MenubarItem>Notes</MenubarItem> */}
                  </MenubarSubContent>
                </MenubarSub>


              </MenubarContent>
            </MenubarMenu>

          </Menubar>

        </div>

        <div className="mb-8">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Add New Todo</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Todo</DialogTitle>
                <DialogDescription>
                  Fill out the form below to add a new todo item.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <Input
                  name="title"
                  placeholder="Title"
                  value={newTodo.title}
                  onChange={handleInputChange}
                />
                <Textarea
                  name="description"
                  placeholder="Description"
                  value={newTodo.description}
                  onChange={handleInputChange}
                />
                <div className="flex gap-4">
                  <Input
                    name="dueDate"
                    type="date"
                    value={newTodo.dueDate}
                    onChange={handleInputChange}
                  />
                  <Select onValueChange={handleStatusChange} value={newTodo.status}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {columns.map(column => (
                        <SelectItem key={column.id} value={column.id}>
                          {column.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button onClick={handleAddTodo}>Add Todo</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add New Todo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <Input
                name="title"
                placeholder="Title"
                value={newTodo.title}
                onChange={handleInputChange}
              />
              <Textarea
                name="description"
                placeholder="Description"
                value={newTodo.description}
                onChange={handleInputChange}
              />
              <div className="flex gap-4">
                <Input
                  name="dueDate"
                  type="date"
                  value={newTodo.dueDate}
                  onChange={handleInputChange}
                />
                <Select onValueChange={handleStatusChange} value={newTodo.status}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {columns.map(column => (
                      <SelectItem key={column.id} value={column.id}>
                        {column.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddTodo}>Add Todo</Button>
            </div>
          </CardContent>
        </Card> */}

        <Card className='mb-5'>
          <CardHeader>
            <CardTitle>Overall Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={completedPercentage} className="w-full" />
            <p className="text-center mt-2">{completedPercentage}% Completed</p>
          </CardContent>
        </Card>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {columns.map(column => (
              <Card key={column.id}>
                <CardHeader>
                  <CardTitle>{column.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Droppable droppableId={column.id}>
                    {(provided) => (
                      <ul {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                        {todos.filter(todo => todo.status === column.id).map((todo, index) => (
                          <Draggable key={todo.id} draggableId={todo.id} index={index}>
                            {(provided) => (
                              <li
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="bg-secondary p-2 rounded"
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-semibold">{todo.title}</h3>
                                    <p className="text-sm text-muted-foreground">{todo.description}</p>
                                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                                      <CalendarIcon className="w-3 h-3 mr-1" />
                                      {todo.dueDate}
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDeleteTodo(todo.id)}
                                  >
                                    <Trash2Icon className="w-4 h-4" />
                                  </Button>
                                </div>
                              </li>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </ul>
                    )}
                  </Droppable>
                </CardContent>
              </Card>
            ))}
          </div>
        </DragDropContext>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Todo Completion Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getCompletionData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" fill="#4CAF50" name="Completed" />
                <Bar dataKey="total" fill="#2196F3" name="Total" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>


      </div>

    </div>

  )
}