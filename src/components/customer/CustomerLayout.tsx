import { Outlet, NavLink } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import { MdHome, MdPerson } from "react-icons/md";

const navItems = [
  { to: "/", icon: MdHome, label: "Home" },
  { to: "/profile", icon: MdPerson, label: "Profile" },
];

const CustomerLayout = () => {
  return (
    <Box minH="100vh" display="flex" flexDirection="column" pb="70px">
      <Box flex={1} overflow="auto" as="main">
        <Outlet />
      </Box>

      <Flex
        as="nav"
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        h="64px"
        bg="white"
        borderTopWidth="1px"
        borderColor="gray.200"
        justify="space-around"
        align="center"
        zIndex={10}
        paddingBottom="env(safe-area-inset-bottom, 0)"
      >
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            style={({ isActive }) => ({
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              height: "100%",
              color: isActive ? "var(--chakra-colors-blue-600)" : "var(--chakra-colors-gray-500)",
              fontWeight: isActive ? 600 : 400,
              textDecoration: "none",
            })}
          >
            <Box as={Icon} fontSize="24px" mb={1} />
            <Text fontSize="xs">{label}</Text>
          </NavLink>
        ))}
      </Flex>
    </Box>
  );
};

export default CustomerLayout;
