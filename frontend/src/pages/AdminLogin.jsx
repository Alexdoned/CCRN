import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Container, Heading, Text, Stack, Input, Button, Badge, Spinner } from "@chakra-ui/react";
import { toaster } from "../components/ui/toaster";
import axios from "axios";

export const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      toaster.create({
        title: "Validation Error",
        description: "Username and password are required.",
        type: "error",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/admin/login", {
        username,
        password
      });

      if (res.data.success) {
        localStorage.setItem("adminToken", res.data.token);
        toaster.create({
          title: "Login Successful",
          description: `Welcome back, ${res.data.admin.username}!`,
          type: "success",
        });
        navigate("/admin/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      const errMsg = err.response?.data?.message || "Invalid credentials. Please check your username and password.";
      toaster.create({
        title: "Login Failed",
        description: errMsg,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box bg="rgb(10, 15, 30)" color="white" minH="calc(100vh - 64px)" display="flex" align="center" py={20}>
      <Container maxW="md" my="auto">
        <Stack gap={4} mb={8} textAlign="center">
          <Badge
            alignSelf="center"
            bg="rgba(128, 90, 213, 0.15)"
            color="purple.350"
            fontSize="xs"
            fontWeight="bold"
            px={3}
            py={1}
            borderRadius="full"
            border="1px solid rgba(128, 90, 213, 0.3)"
            textTransform="uppercase"
            letterSpacing="wider"
          >
            Security Portal
          </Badge>
          <Heading as="h1" size="xl" fontWeight="bold">
            Administrative Login
          </Heading>
          <Text color="gray.400">
            Sign in to manage leaders, events, and registration records.
          </Text>
        </Stack>

        <Box
          as="form"
          onSubmit={handleLogin}
          bg="rgba(255, 255, 255, 0.02)"
          borderRadius="2xl"
          border="1px solid rgba(255, 255, 255, 0.06)"
          p={8}
          boxShadow="2xl"
          backdropFilter="blur(10px)"
        >
          <Stack gap={5}>
            <Stack gap={1.5}>
              <Text fontSize="sm" color="gray.350">Admin Username</Text>
              <Input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                bg="rgba(255, 255, 255, 0.03)"
                borderColor="rgba(255, 255, 255, 0.1)"
                _focus={{ borderColor: "purple.500" }}
                disabled={loading}
              />
            </Stack>

            <Stack gap={1.5}>
              <Text fontSize="sm" color="gray.350">Password</Text>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                bg="rgba(255, 255, 255, 0.03)"
                borderColor="rgba(255, 255, 255, 0.1)"
                _focus={{ borderColor: "purple.500" }}
                disabled={loading}
              />
            </Stack>

            <Button
              type="submit"
              bgGradient="to-r"
              gradientFrom="purple.500"
              gradientTo="indigo.600"
              color="white"
              fontWeight="bold"
              mt={4}
              _hover={{ opacity: 0.9 }}
              disabled={loading}
            >
              {loading ? <Spinner size="sm" /> : "Access Dashboard"}
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};
