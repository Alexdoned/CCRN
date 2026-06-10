import { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Container, Heading, Text, SimpleGrid, Stack, Flex, Image, Badge, Spinner, Button, Input } from "@chakra-ui/react";
import axios from "axios";
import { LuCalendar, LuMapPin, LuSearch } from "react-icons/lu";

export const Events = () => {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("/api/events");
        if (res.data.success) {
          setEvents(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box bg="rgb(10, 15, 30)" color="white" minH="calc(100vh - 64px)" py={16}>
      <Container maxW="6xl">
        <Stack gap={4} mb={12} textAlign="center">
          <Badge
            alignSelf="center"
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
            Calendar
          </Badge>
          <Heading as="h1" size="2xl" fontWeight="bold">
            All Upcoming Community Events
          </Heading>
          <Text color="gray.400" fontSize="lg" maxW="2xl" mx="auto">
            Review detailed descriptions, venues, dates and secure your tickets for parish gatherings, youth programs and seminars.
          </Text>

          {/* Search bar */}
          <Box maxW="md" mx="auto" w="100%" mt={6} position="relative">
            <Input
              placeholder="Search events by title, venue, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              bg="rgba(255, 255, 255, 0.04)"
              border="1px solid rgba(255, 255, 255, 0.1)"
              color="white"
              _focus={{ borderColor: "cyan.500", bg: "rgba(255,255,255,0.06)" }}
              borderRadius="xl"
              pl={10}
              size="lg"
            />
            <Flex
              position="absolute"
              left={4}
              top="50%"
              transform="translateY(-50%)"
              color="gray.450"
            >
              <LuSearch />
            </Flex>
          </Box>
        </Stack>

        {loading ? (
          <Flex justify="center" py={12}>
            <Spinner color="cyan.400" size="xl" />
          </Flex>
        ) : filteredEvents.length === 0 ? (
          <Box
            textAlign="center"
            py={16}
            bg="rgba(255, 255, 255, 0.02)"
            borderRadius="xl"
            border="1px dashed rgba(255, 255, 255, 0.1)"
          >
            <Text color="gray.400" fontSize="lg">
              {searchQuery ? "No events found matching your search term." : "No upcoming events scheduled right now."}
            </Text>
          </Box>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={8}>
            {filteredEvents.map((event) => (
              <Box
                key={event._id}
                bg="rgba(255, 255, 255, 0.03)"
                borderRadius="2xl"
                overflow="hidden"
                border="1px solid rgba(255, 255, 255, 0.06)"
                transition="all 0.3s"
                _hover={{ transform: "translateY(-5px)", borderColor: "cyan.500", bg: "rgba(255, 255, 255, 0.05)" }}
                display="flex"
                flexDirection="column"
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
                <Stack p={6} gap={4} flex="1" display="flex" flexDirection="column">
                  <Heading size="md" fontWeight="bold">
                    {event.title}
                  </Heading>
                  <Text color="gray.400" fontSize="sm" flex="1">
                    {event.description}
                  </Text>
                  <Stack gap={2.5} fontSize="xs" color="gray.400" mt={2}>
                    <Flex alignItems="center" gap={2}>
                      <LuCalendar color="rgba(6, 182, 212, 0.8)" size={14} />
                      <Text>{new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Text>
                    </Flex>
                    <Flex alignItems="center" gap={2}>
                      <LuMapPin color="rgba(6, 182, 212, 0.8)" size={14} />
                      <Text noOfLines={1}>{event.venue}</Text>
                    </Flex>
                  </Stack>
                  <Button
                    as={RouterLink}
                    to="/register"
                    size="md"
                    bgGradient="to-r"
                    gradientFrom="cyan.500"
                    gradientTo="blue.600"
                    color="white"
                    _hover={{ opacity: 0.9 }}
                    mt={4}
                  >
                    Register and Pay
                  </Button>
                </Stack>
              </Box>
            ))}
          </SimpleGrid>
        )}
      </Container>
    </Box>
  );
};
