import { useEffect, useState } from "react";
import axios from "axios";

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
  Spinner,
} from "@chakra-ui/react";

import {
  LuPlus,
  LuPencil,
  LuTrash,
  LuX,
  LuTriangleAlert,
} from "react-icons/lu";

import { toaster } from "../../components/ui/toaster";

const API = "http://localhost:5000/api/events";

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    venue: "",
    imageUrl: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [pendingDeleteTitle, setPendingDeleteTitle] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const token = localStorage.getItem("adminToken");

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      date: "",
      venue: "",
      imageUrl: "",
    });

    setEditingId(null);
  };

  const closeDeleteDialog = () => {
    setPendingDeleteId(null);
    setPendingDeleteTitle("");
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);

      const res = await axios.get(API);

      setEvents(res.data.data || []);
    } catch (err) {
      console.error(err);

      toaster.create({
        title: "Error",
        description: "Could not load events.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const openCreate = () => {
    resetForm();
    setShowForm(true);
  };

  const openEdit = (event) => {
    setEditingId(event._id);

    setForm({
      title: event.title || "",
      description: event.description || "",
      date: event.date
        ? new Date(event.date).toISOString().slice(0, 16)
        : "",
      venue: event.venue || "",
      imageUrl: event.imageUrl || "",
    });

    setShowForm(true);
  };

  const handleSubmit = async () => {
    try {
      if (
        !form.title ||
        !form.description ||
        !form.date ||
        !form.venue ||
        !form.imageUrl
      ) {
        toaster.create({
          title: "Validation Error",
          description: "Please fill all required fields.",
          type: "error",
        });
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      if (editingId) {
        await axios.put(
          `${API}/${editingId}`,
          form,
          config
        );

        toaster.create({
          title: "Updated",
          description: "Event updated successfully.",
          type: "success",
        });
      } else {
        await axios.post(
          API,
          form,
          config
        );

        toaster.create({
          title: "Created",
          description: "Event created successfully.",
          type: "success",
        });
      }

      resetForm();
      setShowForm(false);

      fetchEvents();
    } catch (err) {
      console.error(err);

      toaster.create({
        title: "Error",
        description:
          err?.response?.data?.message ||
          err?.message ||
          "Request failed.",
        type: "error",
      });
    }
  };

  const confirmDelete = (event) => {
    setPendingDeleteId(event._id);
    setPendingDeleteTitle(event.title);
  };

  const handleDelete = async () => {
    if (!pendingDeleteId) return;

    try {
      setIsDeleting(true);

      await axios.delete(
        `${API}/${pendingDeleteId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toaster.create({
        title: "Deleted",
        description: `"${pendingDeleteTitle}" removed successfully.`,
        type: "success",
      });

      closeDeleteDialog();

      fetchEvents();
    } catch (err) {
      console.error(err);

      toaster.create({
        title: "Error",
        description:
          err?.response?.data?.message ||
          "Could not delete event.",
        type: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <Flex
        minH="100vh"
        justify="center"
        align="center"
      >
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Box
      bg="rgb(10,15,30)"
      color="white"
      minH="calc(100vh - 64px)"
      py={12}
    >
      <Container maxW="6xl">
        <Stack gap={6}>
          <Flex
            justify="space-between"
            align="center"
          >
            <Heading size="lg">
              Admin — Events
            </Heading>

            <Button
              colorPalette="cyan"
              onClick={openCreate}
            >
              <LuPlus />
              New Event
            </Button>
          </Flex>

          {showForm && (
            <Box
              bg="rgba(255,255,255,0.03)"
              borderRadius="xl"
              border="1px solid rgba(255,255,255,0.08)"
              p={6}
            >
              <Flex
                justify="space-between"
                align="center"
                mb={4}
              >
                <Heading size="md">
                  {editingId
                    ? "Edit Event"
                    : "Create Event"}
                </Heading>

                <IconButton
                  aria-label="Close Form"
                  variant="ghost"
                  onClick={() =>
                    setShowForm(false)
                  }
                >
                  <LuX />
                </IconButton>
              </Flex>

              <Stack gap={4}>
                <Input
                  placeholder="Title"
                  value={form.title}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      title: e.target.value,
                    })
                  }
                />

                <Textarea
                  placeholder="Description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description:
                        e.target.value,
                    })
                  }
                />

                <Input
                  type="datetime-local"
                  value={form.date}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      date: e.target.value,
                    })
                  }
                />

                <Input
                  placeholder="Venue"
                  value={form.venue}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      venue: e.target.value,
                    })
                  }
                />

                <Input
                  placeholder="Image URL"
                  value={form.imageUrl}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      imageUrl:
                        e.target.value,
                    })
                  }
                />

                <Flex
                  justify="flex-end"
                  gap={3}
                >
                  <Button
                    variant="outline"
                    onClick={() =>
                      setShowForm(false)
                    }
                  >
                    Cancel
                  </Button>

                  <Button
                    colorPalette="cyan"
                    onClick={handleSubmit}
                  >
                    {editingId
                      ? "Update"
                      : "Create"}
                  </Button>
                </Flex>
              </Stack>
            </Box>
          )}

          <SimpleGrid
            columns={{
              base: 1,
              md: 2,
            }}
            gap={6}
          >
            {events.map((event) => (
              <Box
                key={event._id}
                bg="rgba(255,255,255,0.03)"
                p={4}
                borderRadius="lg"
                border="1px solid rgba(255,255,255,0.08)"
              >
                <Flex
                  justify="space-between"
                  align="start"
                >
                  <Box flex="1">
                    <Text fontWeight="bold">
                      {event.title}
                    </Text>

                    <Text
                      fontSize="sm"
                      color="gray.400"
                    >
                      {new Date(
                        event.date
                      ).toLocaleString()}
                    </Text>

                    <Text
                      mt={2}
                      fontSize="sm"
                      color="gray.300"
                    >
                      {event.description}
                    </Text>

                    <Text
                      mt={2}
                      fontSize="sm"
                      color="cyan.300"
                    >
                      📍 {event.venue}
                    </Text>
                  </Box>

                  <Stack gap={2}>
                    <IconButton
                      aria-label="Edit Event"
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        openEdit(event)
                      }
                    >
                      <LuPencil />
                    </IconButton>

                    <IconButton
                      aria-label="Delete Event"
                      size="sm"
                      variant="ghost"
                      colorPalette="red"
                      onClick={() =>
                        confirmDelete(event)
                      }
                    >
                      <LuTrash />
                    </IconButton>
                  </Stack>
                </Flex>
              </Box>
            ))}
          </SimpleGrid>
        </Stack>
      </Container>

      <Dialog.Root
        open={!!pendingDeleteId}
        onOpenChange={(e) => {
          if (!e.open) {
            closeDeleteDialog();
          }
        }}
      >
        <Portal>
          <Dialog.Backdrop />

          <Dialog.Positioner>
            <Dialog.Content
              bg="rgb(18,24,45)"
              borderRadius="xl"
            >
              <Dialog.Header>
                <Flex
                  align="center"
                  gap={3}
                >
                  <LuTriangleAlert
                    color="red"
                    size={20}
                  />

                  <Dialog.Title>
                    Confirm Delete
                  </Dialog.Title>
                </Flex>
              </Dialog.Header>

              <Dialog.Body>
                <Text>
                  Are you sure you want
                  to delete{" "}
                  <strong>
                    "{pendingDeleteTitle}"
                  </strong>
                  ? This action cannot be
                  undone.
                </Text>
              </Dialog.Body>

              <Dialog.Footer>
                <Button
                  variant="outline"
                  onClick={
                    closeDeleteDialog
                  }
                >
                  Cancel
                </Button>

                <Button
                  colorPalette="red"
                  loading={isDeleting}
                  onClick={handleDelete}
                >
                  Delete
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