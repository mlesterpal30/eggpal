import React, { useState } from 'react'
import { Box, Table, Thead, Tbody, Tr, Td, TableContainer, useDisclosure, Th, HStack, IconButton, VStack } from '@chakra-ui/react'
import { Text, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, FormControl, FormLabel, FormErrorMessage, Input, Textarea, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Select, Flex } from '@chakra-ui/react'
import { useForm, Controller } from "react-hook-form";
import { CreateHarvest } from '../../entiies/Dto/CreateHarvest';
import { useCreateHarvest, useGetAllHarvests, useGetAllHarvesters } from '../../hooks/InventoryRepository';
import { CiFilter } from "react-icons/ci";

const Inventory = () => {
    //state
    const [harvestBy, setHarvestBy] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    //hooks
    const createMutation = useCreateHarvest();
    const { data: harvestsData, isLoading: isHarvestsLoading, error: harvestsError } = useGetAllHarvests(harvestBy, fromDate, toDate);
    const harvests = harvestsData?.results || [];
    const { data: harvestersData, isLoading: isHarvestersLoading, error: harvestersError } = useGetAllHarvesters();
    //form
    const {register, handleSubmit, control, reset, formState: { errors }} = useForm<CreateHarvest>({
        defaultValues: {
            eggSize: "",
            eggCount: 0,
            harvestBy: "",
        },
    });

    //functions
    const { isOpen, onOpen, onClose } = useDisclosure();
    
    const onSubmit = async (data: CreateHarvest) => {
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

    //setters
    const handleHarvestByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setHarvestBy(e.target.value);
    };

    const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFromDate(e.target.value);
        // Clear toDate if fromDate is cleared
        if (!e.target.value) {
            setToDate("");
        }
    };

    const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setToDate(e.target.value);
    };

    // Helper function to format datetime
    const formatDateTime = (dateTimeString: string) => {
        try {
            const date = new Date(dateTimeString);
            return date.toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
        } catch (error) {
            return dateTimeString; // Return original if parsing fails
        }
    };


  return (
    <Box p={6} fontFamily="geist">
        <Box mb={6} display="flex" justifyContent="space-between" alignItems="center">
            <Text fontSize="2xl" fontWeight="bold">
                Inventory Management
            </Text>
            <Button colorScheme="blue" onClick={handleOpenCreate}>
                Create New Harvest Record
            </Button>
        </Box>
        <TableContainer  borderRadius="md" shadow="md" p="2">
            <HStack mb={4} justifyContent="end" alignItems="center" spacing={4} flexWrap="wrap">
                <IconButton aria-label="Search database" icon={<CiFilter />} />
                <Controller
                    name="harvestBy"
                    control={control}
                    render={() => (
                        <VStack mb={4} alignItems="start" justifyContent="space-between">
                            <Text fontSize="sm" fontWeight="medium" mb={-2}>Harvest By:</Text>
                            <Select
                                value={harvestBy}
                                placeholder="All Harvester"
                                onChange={handleHarvestByChange}
                            >
                                {harvestersData?.map((harvester) => (
                                    <option key={harvester} value={harvester}>{harvester}</option>
                                ))}
                            </Select>
                        </VStack>
                    )}
                />
                <VStack mb={4} alignItems="start" justifyContent="space-between">
                    <Text fontSize="sm" fontWeight="medium" mb={-2}>From Date:</Text>
                    <Input
                        type="date"
                        value={fromDate}
                        onChange={handleFromDateChange}
                        max={toDate || undefined}
                        width="200px"
                    />
                </VStack>
                <VStack mb={4} alignItems="start" justifyContent="space-between">
                    <Text fontSize="sm" fontWeight="medium" mb={-2}>To Date:</Text>
                    <Input
                        type="date"
                        value={toDate}
                        onChange={handleToDateChange}
                        min={fromDate || undefined}
                        disabled={!fromDate}
                        width="200px"
                        opacity={!fromDate ? 0.5 : 1}
                        cursor={!fromDate ? "not-allowed" : "pointer"}
                    />
                </VStack>
            </HStack>
      
            <Table variant="striped" size="sm" colorScheme="gray">
                <Thead>
                    <Tr 
                        borderColor="blue.200"
                        boxShadow="sm"
                    >
                        <Th 
                            fontWeight="semibold" 
                            textTransform="none"
                            fontSize="sm" 
                            letterSpacing="normal"
                            p={4}
                        >
                            Harvest By
                        </Th>
                        <Th 
                            fontWeight="semibold" 
                            textTransform="none"
                            fontSize="sm" 
                            letterSpacing="normal"
                            p={4}
                        >
                            Egg Size
                        </Th>
                        <Th 
                            fontWeight="semibold" 
                           
                            textTransform="none"
                            fontSize="sm" 
                            letterSpacing="normal"
                            p={4}
                        >
                            Egg Count
                        </Th>
                        <Th 
                            fontWeight="semibold" 
                            textTransform="none"
                            fontSize="sm" 
                            letterSpacing="normal"
                            py={5}
                            px={4}
                        >
                            Harvest Time
                        </Th>
                        <Th 
                            fontWeight="semibold" 
                            textTransform="none"
                            fontSize="sm" 
                            letterSpacing="normal"
                            p={4}
                        >
                            Actions
                        </Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {harvests?.map((harvest) => (
                        <Tr key={harvest.id}>
                            <Td>{harvest.harvestBy}</Td>
                            <Td>{harvest.eggSize}</Td>
                            <Td>{harvest.eggCount}</Td>
                            <Td>{formatDateTime(harvest.harvestTime)}</Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </TableContainer>
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    Add Harvest Record
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <form onSubmit={handleSubmit(onSubmit)} id="harvest-form">    
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
                        form="harvest-form"
                        colorScheme="blue"
                        mr={3}
                        isLoading={createMutation.isPending}
                    >
                        Create Harvest Record
                    </Button>
                    <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
    </Modal>    
    </Box>
    );
};

export default Inventory