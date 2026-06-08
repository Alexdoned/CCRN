import { useState, useEffect } from "react";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { Box, Flex, HStack, Text, Button,  IconButton, Stack } from "@chakra-ui/react";
import { LuMenu, LuX, LuLogOut, LuLayoutDashboard } from "react-icons/lu";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    setIsAdmin(!!token);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsAdmin(false);
    navigate("/");
  };

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Leaders", path: "/leaders" },
    { label: "Events", path: "/events" },
    { label: "Register/Pay", path: "/register" }
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <Box
      position="sticky"
      top="0"
      zIndex="1000"
      bg="rgba(10, 15, 30, 0.85)"
      backdropFilter="blur(12px)"
      borderBottom="1px solid rgba(255, 255, 255, 0.08)"
      color="white"
      px={6}
    >
      <Flex h={16} alignItems="center" justifyContent="space-between">
        {/* Logo */}
        <Flex alignItems="center" gap={2}>
          <Text
            fontSize="xl"
            fontWeight="bold"
            bgGradient="to-r"
            gradientFrom="cyan.400"
            gradientTo="purple.500"
            bgClip="text"
            letterSpacing="wider"
            cursor="pointer"
            onClick={() => navigate("/")}
          >
              CCRN
          </Text>
        </Flex>

        {/* Desktop Navigation */}
        <HStack gap={8} display={{ base: "none", md: "flex" }}>
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Box
                key={link.label}
                as={RouterLink}
                to={link.path}
                px={3}
                py={1.5}
                rounded="md"
                fontSize="sm"
                fontWeight="medium"
                color={isActive ? "cyan.400" : "gray.300"}
                transition="all 0.2s"
                _hover={{ color: "cyan.400", bg: "rgba(255, 255, 255, 0.05)" }}
              >
                {link.label}
              </Box>
            );
          })}
        </HStack>

        {/* Desktop Admin Area */}
        <HStack gap={4} display={{ base: "none", md: "flex" }}>
          {isAdmin ? (
            <>
              <Button
                as={RouterLink}
                to="/admin/dashboard"
                size="sm"
                variant="outline"
                borderColor="purple.500"
                color="purple.300"
                _hover={{ bg: "rgba(128, 90, 213, 0.15)" }}
              >
                <LuLayoutDashboard style={{ marginRight: "6px" }} /> Dashboard
              </Button>
              <Button
                size="sm"
                bg="red.600"
                color="white"
                _hover={{ bg: "red.700" }}
                onClick={handleLogout}
              >
                <LuLogOut style={{ marginRight: "6px" }} /> Logout
              </Button>
            </>
          ) : (
            <Button
              as={RouterLink}
              to="/admin/login"
              size="lg"
              bgGradient="to-r"
              gradientFrom="cyan.500"
              gradientTo="blue.600"
              color="white"
              _hover={{ opacity: 0.9 }}
              
            >
             Admin🔐
            </Button>
          )}
        </HStack>

        {/* Mobile menu button */}
        <IconButton
          display={{ base: "block", md: "none" }}
          onClick={toggleMenu}
          variant="ghost"
          color="white"
          aria-label="Toggle Navigation"
        >
          {isOpen ? <LuX size={24} /> : <LuMenu size={24} />}
        </IconButton>
      </Flex>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <Box pb={4} display={{ base: "block", md: "none" }}>
          <Stack gap={2} as="nav">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Box
                  key={link.label}
                  as={RouterLink}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  px={4}
                  py={2.5}
                  rounded="md"
                  fontSize="md"
                  fontWeight="medium"
                  color={isActive ? "cyan.400" : "gray.300"}
                  _hover={{ color: "white", bg: "rgba(255, 255, 255, 0.05)" }}
                >
                  {link.label}
                </Box>
              );
            })}
            <hr style={{ borderColor: "rgba(255,255,255,0.08)", margin: "8px 0" }} />
            {isAdmin ? (
              <>
                <Box
                  as={RouterLink}
                  to="/admin/dashboard"
                  onClick={() => setIsOpen(false)}
                  px={4}
                  py={2.5}
                  rounded="md"
                  fontSize="md"
                  fontWeight="medium"
                  color="purple.300"
                  _hover={{ bg: "rgba(255, 255, 255, 0.05)" }}
                >
                  Dashboard
                </Box>
                <Box
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  px={4}
                  py={2.5}
                  rounded="md"
                  fontSize="md"
                  fontWeight="medium"
                  color="red.400"
                  cursor="pointer"
                  _hover={{ bg: "rgba(255, 255, 255, 0.05)" }}
                >
                  Logout
                </Box>
              </>
            ) : (
              <Box
                as={RouterLink}
                to="/admin/login"
                onClick={() => setIsOpen(false)}
                px={4}
                py={2.5}
                rounded="md"
                fontSize="md"
                fontWeight="medium"
                color="cyan.400"
                _hover={{ bg: "rgba(255, 255, 255, 0.05)" }}
              >
                Admin Login
              </Box>
            )}
          </Stack>
        </Box>
      )}
    </Box>
  );
};
