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
  Dialog,
  Portal,
} from "@chakra-ui/react";
import axios from "axios";
import { LuPlus, LuPencil, LuTrash, LuX, LuAlertTriangle } from "react-icons/lu";
import { toaster } from "../../components/ui/toaster";

const API = "http://localhost:5000/api/events";

export const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", description: "", date: "", venue: "", imageUrl: "" });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Delete dialog state
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [pendingDeleteTitle, setPendingDeleteTitle] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const token = localStorage.getItem("adminToken");

  const fetchEvents = async () => {
    try {
      const res = await axios.get(API);
      setEvents(res.data.data || []);
    } catch (err) {
      toaster.create({ title: "Error", description: "Could not load events.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm({ title: "", description: "", date: "", venue: "", imageUrl: "" });
    setShowForm(true);
  };

  const openEdit = (ev) => {
    setEditingId(ev._id);
    setForm({
      title: ev.title,
      description: ev.description,
      date: new Date(ev.date).toISOString().slice(0, 16),
      venue: ev.venue,
      imageUrl: ev.imageUrl,
    });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    try {
      if (!form.title || !form.description || !form.date || !form.venue || !form.imageUrl) {
        toaster.create({ title: "Validation", description: "Please fill all required fields, including image URL.", type: "error" });
        return;
      }
      const payload = { ...form };
      if (editingId) {
        await axios.put(`${API}/${editingId}`, payload, { headers: { Authorization: `Bearer ${token}` } });
        toaster.create({ title: "Updated", description: "Event updated.", type: "success" });
      } else {
        await axios.post(API, payload, { headers: { Authorization: `Bearer ${token}` } });
        toaster.create({ title: "Created", description: "Event created.", type: "success" });
      }
      setShowForm(false);
      fetchEvents();
    } catch (err) {
      toaster.create({ title: "Error", description: err.response?.data?.message || "Request failed.", type: "error" });
    }
  };

  // Step 1: open the dialog
  const confirmDelete = (ev) => {
    setPendingDeleteId(ev._id);
    setPendingDeleteTitle(ev.title);
  };

  // Step 2: user clicked "Delete" inside dialog
  const handleDelete = async () => {
    if (!pendingDeleteId) return;
    setIsDeleting(true);
    try {
      await axios.delete(`${API}/${pendingDeleteId}`, { headers: { Authorization: `Bearer ${token}` } });
      toaster.create({ title: "Deleted", description: `"${pendingDeleteTitle}" has been removed.`, type: "success" });
      setPendingDeleteId(null);
      setPendingDeleteTitle("");
      fetchEvents();
    } catch (err) {
      toaster.create({ title: "Error", description: "Could not delete event.", type: "error" });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Box bg="rgb(10, 15, 30)" color="white" minH="calc(100vh - 64px)" py={12}>
      <Container maxW="6xl">
        <Stack gap={6}>
          <Flex justify="space-between" align="center">
            <Heading as="h2" size="lg">Admin — Events</Heading>
            <Button bg="cyan.600" color="white" _hover={{ bg: "cyan.500" }} onClick={openCreate}>
              <LuPlus style={{ marginRight: "6px" }} /> New Event
            </Button>
          </Flex>

          {/* Inline Create / Edit Form */}
          {showForm && (
            <Box bg="rgba(255,255,255,0.03)" borderRadius="xl" border="1px solid rgba(255,255,255,0.08)" p={6}>
              <Flex justify="space-between" align="center" mb={4}>
                <Heading size="md">{editingId ? "Edit Event" : "Create Event"}</Heading>
                <IconButton aria-label="close" variant="ghost" color="white" onClick={() => setShowForm(false)}>
                  <LuX />
                </IconButton>
              </Flex>
              <Stack gap={3}>
                <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} bg="rgba(255,255,255,0.03)" borderColor="rgba(255,255,255,0.1)" color="white" />
                <Textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} bg="rgba(255,255,255,0.03)" borderColor="rgba(255,255,255,0.1)" color="white" rows={3} />
                <Input type="datetime-local" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} bg="rgba(255,255,255,0.03)" borderColor="rgba(255,255,255,0.1)" color="white" />
                <Input placeholder="Venue" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} bg="rgba(255,255,255,0.03)" borderColor="rgba(255,255,255,0.1)" color="white" />
                <Input placeholder="Image URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} bg="rgba(255,255,255,0.03)" borderColor="rgba(255,255,255,0.1)" color="white" />
                <Flex justify="flex-end" gap={3} mt={2}>
                  <Button variant="ghost" color="white" onClick={() => setShowForm(false)}>Cancel</Button>
                  <Button bg="cyan.600" color="white" _hover={{ bg: "cyan.500" }} onClick={handleSubmit}>
                    {editingId ? "Update" : "Create"}
                  </Button>
                </Flex>
              </Stack>
            </Box>
          )}

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
            {events.map((ev) => (
              <Box key={ev._id} bg="rgba(255,255,255,0.02)" p={4} borderRadius="lg" border="1px solid rgba(255,255,255,0.06)">
                <Flex justify="space-between">
                  <Box flex="1" mr={3}>
                    <Text fontWeight="bold">{ev.title}</Text>
                    <Text fontSize="sm" color="gray.400">{new Date(ev.date).toLocaleString()}</Text>
                    <Text mt={2} fontSize="sm" color="gray.300">{ev.description}</Text>
                  </Box>
                  <Stack gap={2}>
                    <IconButton aria-label="edit" size="sm" variant="ghost" color="cyan.400" onClick={() => openEdit(ev)}>
                      <LuPencil />
                    </IconButton>
                    <IconButton aria-label="delete" size="sm" variant="ghost" color="red.400" onClick={() => confirmDelete(ev)}>
                      <LuTrash />
                    </IconButton>
                  </Stack>
                </Flex>
              </Box>
            ))}
          </SimpleGrid>
        </Stack>
      </Container>

      {/* ── Delete Confirmation Dialog ── */}
      <Dialog.Root
        open={!!pendingDeleteId}
        onOpenChange={(details) => { if (!details.open) { setPendingDeleteId(null); setPendingDeleteTitle(""); } }}
        role="alertdialog"
      >
        <Portal>
          <Dialog.Backdrop bg="rgba(0,0,0,0.7)" backdropFilter="blur(4px)" />
          <Dialog.Positioner>
            <Dialog.Content
              bg="rgb(18, 24, 45)"
              border="1px solid rgba(255,255,255,0.08)"
              borderRadius="2xl"
              boxShadow="0 25px 60px rgba(0,0,0,0.6)"
              maxW="sm"
              w="full"
              mx={4}
            >
              {/* Header */}
              <Dialog.Header pb={0} pt={6} px={6}>
                <Flex align="center" gap={3}>
                  <Flex
                    w={10} h={10} borderRadius="full"
                    bg="rgba(239, 68, 68, 0.12)"
                    border="1px solid rgba(239, 68, 68, 0.3)"
                    align="center" justify="center" flexShrink={0}
                  >
                    <LuAlertTriangle size={18} color="#f87171" />
                  </Flex>
                  <Dialog.Title color="white" fontWeight="bold" fontSize="lg">
                    Delete Event
                  </Dialog.Title>
                </Flex>
              </Dialog.Header>

              {/* Body */}
              <Dialog.Body px={6} py={4}>
                <Text color="gray.400" fontSize="sm" lineHeight="tall">
                  Are you sure you want to delete{" "}
                  <Text as="span" color="white" fontWeight="semibold">"{pendingDeleteTitle}"</Text>?
                  {" "}This action cannot be undone.
                </Text>
              </Dialog.Body>

              {/* Footer */}
              <Dialog.Footer px={6} pb={6} pt={2} gap={3}>
                <Dialog.ActionTrigger asChild>
                  <Button
                    variant="outline"
                    borderColor="rgba(255,255,255,0.15)"
                    color="gray.300"
                    _hover={{ bg: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.3)" }}
                    flex={1}
                    disabled={isDeleting}
                  >
                    Cancel
                  </Button>
                </Dialog.ActionTrigger>
                <Button
                  bg="red.600"
                  color="white"
                  _hover={{ bg: "red.500" }}
                  flex={1}
                  loading={isDeleting}
                  loadingText="Deleting..."
                  onClick={handleDelete}
                >
                  <LuTrash style={{ marginRight: "6px" }} /> Delete
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Box>
  );
};

export default AdminEvents;
