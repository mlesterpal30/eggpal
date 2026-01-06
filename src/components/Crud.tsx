import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast, Toaster } from "sonner";
import InfiniteScroll from "react-infinite-scroll-component";
import {
    Box,
    Button,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
    Textarea,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Select,
    IconButton,
    Spinner,
    Text,
    Alert,
    AlertIcon,
    Flex,
} from "@chakra-ui/react";

import { Check } from "lucide-react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Kdrama } from "../entiies/Kdrama";
import { useGetKdramas, useCreateKdrama, useUpdateKdrama, useDeleteKdrama } from "../hooks/KdramaRepository";
import { useGetGenres } from "../hooks/KdramaRepository";
import useKrdramaQueryStore from "../store";
type KdramaFormData = Omit<Kdrama, "id">;

// Helper function to convert DateTime string to date-only format (YYYY-MM-DD)
// Extracts date directly from string to avoid timezone conversion issues
const formatDate = (dateString: string) => dateString.substring(0, 10);


const Crud = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedKdrama, setSelectedKdrama] = useState<Kdrama | null>(null);
    const setSelectedGenreId = useKrdramaQueryStore((s) => s.setGenreId);
    const setSelectedRating = useKrdramaQueryStore((s) => s.setRating);
    const kdramaQuery = useKrdramaQueryStore((s) => s.kdramaQuery);
    const [genreId, setGenreId] = useState(0);
    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<KdramaFormData>({
        defaultValues: {
            title: "",
            description: "",
            rating: 0,
            releaseDate: "",
            genreId: 0,
        },
    });

    const { 
        data, 
        isLoading, 
        error, 
        fetchNextPage, 
        hasNextPage, 
        isFetchingNextPage 
    } = useGetKdramas(genreId);
    const createMutation = useCreateKdrama();
    const updateMutation = useUpdateKdrama();
    const deleteMutation = useDeleteKdrama();
    const { data: genresData, isLoading: genresLoading, error: genresError } = useGetGenres();

    // Flatten all pages from infinite query
    const kdramas = data?.pages.flatMap(page => page.results) || [];
    const genres = genresData?.results || [];

    const handleOpenCreate = () => {
        setIsEditMode(false);
        setSelectedKdrama(null);
        reset({
            title: "",
            description: "",
            rating: 0,
            releaseDate: "",
            genreId: 0,
        });
        onOpen();
    };

    const handleOpenEdit = (kdrama: Kdrama) => {
        setIsEditMode(true);
        setSelectedKdrama(kdrama);
        reset({
            title: kdrama.title,
            description: kdrama.description,
            rating: kdrama.rating,
            releaseDate: formatDate(kdrama.releaseDate),
            genreId: kdrama.genreId,
        });
        onOpen();
    };

    const onSubmit = async (data: KdramaFormData) => {
        try {
            if (isEditMode && selectedKdrama) {
                await updateMutation.mutateAsync({
                    id: selectedKdrama.id,
                    data: { ...data, id: selectedKdrama.id } as Kdrama,
                });
                toast.success("Kdrama updated successfully");
            } else {
                await createMutation.mutateAsync({
                    ...data,
                    id: 0, // Will be set by backend
                } as Kdrama);
                toast.success("Kdrama created successfully");
            }
            onClose();
        } catch (error) {
            toast.error("Failed to save kdrama");
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this kdrama?")) {
            try {
                await deleteMutation.mutateAsync(id);
                toast.success("Kdrama deleted successfully");
            } catch (error) {
                toast.error("Failed to delete kdrama");
            }
        }
    };

    const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedGenreId = Number(e.target.value);
        setGenreId(selectedGenreId);
    };

    const handleRatingChange = (_: string, value: number) => {
        setSelectedRating(value);
      };



    return (
        <Box p={6}>
             <Toaster icons={{success: <Check />}} position="top-right" richColors={false} />
            <Box mb={6} display="flex" justifyContent="space-between" alignItems="center">
                <Text fontSize="2xl" fontWeight="bold">
                    Kdramas Management
                </Text>
                <Button colorScheme="blue" onClick={handleOpenCreate}>
                    Create New Kdrama
                </Button>
            </Box>
            
            <TableContainer
                id="scrollableDiv"
                h="75vh"
                overflowY="auto"
                overflowX="hidden"
                borderWidth="1px"
                borderRadius="md"
    >
        <Flex>
        <FormControl mb={4} >
                    <Flex justifyContent="space-between" alignItems="center">               
                        <FormLabel>Genre</FormLabel>      
                        <FormErrorMessage mb={4}>{errors.genreId?.message}</FormErrorMessage>       
                    </Flex> 
                    <Controller
                        name="genreId"
                        control={control}
                        rules={{ required: "Genre is required" }}
                        render={({ field }) => (
                            <Select
                            {...field}
                            placeholder={genresLoading ? "Loading genres..." : "Select genre"}
                            value={field.value || genreId}
                            isDisabled={genresLoading || !!genresError}
                            onChange={handleGenreChange}
                            >
                            {genres?.map((genre) => (
                                <option key={genre.id} value={genre.id}>
                                {genre.name}
                                </option>
                            ))}
                            </Select>
                        )}
                        />
                </FormControl>
                <FormControl mb={4}>
                               <Flex justifyContent="space-between" alignItems="center">               
                                    <FormLabel>Rating</FormLabel>      
                                    <FormErrorMessage mb={4}>{errors.rating?.message}</FormErrorMessage>       
                                </Flex>
                                <Controller
                                    name="rating"
                                    control={control}
                                    rules={{
                                        required: "Rating is required",
                                        min: { value: 0, message: "Rating must be at least 0" },
                                        max: { value: 10, message: "Rating must be at most 10" },
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <NumberInput
                                            value={kdramaQuery.rating}
                                            onChange={handleRatingChange}   
                                            min={0}
                                            max={10}
                                            precision={1}
                                            step={0.1}
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
        </Flex>
                
                <InfiniteScroll
                    dataLength={kdramas.length}
                    next={fetchNextPage}
                    hasMore={!!hasNextPage}
                    loader={null}
                    scrollableTarget="scrollableDiv"
                    scrollThreshold={1.0}
                >
                    <Table variant="simple" size="sm">
                            <Thead position="sticky" top={0} bg="white" zIndex={1}>
                                <Tr>
                                    <Th>Title</Th>
                                    <Th>Description</Th>
                                    <Th>Rating</Th>
                                    <Th>Release Date</Th>
                                    <Th>Genre</Th>
                                    <Th>Actions</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {isLoading ? (
                                    <Tr>
                                        <Td colSpan={6} textAlign="center" py={10}>
                                            <Spinner size="lg" />
                                            <Text mt={4}>Loading kdramas...</Text>
                                        </Td>
                                    </Tr>
                                ) : error ? (
                                    <Tr>
                                        <Td colSpan={6} textAlign="center" py={10}>
                                            <Alert status="error" justifyContent="center">
                                                <AlertIcon />
                                                <Text>Error loading kdramas: {error.message}</Text>
                                            </Alert>
                                        </Td>
                                    </Tr>
                                ) : kdramas.length === 0 ? (
                                    <Tr>
                                        <Td colSpan={6} textAlign="center">
                                            <Text>No kdramas found</Text>
                                        </Td>
                                    </Tr>
                                ) : (
                                    <>
                                        {kdramas.map((kdrama) => (
                                            <Tr key={kdrama.id}>
                                                <Td>{kdrama.title}</Td>
                                                <Td>
                                                    <Text noOfLines={2} maxW="300px">
                                                        {kdrama.description}
                                                    </Text>
                                                </Td>
                                                <Td>{kdrama.rating}</Td>
                                                <Td>{new Date(kdrama.releaseDate).toLocaleDateString()}</Td>
                                                <Td>{kdrama.genre.name}</Td>
                                                <Td>
                                                    <IconButton
                                                        aria-label="Edit"
                                                        icon={<EditIcon />}
                                                        colorScheme="blue"
                                                        size="sm"
                                                        mr={2}
                                                        onClick={() => handleOpenEdit(kdrama)}
                                                    />
                                                    <IconButton
                                                        aria-label="Delete"
                                                        icon={<DeleteIcon />}
                                                        colorScheme="red"
                                                        size="sm"
                                                        onClick={() => handleDelete(kdrama.id)}
                                                        isLoading={deleteMutation.isPending}
                                                    />
                                                </Td>
                                            </Tr>
                                        ))}
                                        {isFetchingNextPage && (
                                            <Tr>
                                                <Td colSpan={6} textAlign="center" py={4}>
                                                    <Spinner size="md" />
                                                    <Text mt={2}>Loading more...</Text>
                                                </Td>
                                            </Tr>
                                        )}
                                        {!hasNextPage && kdramas.length > 0 && (
                                            <Tr>
                                                <Td colSpan={6} textAlign="center" py={4}>
                                                    <Text color="gray.500">You have seen all kdramas</Text>
                                                </Td>
                                            </Tr>
                                        )}
                                    </>
                                )}
                            </Tbody>
                        </Table>
                </InfiniteScroll>
            </TableContainer>

            {/* Create/Update Modal */}
            <Modal isOpen={isOpen} onClose={onClose} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        {isEditMode ? "Edit Kdrama" : "Create New Kdrama"}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <form onSubmit={handleSubmit(onSubmit)} id="kdrama-form">
                            <FormControl mb={4} isInvalid={!!errors.title}>
                                <Flex justifyContent="space-between" alignItems="center">               
                                    <FormLabel>Title</FormLabel>             
                                    <FormErrorMessage mb={4}>{errors.title?.message}</FormErrorMessage>       
                                </Flex>
                                <Input
                                    {...register("title", {
                                        required: "Title is required",
                                        minLength: {
                                            value: 2,
                                            message: "Title must be at least 2 characters",
                                        },
                                    })}
                                    placeholder="Enter title"
                                />
                            </FormControl>

                            <FormControl mb={4} isInvalid={!!errors.description}>
                            <Flex justifyContent="space-between" alignItems="center">               
                                    <FormLabel>Desciption</FormLabel>             
                                    <FormErrorMessage mb={4}>{errors.description?.message}</FormErrorMessage>       
                                </Flex>
                                <Textarea
                                    {...register("description", {
                                        required: "Description is required",
                                        minLength: {
                                            value: 10,
                                            message: "Description must be at least 10 characters",
                                        },
                                    })}
                                    placeholder="Enter description"
                                    rows={4}
                                />
                            </FormControl>

                            <FormControl mb={4} isInvalid={!!errors.rating}>
                               <Flex justifyContent="space-between" alignItems="center">               
                                    <FormLabel>Rating</FormLabel>      
                                    <FormErrorMessage mb={4}>{errors.rating?.message}</FormErrorMessage>       
                                </Flex>
                                <Controller
                                    name="rating"
                                    control={control}
                                    rules={{
                                        required: "Rating is required",
                                        min: { value: 0, message: "Rating must be at least 0" },
                                        max: { value: 10, message: "Rating must be at most 10" },
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <NumberInput
                                            value={value}
                                            onChange={(_, valueAsNumber) =>
                                                onChange(isNaN(valueAsNumber) ? 0 : valueAsNumber)
                                            }
                                            min={0}
                                            max={10}
                                            precision={1}
                                            step={0.1}
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

                            <FormControl mb={4} isInvalid={!!errors.releaseDate}>
                                <Flex justifyContent="space-between" alignItems="center">               
                                    <FormLabel>Release Date</FormLabel>      
                                    <FormErrorMessage mb={4}>{errors.releaseDate?.message}</FormErrorMessage>       
                                </Flex>                        
                                <Input
                                    type="date"
                                    {...register("releaseDate", {
                                        required: "Release date is required",
                                    })}
                                />
                            </FormControl>

                            <FormControl mb={4} isInvalid={!!errors.genreId}>
                                <Flex justifyContent="space-between" alignItems="center">               
                                    <FormLabel>Genre</FormLabel>      
                                    <FormErrorMessage mb={4}>{errors.genreId?.message}</FormErrorMessage>       
                                </Flex> 
                                <Controller
                                    name="genreId"
                                    control={control}
                                    rules={{ required: "Genre is required" }}
                                    render={({ field }) => (
                                        <Select
                                        {...field}
                                        placeholder={genresLoading ? "Loading genres..." : "Select genre"}
                                        isDisabled={genresLoading || !!genresError}
                                        onChange={(e) => {
                                            const selectedGenreId = Number(e.target.value);
                                            field.onChange(selectedGenreId);
                                        }}
                                        >
                                        {genres?.map((genre) => (
                                            <option key={genre.id} value={genre.id}>
                                            {genre.name}
                                            </option>
                                        ))}
                                        </Select>
                                    )}
                                    />
                            </FormControl>
                        </form>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            type="submit"
                            form="kdrama-form"
                            colorScheme="blue"
                            mr={3}
                            isLoading={createMutation.isPending || updateMutation.isPending}
                        >
                            {isEditMode ? "Update" : "Create"}
                        </Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default Crud;