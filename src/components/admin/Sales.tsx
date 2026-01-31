import React, { useState } from 'react'
import { Box, Table, Thead, Tbody, Tr, Td, TableContainer, useDisclosure, Th, HStack, IconButton, VStack, Tab, TabList, TabIndicator, TabPanels, TabPanel, Tabs } from '@chakra-ui/react'
import { Text, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, FormControl, FormLabel, FormErrorMessage, Input, Textarea, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Select, Flex } from '@chakra-ui/react'
import { useForm, Controller } from "react-hook-form";
import { CreateSales } from '../../entiies/Dto/CreateSales';
import { useCreateSales, useGetAllSales, useGetAllTransactedByNames } from '../../hooks/SalesRepository';
import { CiFilter } from 'react-icons/ci';

const Sales = () => {
    //state
    const [transactedBy, setTransactedBy] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    //hooks
    const createMutation = useCreateSales();
    const { data: salesData, isLoading: isSalesLoading, error: salesError } = useGetAllSales(transactedBy, fromDate, toDate);
    const sales = salesData?.results || [];
    const { data: transactedByData, isLoading: isTransactedByLoading, error: transactedByError } = useGetAllTransactedByNames();
    //form
    const {register, handleSubmit, control, reset, formState: { errors }} = useForm<CreateSales>({
        defaultValues: {
            transactedBy: "",
            eggSize: "", 
            quantity: 0,
            totalSales: 0,
        },
    });

    //modal
    const { isOpen, onOpen, onClose } = useDisclosure();
    
    //fuctions
    const onSubmit = async (data: CreateSales) => {
        await createMutation.mutateAsync(data);
        onClose();
    };

    const handleOpenCreate = () => {
        reset({
            transactedBy: "",
            eggSize: "",
            quantity: 0,
            totalSales: 0,
        });
        onOpen();
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


    //setters
    const handleTransactedByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setTransactedBy(e.target.value);
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

  return (
  
            <Box p={6} fontFamily="geist">
            <Box mb={6} display="flex" justifyContent="space-between" alignItems="center">
                <Text fontSize="2xl" fontWeight="bold">
                    Sales Management
                </Text>
                <Button colorScheme="blue" onClick={handleOpenCreate}>
                    Create New Sales
                </Button>
            </Box>
            <TableContainer  borderRadius="md" shadow="md" p="2">
                <HStack mb={4} justifyContent="end" alignItems="center" spacing={4} flexWrap="wrap">
                    <IconButton aria-label="Search database" icon={<CiFilter />} />
                    <Controller
                        name="transactedBy"
                        control={control}
                        render={() => (
                            <VStack mb={4} alignItems="start" justifyContent="space-between">
                                <Text fontSize="sm" fontWeight="medium" mb={-2}>Transacted By:</Text>
                                <Select
                                    value={transactedBy}
                                    placeholder="All Transacted By"
                                    onChange={handleTransactedByChange}
                                >
                                    {transactedByData?.map((transactedBy) => (
                                        <option key={transactedBy} value={transactedBy}>{transactedBy}</option>
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
                                Transacted By
                            </Th>
                            <Th 
                                fontWeight="semibold" 
                                textTransform="none"
                                fontSize="sm" 
                                letterSpacing="normal"
                                p={4}
                            >
                                Transacted Date
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
                                Quantity
                            </Th>
                            <Th 
                                fontWeight="semibold" 
                                textTransform="none"
                                fontSize="sm" 
                                letterSpacing="normal"
                                p={4}
                            >
                                Total Sales
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
                        {sales?.map((sale) => (
                            <Tr key={sale.id}>
                                <Td>{sale.transactedBy}</Td>
                                <Td>{formatDateTime(sale.createdAt)}</Td>
                                <Td>{sale.eggSize}</Td>
                                <Td>{sale.quantity}</Td>
                                <Td>{sale.totalSales}</Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
            <Modal isOpen={isOpen} onClose={onClose} size="xl">
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>
                                Create New Sales
                            </ModalHeader>
                            <ModalCloseButton />
                            <ModalBody pb={6}>
                                <form onSubmit={handleSubmit(onSubmit)} id="sales-form">    
                                    <FormControl mb={4} isInvalid={!!errors.transactedBy}>
                                        <Flex justifyContent="space-between" alignItems="center">               
                                            <FormLabel>Title</FormLabel>             
                                            <FormErrorMessage mb={4}>{errors.transactedBy?.message}</FormErrorMessage>       
                                        </Flex>
                                        <Input
                                            {...register("transactedBy", {
                                                required: "Transacted By is required",
                                            })}
                                            placeholder="Enter transacted by"
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

                                    <FormControl mb={4} isInvalid={!!errors.quantity}>
                                        <Flex justifyContent="space-between" alignItems="center">               
                                            <FormLabel>Quantity</FormLabel>             
                                            <FormErrorMessage mb={4}>{errors.quantity?.message}</FormErrorMessage>       
                                        </Flex>
                                        <Controller
                                            name="quantity"
                                            control={control}
                                            rules={{
                                                required: "Quantity is required",
                                                min: { value: 0, message: "Quantity must be at least 0" },
                                                max: { value: 100, message: "Quantity must be at most 100" },
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
                                    <FormControl mb={4} isInvalid={!!errors.totalSales}>
                                        <Flex justifyContent="space-between" alignItems="center">               
                                            <FormLabel>Total Sales</FormLabel>             
                                            <FormErrorMessage mb={4}>{errors.totalSales?.message}</FormErrorMessage>       
                                        </Flex>
                                        <Input
                                            {...register("totalSales", {
                                                required: "Total Sales is required",
                                            })}
                                            placeholder="Enter total sales"
                                        />
                                    </FormControl>

                                </form>
                            </ModalBody>

                            <ModalFooter>
                                <Button
                                    type="submit"
                                    form="sales-form"
                                    colorScheme="blue"
                                    mr={3}
                                    isLoading={createMutation.isPending}
                                >
                                    Create Sales Record
                                </Button>
                                <Button onClick={onClose}>Cancel</Button>
                            </ModalFooter>
                        </ModalContent>
            </Modal>    
        </Box>
    );
};

export default Sales