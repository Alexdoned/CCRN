import { useState, useEffect } from "react";
import { Box, Container, Heading, Text, SimpleGrid, Stack, Flex, Image, Badge, Spinner, List } from "@chakra-ui/react";
import axios from "axios";
import { LuAward } from "react-icons/lu";

export const Leaders = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const res = await axios.get("/api/leaders");
        if (res.data.success) {
          setLeaders(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching leaders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaders();
  }, []);

  return (
    <Box bg="rgb(10, 15, 30)" color="white" minH="calc(100vh - 64px)" py={16}>
      <Container maxW="6xl">
        <Stack gap={4} mb={12} textAlign="center">
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
            Leadership Team
          </Badge>
          <Heading as="h1" size="2xl" fontWeight="bold">
            Meet Our Parish & Denary Leaders
          </Heading>
          <Text color="gray.400" fontSize="lg" maxW="2xl" mx="auto">
            Our dedicated team members serving the community, facilitating local initiatives, and guiding spiritual programs.
          </Text>
        </Stack>

        {loading ? (
          <Flex justify="center" py={12}>
            <Spinner color="purple.400" size="xl" />
          </Flex>
        ) : leaders.length === 0 ? (
          <Box
            textAlign="center"
            py={16}
            bg="rgba(255, 255, 255, 0.02)"
            borderRadius="xl"
            border="1px dashed rgba(255, 255, 255, 0.1)"
          >
            <Text color="gray.400" fontSize="lg">No leadership profiles have been added yet.</Text>
          </Box>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={8}>
            {leaders.map((leader) => (
              <Box
                key={leader._id}
                bg="rgba(255, 255, 255, 0.03)"
                borderRadius="2xl"
                overflow="hidden"
                border="1px solid rgba(255, 255, 255, 0.06)"
                transition="all 0.3s"
                _hover={{ transform: "translateY(-5px)", borderColor: "purple.500", bg: "rgba(255, 255, 255, 0.05)" }}
                display="flex"
                flexDirection="column"
              >
                {/* Profile Photo */}
                <Box h="300px" overflow="hidden" position="relative">
                  <Image
                    src={leader.imageUrl}
                    alt={leader.name}
                    w="100%"
                    h="100%"
                    objectFit="cover"
                    fallbackSrc="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800"
                  />
                  <Box
                    position="absolute"
                    bottom="0"
                    left="0"
                    right="0"
                    bgGradient="to-t"
                    gradientFrom="rgba(10, 15, 30, 0.95)"
                    gradientTo="transparent"
                    p={6}
                    pt={16}
                  >
                    <Heading size="md" fontWeight="bold">
                      {leader.name}
                    </Heading>
                    <Text fontSize="sm" color="purple.300" fontWeight="semibold" mt={1}>
                      {leader.position}
                    </Text>
                  </Box>
                </Box>

                {/* Achievements Content */}
                <Stack p={6} gap={4} flex="1">
                  <Text fontSize="xs" fontWeight="bold" textTransform="uppercase" letterSpacing="wider" color="gray.450">
                    Key Achievements
                  </Text>
                  {leader.achievements && leader.achievements.length > 0 ? (
                    <List.Root gap={2.5}>
                      {leader.achievements.map((achievement, idx) => (
                        <List.Item key={idx} fontSize="sm" color="gray.305" display="flex" alignItems="start" gap={2}>
                          <List.Indicator as={LuAward} color="purple.400" mt={0.5} flexShrink={0} />
                          <Text>{achievement}</Text>
                        </List.Item>
                      ))}
                    </List.Root>
                  ) : (
                    <Text fontSize="sm" color="gray.450" fontStyle="italic">
                      Serving the local parish community with dedication and care.
                    </Text>
                  )}
                </Stack>
              </Box>
            ))}
          </SimpleGrid>
        )}
      </Container>
    </Box>
  );
};
