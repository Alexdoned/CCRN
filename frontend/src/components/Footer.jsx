import { Box, Container, Stack, Text, Link, Flex, Button } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

const Footer = () => {
  return (
    <Box mt={12} bg="rgba(0,0,0,0.45)" color="gray.200" py={8} borderTop="1px solid rgba(255,255,255,0.04)">
      <Container maxW="6xl">
        <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
          <Stack spacing={1}>
            <Text fontWeight="bold">Jalingo Diocese</Text>
            <Text fontSize="sm" color="gray.400">Connecting parishes, leaders and events.</Text>
          </Stack>

          <Stack direction={{ base: "column", sm: "row" }} spacing={4} align="center">
            <Link as={RouterLink} to="/" color="gray.200">Home</Link>
            <Link as={RouterLink} to="/register" color="gray.200">Register</Link>
            <Link as={RouterLink} to="/events" color="gray.200">Events</Link>
            <Link as={RouterLink} to="/leaders" color="gray.200">Leaders</Link>
            <Link as={RouterLink} to="/admin" color="gray.200">Admin</Link>
          </Stack>

          <Stack spacing={1} align="end">
            <Text fontSize="sm">Questions? <Link as={RouterLink} to="/contact" color="cyan.300">Contact Us</Link></Text>
            <Text fontSize="xs" color="gray.500">© {new Date().getFullYear()} Jalingo Diocese</Text>
          </Stack>
        </Flex>
      </Container>
    </Box>
  );
};

export default Footer;
