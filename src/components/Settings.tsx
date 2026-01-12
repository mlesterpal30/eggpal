import { ChevronDownIcon } from "@chakra-ui/icons";
import { Button, MenuButton, MenuList, MenuItem, Menu } from "@chakra-ui/react";
import { IoSettings } from "react-icons/io5";
 
const Settings = () => {
  return (
    <div>
    <Menu>
    <MenuButton as={Button}>
        <IoSettings className="text-2xl" />
    </MenuButton>
    <MenuList>
      <MenuItem>Profile</MenuItem>  
      <MenuItem>Logout</MenuItem>
    </MenuList>
  </Menu></div>
  )
}

export default Settings