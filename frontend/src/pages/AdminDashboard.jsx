import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Container, Heading, Text, Stack, Button } from "@chakra-ui/react";
import { toaster } from "../components/ui/toaster";

export const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      toaster.create({
        title: "Access Denied",
        description: "Please log in as an admin to view this dashboard.",
        type: "error",
      });
      navigate("/admin/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    toaster.create({
      title: "Logged Out",
      description: "You have been signed out successfully.",
      type: "success",
    });
    navigate("/");
  };

  return (
    <Box bg="rgb(10, 15, 30)" color="white" minH="calc(100vh - 64px)" py={16}>
      <Container maxW="4xl">
        <Stack gap={8} textAlign="center">
          <Heading as="h1" size="2xl" fontWeight="bold">
            Admin Dashboard
          </Heading>
          <Text color="gray.400" fontSize="lg">
            Welcome to the Diocesan portal. Use the navigation links to manage events, leaders,
            and registrations.
          </Text>
          <Stack direction={{ base: "column", md: "row" }} justify="center" gap={4}>
            <Button
              size="lg"
              bgGradient="to-r"
              gradientFrom="purple.500"
              gradientTo="indigo.600"
              color="white"
              _hover={{ opacity: 0.9 }}
              onClick={() => navigate('/admin/events')}
            >
              Manage Events
            </Button>
            <Button
              size="lg"
              bgGradient="to-r"
              gradientFrom="teal.500"
              gradientTo="cyan.600"
              color="white"
              _hover={{ opacity: 0.9 }}
              onClick={() => navigate('/admin/leaders')}
            >
              Manage Leaders
            </Button>
            <Button
              size="lg"
              bg="red.600"
              color="white"
              _hover={{ bg: "red.700" }}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};
