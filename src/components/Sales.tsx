import React from 'react'
import { Box, Table, Thead, Tbody, Tr, Td, TableContainer, useDisclosure, Th } from '@chakra-ui/react'
import { Text, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, FormControl, FormLabel, FormErrorMessage, Input, Textarea, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Select, Flex } from '@chakra-ui/react'
import { useForm, Controller } from "react-hook-form";
import { CreateSales } from '../entiies/Dto/CreateSales';
import { useCreateSales, useGetAllSales } from '../hooks/SalesRepository';

const Sales = () => {
    const createMutation = useCreateSales();
    const { data: salesData, isLoading: isSalesLoading, error: salesError } = useGetAllSales();
    const sales = salesData?.results || [];
    console.log(sales);
    const {register, handleSubmit, control, reset, formState: { errors }} = useForm<CreateSales>({
        defaultValues: {
            transactedBy: "",
            eggSize: "", 
            quantity: 0,
            totalSales: 0,
        },
    });

    const { isOpen, onOpen, onClose } = useDisclosure();
    
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
            <TableContainer >
        <Table variant="simple" size="sm">
            <Thead>
                <Tr>
                    <Th>Transacted By</Th>
                    <Th>Egg Size</Th>
                    <Th>Quantity</Th>
                    <Th>Total Sales</Th>
                    <Th>Actions</Th>
                </Tr>
            </Thead>
            <Tbody>
                {sales?.map((sale) => (
                    <Tr key={sale.id}>
                        <Td>{sale.transactedBy}</Td>
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