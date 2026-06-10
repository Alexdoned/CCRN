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
  Flex,
  Text,
  IconButton,
  Spinner,
  Dialog,
  Portal,
} from "@chakra-ui/react";

import {
  LuPlus,
  LuPencil,
  LuTrash,
  LuX,
  LuTriangleAlert,
} from "react-icons/lu";

import { toaster } from "../../components/ui/toaster";

const API = "http://localhost:5000/api/leaders";

const AdminLeaders = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    role: "",
    imageUrl: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [pendingDeleteName, setPendingDeleteName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const token = localStorage.getItem("adminToken");

  const resetForm = () => {
    setForm({
      name: "",
      role: "",
      imageUrl: "",
    });

    setEditingId(null);
  };

  const fetchLeaders = async () => {
    try {
      setLoading(true);

      const res = await axios.get(API);

      setLeaders(res.data.data || []);
    } catch (err) {
      console.error(err);

      toaster.create({
        title: "Error",
        description: "Could not load leaders.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaders();
  }, []);

  const openCreate = () => {
    resetForm();
    setShowForm(true);
  };

  const openEdit = (leader) => {
    setEditingId(leader._id);

    setForm({
      name: leader.name || "",
      role: leader.role || "",
      imageUrl: leader.imageUrl || "",
    });

    setShowForm(true);
  };

  const handleSubmit = async () => {
    try {
      if (!form.name || !form.role || !form.imageUrl) {
        toaster.create({
          title: "Validation Error",
          description: "Please fill all fields.",
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
          title: "Success",
          description: "Leader updated successfully.",
          type: "success",
        });
      } else {
        await axios.post(
          API,
          form,
          config
        );

        toaster.create({
          title: "Success",
          description: "Leader created successfully.",
          type: "success",
        });
      }

      resetForm();
      setShowForm(false);
      fetchLeaders();
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

  const confirmDelete = (leader) => {
    setPendingDeleteId(leader._id);
    setPendingDeleteName(leader.name);
  };

  const closeDeleteDialog = () => {
    setPendingDeleteId(null);
    setPendingDeleteName("");
  };

  const handleDelete = async () => {
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
        description: `${pendingDeleteName} removed successfully.`,
        type: "success",
      });

      closeDeleteDialog();
      fetchLeaders();
    } catch (err) {
      console.error(err);

      toaster.create({
        title: "Error",
        description:
          err?.response?.data?.message ||
          "Could not delete leader.",
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
      minH="100vh"
      py={12}
    >
      <Container maxW="6xl">
        <Stack gap={6}>
          <Flex
            justify="space-between"
            align="center"
          >
            <Heading size="lg">
              Admin — Leaders
            </Heading>

            <Button
              colorPalette="cyan"
              onClick={openCreate}
            >
              <LuPlus />
              New Leader
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
                    ? "Edit Leader"
                    : "Create Leader"}
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
                  placeholder="Leader Name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                />

                <Input
                  placeholder="Leader Role"
                  value={form.role}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      role: e.target.value,
                    })
                  }
                />

                <Input
                  placeholder="Image URL"
                  value={form.imageUrl}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      imageUrl: e.target.value,
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
              lg: 3,
            }}
            gap={6}
          >
            {leaders.map((leader) => (
              <Box
                key={leader._id}
                p={4}
                borderRadius="lg"
                bg="rgba(255,255,255,0.03)"
                border="1px solid rgba(255,255,255,0.08)"
              >
                <Flex
                  justify="space-between"
                  align="center"
                >
                  <Box>
                    <Text fontWeight="bold">
                      {leader.name}
                    </Text>

                    <Text
                      color="gray.400"
                      fontSize="sm"
                    >
                      {leader.role}
                    </Text>
                  </Box>

                  <Flex gap={2}>
                    <IconButton
                      aria-label="Edit"
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        openEdit(leader)
                      }
                    >
                      <LuPencil />
                    </IconButton>

                    <IconButton
                      aria-label="Delete"
                      size="sm"
                      variant="ghost"
                      colorPalette="red"
                      onClick={() =>
                        confirmDelete(leader)
                      }
                    >
                      <LuTrash />
                    </IconButton>
                  </Flex>
                </Flex>
              </Box>
            ))}
          </SimpleGrid>
        </Stack>
      </Container>

      {/* Delete Dialog */}
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
            <Dialog.Content>
              <Dialog.Header>
                <Flex align="center" gap={2}>
                  <LuTriangleAlert />
                  <Dialog.Title>
                    Confirm Delete
                  </Dialog.Title>
                </Flex>
              </Dialog.Header>

              <Dialog.Body>
                <Text>
                  Are you sure you want to
                  delete{" "}
                  <strong>
                    "{pendingDeleteName}"
                  </strong>
                  ?
                </Text>
              </Dialog.Body>

              <Dialog.Footer>
                <Button
                  variant="outline"
                  onClick={closeDeleteDialog}
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

export default AdminLeaders;