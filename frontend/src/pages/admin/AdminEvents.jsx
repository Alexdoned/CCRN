import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Heading,
  Stack,
  Button,
  SimpleGrid,
  Input,
  Textarea,
  Flex,
  Text,
  IconButton,
  
} from "@chakra-ui/react";
import axios from "axios";
import { LuPlus, LuEdit, LuTrash } from "react-icons/lu";
import { toaster } from "../../components/ui/toaster";

const API = "http://localhost:5000/api/events";

export const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", description: "", date: "", venue: "", imageUrl: "" });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const token = localStorage.getItem("adminToken");

  const fetchEvents = async () => {
    try {
      const res = await axios.get(API);
      setEvents(res.data.data || []);
    } catch (err) {
      console.error(err);
      toaster.create({ title: "Error", description: "Could not load events.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  const openCreate = () => { setEditingId(null); setForm({ title: "", description: "", date: "", venue: "", imageUrl: "" }); setShowForm(true); };
  const openEdit = (ev) => { setEditingId(ev._id); setForm({ title: ev.title, description: ev.description, date: new Date(ev.date).toISOString().slice(0,16), venue: ev.venue, imageUrl: ev.imageUrl }); setShowForm(true); };

  const handleSubmit = async () => {
    try {
      if (!form.title || !form.description || !form.date || !form.venue) {
        toaster.create({ title: "Validation", description: "Please fill required fields.", type: "error" });
        return;
      }
      const payload = { ...form };
      if (editingId) {
        const res = await axios.put(`${API}/${editingId}`, payload, { headers: { Authorization: `Bearer ${token}` } });
        toaster.create({ title: "Updated", description: "Event updated.", type: "success" });
      } else {
        const res = await axios.post(API, payload, { headers: { Authorization: `Bearer ${token}` } });
        toaster.create({ title: "Created", description: "Event created.", type: "success" });
      }
      setShowForm(false); fetchEvents();
    } catch (err) {
      console.error(err);
      toaster.create({ title: "Error", description: err.response?.data?.message || "Request failed.", type: "error" });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this event?")) return;
    try {
      await axios.delete(`${API}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toaster.create({ title: "Deleted", description: "Event removed.", type: "success" });
      fetchEvents();
    } catch (err) {
      console.error(err);
      toaster.create({ title: "Error", description: "Could not delete event.", type: "error" });
    }
  };

  return (
    <Box bg="rgb(10, 15, 30)" color="white" minH="calc(100vh - 64px)" py={12}>
      <Container maxW="6xl">
        <Stack spacing={6}>
          <Flex justify="space-between" align="center">
            <Heading as="h2" size="lg">Admin — Events</Heading>
            <Button leftIcon={<LuPlus />} colorScheme="cyan" onClick={openCreate}>New Event</Button>
          </Flex>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
            {events.map((ev) => (
              <Box key={ev._id} bg="rgba(255,255,255,0.02)" p={4} borderRadius="lg" border="1px solid rgba(255,255,255,0.04)">
                <Flex justify="space-between">
                  <Box>
                    <Text fontWeight="bold">{ev.title}</Text>
                    <Text fontSize="sm" color="gray.400">{new Date(ev.date).toLocaleString()}</Text>
                    <Text mt={2} noOfLines={3}>{ev.description}</Text>
                  </Box>
                  <Stack>
                    <IconButton aria-label="edit" icon={<LuEdit />} onClick={() => openEdit(ev)} />
                    <IconButton aria-label="delete" icon={<LuTrash />} onClick={() => handleDelete(ev._id)} />
                  </Stack>
                </Flex>
              </Box>
            ))}
          </SimpleGrid>
        </Stack>
      </Container>

      {showForm && (
        <Box mt={8} p={4} bg="rgba(255,255,255,0.02)" borderRadius="lg" border="1px solid rgba(255,255,255,0.04)">
          <Heading size="sm" mb={3}>{editingId ? "Edit Event" : "Create Event"}</Heading>
          <Stack spacing={3}>
            <Input placeholder="Title" value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})} />
            <Textarea placeholder="Description" value={form.description} onChange={(e)=>setForm({...form,description:e.target.value})} />
            <Input type="datetime-local" value={form.date} onChange={(e)=>setForm({...form,date:e.target.value})} />
            <Input placeholder="Venue" value={form.venue} onChange={(e)=>setForm({...form,venue:e.target.value})} />
            <Input placeholder="Image URL" value={form.imageUrl} onChange={(e)=>setForm({...form,imageUrl:e.target.value})} />
            <Flex justify="flex-end" gap={3} mt={2}>
              <Button variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button colorScheme="cyan" onClick={handleSubmit}>{editingId ? "Update" : "Create"}</Button>
            </Flex>
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default AdminEvents;
