import { Box, Text, VStack } from "@chakra-ui/react";

const Profile = () => {
  return (
    <Box p={6} fontFamily="geist">
      <VStack align="stretch" spacing={4}>
        <Text fontSize="2xl" fontWeight="bold">
          Profile
        </Text>
        <Text color="gray.600">
          This is a simple profile page for testing the bottom navigation.
        </Text>
      </VStack>
    </Box>
  );
};

export default Profile;
