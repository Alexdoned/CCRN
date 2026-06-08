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
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import axios from "axios";
import { LuPlus, LuEdit, LuTrash } from "react-icons/lu";
import { toaster } from "../../components/ui/toaster";

const API = "http://localhost:5000/api/leaders";

export const AdminLeaders = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", position: "", achievements: "", imageUrl: "" });
  const [editingId, setEditingId] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const token = localStorage.getItem("adminToken");

  const fetchLeaders = async () => {
    try {
      const res = await axios.get(API);
      setLeaders(res.data.data || []);
    } catch (err) {
      console.error(err);
      toaster.create({ title: "Error", description: "Could not load leaders.", type: "error" });
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchLeaders(); }, []);

  const openCreate = () => { setEditingId(null); setForm({ name: "", position: "", achievements: "", imageUrl: "" }); onOpen(); };
  const openEdit = (leader) => { setEditingId(leader._id); setForm({ name: leader.name, position: leader.position, achievements: (leader.achievements || []).join("; "), imageUrl: leader.imageUrl }); onOpen(); };

  const handleSubmit = async () => {
    try {
      if (!form.name || !form.position) { toaster.create({ title: "Validation", description: "Name and position required.", type: "error" }); return; }
      const payload = { name: form.name, position: form.position, achievements: form.achievements ? form.achievements.split(";").map(s=>s.trim()).filter(Boolean) : [], imageUrl: form.imageUrl };
      if (editingId) {
        await axios.put(`${API}/${editingId}`, payload, { headers: { Authorization: `Bearer ${token}` } });
        toaster.create({ title: "Updated", description: "Leader updated.", type: "success" });
      } else {
        await axios.post(API, payload, { headers: { Authorization: `Bearer ${token}` } });
        toaster.create({ title: "Created", description: "Leader created.", type: "success" });
      }
      onClose(); fetchLeaders();
    } catch (err) {
      console.error(err);
      toaster.create({ title: "Error", description: err.response?.data?.message || "Request failed.", type: "error" });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this leader?")) return;
    try {
      await axios.delete(`${API}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toaster.create({ title: "Deleted", description: "Leader removed.", type: "success" });
      fetchLeaders();
    } catch (err) {
      console.error(err);
      toaster.create({ title: "Error", description: "Could not delete leader.", type: "error" });
    }
  };

  return (
    <Box bg="rgb(10, 15, 30)" color="white" minH="calc(100vh - 64px)" py={12}>
      <Container maxW="6xl">
        <Stack spacing={6}>
          <Flex justify="space-between" align="center">
            <Heading as="h2" size="lg">Admin — Leaders</Heading>
            <Button leftIcon={<LuPlus />} colorScheme="cyan" onClick={openCreate}>New Leader</Button>
          </Flex>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
            {leaders.map((ld) => (
              <Box key={ld._id} bg="rgba(255,255,255,0.02)" p={4} borderRadius="lg" border="1px solid rgba(255,255,255,0.04)">
                <Flex justify="space-between">
                  <Box>
                    <Text fontWeight="bold">{ld.name}</Text>
                    <Text fontSize="sm" color="gray.400">{ld.position}</Text>
                    <Text mt={2} noOfLines={3}>{(ld.achievements || []).join("; ")}</Text>
                  </Box>
                  <Stack>
                    <IconButton aria-label="edit" icon={<LuEdit />} onClick={() => openEdit(ld)} />
                    <IconButton aria-label="delete" icon={<LuTrash />} onClick={() => handleDelete(ld._id)} />
                  </Stack>
                </Flex>
              </Box>
            ))}
          </SimpleGrid>
        </Stack>
      </Container>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editingId ? "Edit Leader" : "Create Leader"}</ModalHeader>
          <ModalBody>
            <Stack spacing={3}>
              <Input placeholder="Name" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} />
              <Input placeholder="Position" value={form.position} onChange={(e)=>setForm({...form,position:e.target.value})} />
              <Textarea placeholder="Achievements (separate with ; )" value={form.achievements} onChange={(e)=>setForm({...form,achievements:e.target.value})} />
              <Input placeholder="Image URL" value={form.imageUrl} onChange={(e)=>setForm({...form,imageUrl:e.target.value})} />
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>Cancel</Button>
            <Button colorScheme="cyan" onClick={handleSubmit}>{editingId ? "Update" : "Create"}</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AdminLeaders;
