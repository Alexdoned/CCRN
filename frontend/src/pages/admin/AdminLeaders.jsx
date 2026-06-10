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

const API = "http://localhost:5000/api/leaders";

export const AdminLeaders = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", position: "", achievements: "", imageUrl: "" });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Delete dialog state
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [pendingDeleteName, setPendingDeleteName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const token = localStorage.getItem("adminToken");

  const fetchLeaders = async () => {
    try {
      const res = await axios.get(API);
      setLeaders(res.data.data || []);
    } catch (err) {
      toaster.create({ title: "Error", description: "Could not load leaders.", type: "error" });
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchLeaders(); }, []);

  const openCreate = () => { setEditingId(null); setForm({ name: "", position: "", achievements: "", imageUrl: "" }); setShowForm(true); };
  const openEdit = (leader) => {
    setEditingId(leader._id);
    setForm({ name: leader.name, position: leader.position, achievements: (leader.achievements || []).join("; "), imageUrl: leader.imageUrl });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    try {
      if (!form.name || !form.position || !form.imageUrl) {
        toaster.create({ title: "Validation", description: "Name, position, and image URL are required.", type: "error" });
        return;
      }
      const payload = {
        name: form.name,
        position: form.position,
        achievements: form.achievements ? form.achievements.split(";").map(s => s.trim()).filter(Boolean) : [],
        imageUrl: form.imageUrl,
      };
      if (editingId) {
        await axios.put(`${API}/${editingId}`, payload, { headers: { Authorization: `Bearer ${token}` } });
        toaster.create({ title: "Updated", description: "Leader updated.", type: "success" });
      } else {
        await axios.post(API, payload, { headers: { Authorization: `Bearer ${token}` } });
        toaster.create({ title: "Created", description: "Leader created.", type: "success" });
      }
      setShowForm(false);
      fetchLeaders();
    } catch (err) {
      toaster.create({ title: "Error", description: err.response?.data?.message || "Request failed.", type: "error" });
    }
  };

  // Step 1: open dialog
  const confirmDelete = (ld) => {
    setPendingDeleteId(ld._id);
    setPendingDeleteName(ld.name);
  };

  // Step 2: confirmed inside dialog
  const handleDelete = async () => {
    if (!pendingDeleteId) return;
    setIsDeleting(true);
    try {
      await axios.delete(`${API}/${pendingDeleteId}`, { headers: { Authorization: `Bearer ${token}` } });
      toaster.create({ title: "Deleted", description: `"${pendingDeleteName}" has been removed.`, type: "success" });
      setPendingDeleteId(null);
      setPendingDeleteName("");
      fetchLeaders();
    } catch (err) {
      toaster.create({ title: "Error", description: "Could not delete leader.", type: "error" });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Box bg="rgb(10, 15, 30)" color="white" minH="calc(100vh - 64px)" py={12}>
      <Container maxW="6xl">
        <Stack gap={6}>
          <Flex justify="space-between" align="center">
            <Heading as="h2" size="lg">Admin — Leaders</Heading>
            <Button bg="cyan.600" color="white" _hover={{ bg: "cyan.500" }} onClick={openCreate}>
              <LuPlus style={{ marginRight: "6px" }} /> New Leader
            </Button>
          </Flex>

          {/* Inline Create / Edit Form */}
          {showForm && (
            <Box bg="rgba(255,255,255,0.03)" borderRadius="xl" border="1px solid rgba(255,255,255,0.08)" p={6}>
              <Flex justify="space-between" align="center" mb={4}>
                <Heading size="md">{editingId ? "Edit Leader" : "Create Leader"}</Heading>
                <IconButton aria-label="close" variant="ghost" color="white" onClick={() => setShowForm(false)}>
                  <LuX />
                </IconButton>
              </Flex>
              <Stack gap={3}>
                <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} bg="rgba(255,255,255,0.03)" borderColor="rgba(255,255,255,0.1)" color="white" />
                <Input placeholder="Position / Title" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} bg="rgba(255,255,255,0.03)" borderColor="rgba(255,255,255,0.1)" color="white" />
                <Textarea placeholder="Achievements (separate with ; )" value={form.achievements} onChange={(e) => setForm({ ...form, achievements: e.target.value })} bg="rgba(255,255,255,0.03)" borderColor="rgba(255,255,255,0.1)" color="white" rows={3} />
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
            {leaders.map((ld) => (
              <Box key={ld._id} bg="rgba(255,255,255,0.02)" p={4} borderRadius="lg" border="1px solid rgba(255,255,255,0.06)">
                <Flex justify="space-between">
                  <Box flex="1" mr={3}>
                    <Text fontWeight="bold">{ld.name}</Text>
                    <Text fontSize="sm" color="gray.400">{ld.position}</Text>
                    <Text mt={2} fontSize="sm" color="gray.300">
                      {(ld.achievements || []).join("; ")}
                    </Text>
                  </Box>
                  <Stack gap={2}>
                    <IconButton aria-label="edit" size="sm" variant="ghost" color="cyan.400" onClick={() => openEdit(ld)}>
                      <LuPencil />
                    </IconButton>
                    <IconButton aria-label="delete" size="sm" variant="ghost" color="red.400" onClick={() => confirmDelete(ld)}>
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
        onOpenChange={(details) => { if (!details.open) { setPendingDeleteId(null); setPendingDeleteName(""); } }}
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
                    Remove Leader
                  </Dialog.Title>
                </Flex>
              </Dialog.Header>

              {/* Body */}
              <Dialog.Body px={6} py={4}>
                <Text color="gray.400" fontSize="sm" lineHeight="tall">
                  Are you sure you want to remove{" "}
                  <Text as="span" color="white" fontWeight="semibold">"{pendingDeleteName}"</Text>?
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
                  loadingText="Removing..."
                  onClick={handleDelete}
                >
                  <LuTrash style={{ marginRight: "6px" }} /> Remove
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
