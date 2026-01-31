import React, { useState } from 'react'
import { Box, Table, Thead, Tbody, Tr, Td, TableContainer, useDisclosure, Th, HStack, IconButton, VStack } from '@chakra-ui/react'
import { Text, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, FormControl, FormLabel, FormErrorMessage, Input, Textarea, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Flex } from '@chakra-ui/react'
import { useForm, Controller } from "react-hook-form";
import { CreateExpense } from '../../entiies/Dto/CreateExpense';
import { useCreateExpense, useGetAllExpenses } from '../../hooks/ExpenseRepository';
import { CiFilter } from 'react-icons/ci';

const Expenses = () => {
    //state
    const [date, setDate] = useState("");

    //hooks
    const createMutation = useCreateExpense();
    const { data: expensesData, isLoading: isExpensesLoading, error: expensesError } = useGetAllExpenses(date);
    const expenses = expensesData?.results || [];

    //form
    const {register, handleSubmit, control, reset, formState: { errors }} = useForm<CreateExpense>({
        defaultValues: {
            name: "",
            description: "",
            cost: 0,
        },
    });

    //modal
    const { isOpen, onOpen, onClose } = useDisclosure();
    
    //functions
    const onSubmit = async (data: CreateExpense) => {
        await createMutation.mutateAsync(data);
        onClose();
    };

    const handleOpenCreate = () => {
        reset({
            name: "",
            description: "",
            cost: 0,
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

    //setter
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDate(e.target.value);
    };

  return (
    <Box p={6} fontFamily="geist">
        <Box mb={6} display="flex" justifyContent="space-between" alignItems="center">
            <Text fontSize="2xl" fontWeight="bold">
                Expenses Management
            </Text>
            <Button colorScheme="blue" onClick={handleOpenCreate}>
                Create New Expense
            </Button>
        </Box>
        <TableContainer  borderRadius="md" shadow="md" p="2">
            <HStack mb={4} justifyContent="end" alignItems="center" spacing={4} flexWrap="wrap">
                <IconButton aria-label="Search database" icon={<CiFilter />} />
                <VStack mb={4} alignItems="start" justifyContent="space-between">
                    <Text fontSize="sm" fontWeight="medium" mb={-2}>Date:</Text>
                    <Input
                        type="date"
                        value={date}
                        onChange={handleDateChange}
                        width="200px"
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
                            Name
                        </Th>
                        <Th 
                            fontWeight="semibold" 
                            textTransform="none"
                            fontSize="sm" 
                            letterSpacing="normal"
                            p={4}
                        >
                            Description
                        </Th>
                        <Th 
                            fontWeight="semibold" 
                            textTransform="none"
                            fontSize="sm" 
                            letterSpacing="normal"
                            p={4}
                        >
                            Cost
                        </Th>
                        <Th 
                            fontWeight="semibold" 
                            textTransform="none"
                            fontSize="sm" 
                            letterSpacing="normal"
                            p={4}
                        >
                            Created At
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
                    {expenses?.map((expense) => (
                        <Tr key={expense.id}>
                            <Td>{expense.name}</Td>
                            <Td>{expense.description}</Td>
                            <Td>{expense.cost.toLocaleString()}</Td>
                            <Td>{formatDateTime(expense.createdAt)}</Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </TableContainer>
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    Create New Expense
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <form onSubmit={handleSubmit(onSubmit)} id="expense-form">    
                        <FormControl mb={4} isInvalid={!!errors.name}>
                            <Flex justifyContent="space-between" alignItems="center">               
                                <FormLabel>Name</FormLabel>             
                                <FormErrorMessage mb={4}>{errors.name?.message}</FormErrorMessage>       
                            </Flex>
                            <Input
                                {...register("name", {
                                    required: "Name is required",
                                })}
                                placeholder="Enter expense name"
                            />
                        </FormControl>

                        <FormControl mb={4} isInvalid={!!errors.description}>   
                            <Flex justifyContent="space-between" alignItems="center">               
                                <FormLabel>Description</FormLabel>             
                                <FormErrorMessage mb={4}>{errors.description?.message}</FormErrorMessage>       
                            </Flex>
                            <Textarea
                                {...register("description", {
                                    required: "Description is required",
                                })}
                                placeholder="Enter expense description"
                                rows={4}
                            />
                        </FormControl>

                        <FormControl mb={4} isInvalid={!!errors.cost}>
                            <Flex justifyContent="space-between" alignItems="center">               
                                <FormLabel>Cost</FormLabel>             
                                <FormErrorMessage mb={4}>{errors.cost?.message}</FormErrorMessage>       
                            </Flex>
                            <Controller
                                name="cost"
                                control={control}
                                rules={{
                                    required: "Cost is required",
                                    min: { value: 0, message: "Cost must be at least 0" },
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <NumberInput
                                        value={value}
                                        onChange={(valueString, valueNumber) => onChange(valueNumber)}
                                        min={0}
                                        precision={2}
                                        step={0.01}
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
                        form="expense-form"
                        colorScheme="blue"
                        mr={3}
                        isLoading={createMutation.isPending}
                    >
                        Create Expense Record
                    </Button>
                    <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>    
    </Box>
  );
};

export default Expenses
