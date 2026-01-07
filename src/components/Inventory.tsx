import React from 'react'
import { Box, Table, Thead, Tbody, Tr, Td, TableContainer, useDisclosure, Th } from '@chakra-ui/react'
import { Text, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, FormControl, FormLabel, FormErrorMessage, Input, Textarea, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Select, Flex } from '@chakra-ui/react'
import { useForm, Controller } from "react-hook-form";
import { CreateEgg } from '../entiies/Dto/CreateEgg';
import { useCreateEgg, useGetAllEggs } from '../hooks/InventoryRepository';

const Inventory = () => {
    const createMutation = useCreateEgg();
    const { data: eggsData, isLoading: isEggsLoading, error: eggsError } = useGetAllEggs();
    const eggs = eggsData?.results || [];
    console.log(eggs);
    // const { data: salesData, isLoading: isSalesLoading, error: salesError } = useGetAllSales();
    // const sales = salesData?.results || [];
    // console.log(sales);
    const {register, handleSubmit, control, reset, formState: { errors }} = useForm<CreateEgg>({
        defaultValues: {
            eggSize: "",
            eggCount: 0,
            harvestBy: "",
        },
    });

    const { isOpen, onOpen, onClose } = useDisclosure();
    
    const onSubmit = async (data: CreateEgg) => {
        await createMutation.mutateAsync(data);
        onClose();
    };
    const handleOpenCreate = () => {
        reset({
            eggSize: "",
            eggCount: 0,
            harvestBy: "",
        });
        onOpen();
    };


  return (
    <Box p={6} fontFamily="geist">
        <Box mb={6} display="flex" justifyContent="space-between" alignItems="center">
            <Text fontSize="2xl" fontWeight="bold">
                Inventory Management
            </Text>
            <Button colorScheme="blue" onClick={handleOpenCreate}>
                Create New Egg
            </Button>
        </Box>
    <TableContainer >
        <Table variant="simple" size="sm">
            <Thead>
                <Tr>
                    <Th>Harvest By</Th>
                    <Th>Egg Size</Th>
                    <Th>Egg Count</Th>
                    <Th>Harvest Time</Th>
                    <Th>Actions</Th>
                </Tr>
            </Thead>
            <Tbody>
                {eggs?.map((egg) => (
                    <Tr key={egg.id}>
                        <Td>{egg.harvestBy}</Td>
                        <Td>{egg.eggSize}</Td>
                        <Td>{egg.eggCount}</Td>
                        <Td>{egg.harvestTime}</Td>
                    </Tr>
                ))}
            </Tbody>
        </Table>
    </TableContainer>
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    Add Egg Inventory Record
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <form onSubmit={handleSubmit(onSubmit)} id="egg-form">    
                        <FormControl mb={4} isInvalid={!!errors.harvestBy}>
                            <Flex justifyContent="space-between" alignItems="center">               
                                <FormLabel>Harvest By</FormLabel>             
                                <FormErrorMessage mb={4}>{errors.harvestBy?.message}</FormErrorMessage>       
                            </Flex>
                            <Input
                                {...register("harvestBy", {
                                    required: "Harvest By is required",
                                })}
                                placeholder="Enter harvest by"
                            />
                        </FormControl>

                        <FormControl mb={4} isInvalid={!!errors.eggSize}>   
                            <Flex justifyContent="space-between" alignItems="center">               
                                <FormLabel>Egg Size</FormLabel>             
                                <FormErrorMessage mb={4}>{errors.eggSize?.message}</FormErrorMessage>       
                            </Flex>
                            <Select
                                {...register("eggSize", {
                                    required: "Egg Size is required",
                                })}
                            >
                                <option value="Small">Small</option>
                                <option value="Medium">Medium</option>
                                <option value="Large">Large</option>
                            </Select>
                        </FormControl>

                            <FormControl mb={4} isInvalid={!!errors.eggCount}>
                            <Flex justifyContent="space-between" alignItems="center">               
                                <FormLabel>Egg Count</FormLabel>             
                                <FormErrorMessage mb={4}>{errors.eggCount?.message}</FormErrorMessage>       
                            </Flex>
                            <Controller
                                name="eggCount"
                                control={control}
                                rules={{
                                    required: "Egg Count is required",
                                    min: { value: 0, message: "Egg Count must be at least 0" },
                                    max: { value: 100, message: "Egg Count must be at most 100" },
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <NumberInput
                                        value={value}
                                        onChange={onChange}   
                                        min={0}
                                        max={10}
                                        precision={0}
                                        step={1}
                                    >
                                        <NumberInputField />
                                        <NumberInputStepper>
                                            <NumberIncrementStepper />
                                            <NumberDecrementStepper />
                                        </NumberInputStepper>
                                    </NumberInput>
                                )}
                            />
                        </FormControl>


                    </form>
                </ModalBody>

                <ModalFooter>
                    <Button
                        type="submit"
                        form="egg-form"
                        colorScheme="blue"
                        mr={3}
                        isLoading={createMutation.isPending}
                    >
                        Create Egg Inventory Record
                    </Button>
                    <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
    </Modal>    
    </Box>
    );
};

export default Inventory