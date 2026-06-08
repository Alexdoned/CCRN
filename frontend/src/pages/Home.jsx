import { useState, useEffect } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Box, Container, Heading, Text, Button, SimpleGrid, Stack, Flex, Image, Badge, Spinner } from "@chakra-ui/react";
import { denaryParishData } from "../data/denaryParishData.js";
import Footer from "../components/Footer";
import axios from "axios";
import { LuCalendar, LuMapPin, LuArrowRight } from "react-icons/lu";

export const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/events");
        if (res.data.success) {
          // Take top 3 upcoming events
          setEvents(res.data.data.slice(0, 3));
        }
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <Box bg="rgb(10, 15, 30)" color="white" minH="calc(100vh - 64px)" pb={20}>
      {/* Hero Section */}
      <Box
        position="relative"
        overflow="hidden"
        py={{ base: 20, md: 32 }}
        bgGradient="radial"
        gradientFrom="rgba(20, 30, 60, 0.8)"
        gradientTo="rgb(10, 15, 30)"
      >
        <Container maxW="6xl" position="relative" zIndex={2}>
          <Stack gap={6} maxW="3xl">
            <Badge
              alignSelf="flex-start"
              bg="rgba(6, 182, 212, 0.15)"
              color="cyan.400"
              fontSize="xs"
              fontWeight="bold"
              px={3}
              py={1}
              borderRadius="full"
              border="1px solid rgba(6, 182, 212, 0.3)"
              textTransform="uppercase"
              letterSpacing="wider"
            >
              Welcome to the Jalingo Diocesan Community Hub
            </Badge>
            <Heading
              as="h1"
              fontSize={{ base: "4xl", md: "6xl" }}
              fontWeight="extrabold"
              lineHeight="1.1"
              bgGradient="to-r"
              gradientFrom="white"
              gradientTo="gray.400"
              bgClip="text"
            >
              Connecting Faith, leadership, and Community Events
            </Heading>
            <Text fontSize={{ base: "lg", md: "xl" }} color="gray.400" maxW="2xl">
              Register for upcoming conferences, engage with parish leaders, and participate in denary-wide programs.
            </Text>
            <Flex gap={4} flexDir={{ base: "column", sm: "row" }} pt={4}>
              <Button
                as={RouterLink}
                to="/register"
                size="lg"
                bgGradient="to-r"
                gradientFrom="cyan.500"
                gradientTo="blue.600"
                color="white"
                fontWeight="bold"
                px={8}
                _hover={{ opacity: 0.9, transform: "translateY(-2px)" }}
                transition="all 0.2s"
              >
                Register & Pay Now
              </Button>
              <Button
                as={RouterLink}
                to="/events"
                size="lg"
                variant="outline"
                borderColor="rgba(255, 255, 255, 0.2)"
                color="white"
                fontWeight="bold"
                px={8}
                _hover={{ bg: "rgba(255, 255, 255, 0.05)", transform: "translateY(-2px)" }}
                transition="all 0.2s"
              >
                Browse Events
              </Button>
            </Flex>
          </Stack>
        </Container>

        {/* Ambient background glows */}
        <Box
          position="absolute"
          top="-20%"
          right="-10%"
          w="600px"
          h="600px"
          bg="rgba(128, 90, 213, 0.15)"
          borderRadius="full"
          filter="blur(150px)"
          pointerEvents="none"
        />
        <Box
          position="absolute"
          bottom="-20%"
          left="-10%"
          w="500px"
          h="500px"
          bg="rgba(6, 182, 212, 0.12)"
          borderRadius="full"
          filter="blur(120px)"
          pointerEvents="none"
        />
      </Box>

      {/* Featured Events Section */}
      <Container maxW="6xl" mt={12}>
        <Flex justifyContent="between" alignItems="end" mb={10}>
          <Stack gap={2}>
            <Heading as="h2" size="xl" fontWeight="bold">
              Upcoming Events
            </Heading>
            <Text color="gray.400">Join our upcoming activities and register today.</Text>
          </Stack>
          <Button
            as={RouterLink}
            to="/events"
            variant="ghost"
            color="cyan.400"
            _hover={{ color: "cyan.300", bg: "transparent" }}
            display={{ base: "none", sm: "flex" }}
          >
            See all <LuArrowRight style={{ marginLeft: "6px" }} />
          </Button>
        </Flex>

        {loading ? (
          <Flex justify="center" py={12}>
            <Spinner color="cyan.400" size="xl" />
          </Flex>
        ) : events.length === 0 ? (
          <Box
            textAlign="center"
            py={16}
            bg="rgba(255, 255, 255, 0.02)"
            borderRadius="xl"
            border="1px dashed rgba(255, 255, 255, 0.1)"
          >
            <Text color="gray.450" mb={4} fontSize="lg">No upcoming events scheduled right now.</Text>
            <Button
              as={RouterLink}
              to="/events"
              size="sm"
              bg="cyan.600"
              color="white"
              _hover={{ bg: "cyan.750" }}
            >
              Browse Events List
            </Button>
          </Box>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={8}>
            {events.map((event) => (
              <Box
                key={event._id}
                bg="rgba(255, 255, 255, 0.03)"
                borderRadius="xl"
                overflow="hidden"
                border="1px solid rgba(255, 255, 255, 0.06)"
                transition="all 0.3s"
                _hover={{ transform: "translateY(-5px)", borderColor: "cyan.500", bg: "rgba(255, 255, 255, 0.05)" }}
              >
                <Box h="200px" overflow="hidden" position="relative">
                  <Image
                    src={event.imageUrl}
                    alt={event.title}
                    w="100%"
                    h="100%"
                    objectFit="cover"
                    fallbackSrc="https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800"
                  />
                  <Box
                    position="absolute"
                    top={4}
                    right={4}
                    bg="rgba(10, 15, 30, 0.85)"
                    backdropFilter="blur(4px)"
                    px={3}
                    py={1}
                    borderRadius="md"
                    border="1px solid rgba(255, 255, 255, 0.1)"
                  >
                    <Text fontSize="xs" fontWeight="bold" color="cyan.400">
                      {new Date(event.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </Text>
                  </Box>
                </Box>
                <Stack p={6} gap={4}>
                  <Heading size="md" noOfLines={1}>
                    {event.title}
                  </Heading>
                  <Text color="gray.400" fontSize="sm" noOfLines={2}>
                    {event.description}
                  </Text>
                  <Stack gap={2} fontSize="xs" color="gray.400">
                    <Flex alignItems="center" gap={2}>
                      <LuCalendar color="rgba(6, 182, 212, 0.8)" />
                      <Text>{new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Text>
                    </Flex>
                    <Flex alignItems="center" gap={2}>
                      <LuMapPin color="rgba(6, 182, 212, 0.8)" />
                      <Text noOfLines={1}>{event.venue}</Text>
                    </Flex>
                  </Stack>
                  <Button
                    as={RouterLink}
                    to="/register"
                    size="sm"
                    bg="rgba(6, 182, 212, 0.15)"
                    color="cyan.300"
                    _hover={{ bg: "cyan.500", color: "white" }}
                    mt={2}
                  >
                    Register for Event
                  </Button>
                </Stack>
              </Box>
            ))}
          </SimpleGrid>
        )}
      </Container>

      <Container maxW="6xl" mt={16}>
        <Stack gap={4} mb={8} textAlign="center">
          <Heading as="h2" size="xl" fontWeight="bold">
            Denary & Parish in Jalingo Diocese
          </Heading>
          <Text color="gray.400">
            Browse the current denary assignments and matching parishes used in the registration workflow.
          </Text>
        </Stack>

        <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
          {Object.entries(denaryParishData).map(([denary, parishes]) => (
            <Box
              key={denary}
              bg="rgba(255, 255, 255, 0.03)"
              border="1px solid rgba(255, 255, 255, 0.08)"
              borderRadius="2xl"
              p={4}
              cursor="pointer"
              _hover={{ transform: "translateY(-4px)", borderColor: "cyan.400" }}
              onClick={() => navigate(`/register?denary=${encodeURIComponent(denary)}`)}
            >
              <Flex justify="space-between" align="start">
                <Text fontWeight="bold" textTransform="capitalize" mb={2}>
                  {denary}
                </Text>
                <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); navigate(`/register?denary=${encodeURIComponent(denary)}`); }}>
                  Select
                </Button>
              </Flex>

              <Stack spacing={1} color="gray.300" fontSize="sm" mt={2}>
                {parishes.slice(0, 8).map((parish) => (
                  <Text
                    as="button"
                    key={parish}
                    textAlign="left"
                    w="100%"
                    onClick={(e) => { e.stopPropagation(); navigate(`/register?denary=${encodeURIComponent(denary)}&parish=${encodeURIComponent(parish)}`); }}
                    _hover={{ color: 'cyan.300', textDecoration: 'underline' }}
                  >
                    • {parish}
                  </Text>
                ))}
                {parishes.length > 8 && (
                  <Text color="gray.450" fontSize="xs">and {parishes.length - 8} more...</Text>
                )}
              </Stack>
            </Box>
          ))}
        </SimpleGrid>

        <Footer />
      </Container>
    </Box>
  );
};
