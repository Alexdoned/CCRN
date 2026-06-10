import { useState, useEffect } from "react";
import { 
  Box, 
  Container, 
  Heading, 
  Text, 
  Stack, 
  Flex, 
  Input, 
  Button, 
  Badge, 
  Spinner, 
  SimpleGrid
} from "@chakra-ui/react";
import { toaster } from "../components/ui/toaster";
import axios from "axios";
import { LuCheck, LuArrowLeft, LuCreditCard } from "react-icons/lu";
import { denaryParishData } from "../data/denaryParishData.js";

export const Register = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    denary: "",
    parish: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: ""
  });

  useEffect(() => {
    // Preselect denary if provided via query param (from Home card select)
    try {
      const params = new URLSearchParams(window.location.search);
      const d = params.get('denary');
      const p = params.get('parish');
      if (d && denaryParishData[d]) {
        // if parish provided and exists within denary, set it
        if (p && denaryParishData[d].includes(p)) {
          setFormData((prev) => ({ ...prev, denary: d, parish: p }));
        } else {
          setFormData((prev) => ({ ...prev, denary: d, parish: "" }));
        }
      } else if (p) {
        // If only parish provided (rare), try to find its denary
        for (const [key, arr] of Object.entries(denaryParishData)) {
          if (arr.includes(p)) {
            setFormData((prev) => ({ ...prev, denary: key, parish: p }));
            break;
          }
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);
  
  
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [errors, setErrors] = useState({});
  const [registeredUser, setRegisteredUser] = useState(null);

  const registrationAmount = 20.00; // Fixed registration fee

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear errors when typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }

    // Reset parish if denary changes
    if (name === "denary") {
      setFormData((prev) => ({ ...prev, denary: value, parish: "" }));
    }
  };

  const validateStep1 = () => {
    const stepErrors = {};
    if (!formData.fullName.trim()) stepErrors.fullName = "Full Name is required.";
    if (!formData.email.trim()) {
      stepErrors.email = "Email address is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      stepErrors.email = "Please enter a valid email address.";
    }
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const validateStep2 = () => {
    const stepErrors = {};
    if (!formData.denary) stepErrors.denary = "Please select your Denary.";
    if (!formData.parish) stepErrors.parish = "Please select your Parish.";
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const validateStep3 = () => {
    const stepErrors = {};
    if (!formData.cardNumber.replace(/\s/g, "")) {
      stepErrors.cardNumber = "Card number is required.";
    } else if (formData.cardNumber.replace(/\s/g, "").length < 16) {
      stepErrors.cardNumber = "Card number must be 16 digits.";
    }
    if (!formData.cardExpiry.trim()) stepErrors.cardExpiry = "Expiry date is required.";
    if (!formData.cardCvc.trim()) {
      stepErrors.cardCvc = "CVC is required.";
    } else if (formData.cardCvc.length < 3) {
      stepErrors.cardCvc = "CVC must be 3 or 4 digits.";
    }
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const nextStep = () => {
    if (step === 1 && validateStep1()) setStep(2);
    if (step === 2 && validateStep2()) setStep(3);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handlePaymentAndSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep3()) return;

    setIsProcessingPayment(true);
    
    // Simulate mock payment delay (2 seconds)
    setTimeout(async () => {
      try {
        const mockTransactionId = "TXN-" + Math.random().toString(36).substring(2, 11).toUpperCase();
        
        const payload = {
          fullName: formData.fullName,
          email: formData.email,
          denary: formData.denary,
          parish: formData.parish,
          amount: registrationAmount,
          transactionId: mockTransactionId,
          paymentStatus: "Completed"
        };

        const res = await axios.post("/api/registrations", payload);
        
        if (res.data.success) {
          setRegisteredUser(res.data.data);
          toaster.create({
            title: "Registration Success",
            description: "Thank you! Your payment has been processed successfully.",
            type: "success",
          });
          setStep(4);
        }
      } catch (err) {
        console.error("Registration error:", err);
        const errMsg = err.response?.data?.message || "Something went wrong during registration. Please try again.";
        toaster.create({
          title: "Registration Failed",
          description: errMsg,
          type: "error",
        });
      } finally {
        setIsProcessingPayment(false);
      }
    }, 2000);
  };

  return (
    <Box bg="rgb(10, 15, 30)" color="white" minH="calc(100vh - 64px)" py={16}>
      <Container maxW="2xl">
        <Stack gap={4} mb={10} textAlign="center">
          <Badge
            alignSelf="center"
            bg="rgba(6, 182, 212, 0.15)"
            color="cyan.400"
            fontSize="xs"
            fontWeight="bold"
            px={3}
            py={1}
            borderRadius="full"
            border="1px solid rgba(6, 182, 212, 0.3)"
            textTransform="uppercase"
            letterSpacing="wider"
          >
            Form
          </Badge>
          <Heading as="h1" size="2xl" fontWeight="bold">
            Event Registration & Payment
          </Heading>
          <Text color="gray.400">
            Secure your spot in our upcoming diocesan assemblies and gatherings.
          </Text>
        </Stack>

        {/* Stepper indicator */}
        {step < 4 && (
          <Flex justify="space-between" mb={10} px={4} position="relative">
            {/* Background Line */}
            <Box
              position="absolute"
              top="50%"
              left={10}
              right={10}
              h="2px"
              bg="rgba(255, 255, 255, 0.1)"
              transform="translateY(-50%)"
              zIndex={1}
            />
            {/* Active Progress Line */}
            <Box
              position="absolute"
              top="50%"
              left={10}
              w={`${((step - 1) / 2) * 80}%`}
              h="2px"
              bg="cyan.400"
              transform="translateY(-50%)"
              zIndex={1}
              transition="all 0.3s"
            />
            {[1, 2, 3].map((s) => (
              <Flex
                key={s}
                zIndex={2}
                w={10}
                h={10}
                borderRadius="full"
                bg={step > s ? "cyan.400" : step === s ? "rgb(10, 15, 30)" : "rgba(255,255,255,0.06)"}
                border="2px solid"
                borderColor={step >= s ? "cyan.400" : "rgba(255,255,255,0.15)"}
                color={step > s ? "rgb(10, 15, 30)" : step === s ? "cyan.400" : "gray.400"}
                fontWeight="bold"
                align="center"
                justify="center"
                fontSize="sm"
                transition="all 0.3s"
              >
                {step > s ? <LuCheck size={18} /> : s}
              </Flex>
            ))}
          </Flex>
        )}

        {/* Form Container */}
        <Box
          bg="rgba(255, 255, 255, 0.02)"
          borderRadius="2xl"
          border="1px solid rgba(255, 255, 255, 0.06)"
          p={{ base: 6, md: 8 }}
          boxShadow="xl"
          backdropFilter="blur(10px)"
        >
          {/* Step 1: Contact Information */}
          {step === 1 && (
            <Stack gap={5}>
              <Heading size="md" fontWeight="bold">Step 1: Contact Details</Heading>
              
              <Stack gap={1.5}>
                <Text fontSize="sm" color="gray.350">Full Name</Text>
                <Input
                  name="fullName"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  bg="rgba(255, 255, 255, 0.03)"
                  borderColor="rgba(255, 255, 255, 0.1)"
                  _focus={{ borderColor: "cyan.500" }}
                />
                {errors.fullName && <Text color="red.400" fontSize="xs">{errors.fullName}</Text>}
              </Stack>

              <Stack gap={1.5}>
                <Text fontSize="sm" color="gray.350">Email Address</Text>
                <Input
                  name="email"
                  type="email"
                  placeholder="johndoe@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  bg="rgba(255, 255, 255, 0.03)"
                  borderColor="rgba(255, 255, 255, 0.1)"
                  _focus={{ borderColor: "cyan.500" }}
                />
                {errors.email && <Text color="red.400" fontSize="xs">{errors.email}</Text>}
              </Stack>

              <Button
                bgGradient="to-r"
                gradientFrom="cyan.500"
                gradientTo="blue.600"
                color="white"
                onClick={nextStep}
                mt={4}
                _hover={{ opacity: 0.9 }}
              >
                Next Step
              </Button>
            </Stack>
          )}

          {/* Step 2: Church Affiliation */}
          {step === 2 && (
            <Stack gap={5}>
              <Heading size="md" fontWeight="bold">Step 2: Parish Affiliation</Heading>

              <Text color="gray.400" fontSize="sm">
                Pick a Denary below and then choose your Parish from the matching list.
              </Text>

              <Stack gap={1.5}>
                <Text fontSize="sm" color="gray.350">Select Denary</Text>
                <select
                  name="denary"
                  value={formData.denary}
                  onChange={handleInputChange}
                  style={{
                    backgroundColor: "rgb(20, 25, 45)",
                    color: "white",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "6px",
                    padding: "8px 12px",
                    outline: "none"
                  }}
                >
                  <option value="">-- Select Denary --</option>
                  {Object.keys(denaryParishData).map((denary) => (
                    <option key={denary} value={denary}>{denary}</option>
                  ))}
                </select>
                {errors.denary && <Text color="red.400" fontSize="xs">{errors.denary}</Text>}
              </Stack>

              <Stack gap={1.5}>
                <Text fontSize="sm" color="gray.350">Select Parish</Text>
                <select
                  name="parish"
                  value={formData.parish}
                  onChange={handleInputChange}
                  disabled={!formData.denary}
                  style={{
                    backgroundColor: formData.denary ? "rgb(20, 25, 45)" : "rgba(255,255,255,0.03)",
                    color: formData.denary ? "white" : "rgba(255,255,255,0.3)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "6px",
                    padding: "8px 12px",
                    outline: "none"
                  }}
                >
                  <option value="">-- Select Parish --</option>
                  {formData.denary && denaryParishData[formData.denary].map((parish) => (
                    <option key={parish} value={parish}>{parish}</option>
                  ))}
                </select>
                {errors.parish && <Text color="red.400" fontSize="xs">{errors.parish}</Text>}
              </Stack>

              <Flex gap={4} mt={4}>
                <Button variant="outline" color="white" onClick={prevStep} flex="1" borderColor="rgba(255,255,255,0.15)" _hover={{ bg: "rgba(255,255,255,0.05)" }}>
                  <LuArrowLeft style={{ marginRight: "6px" }} /> Back
                </Button>
                <Button bgGradient="to-r" gradientFrom="cyan.500" gradientTo="blue.600" color="white" onClick={nextStep} flex="2" _hover={{ opacity: 0.9 }}>
                  Continue
                </Button>
              </Flex>
            </Stack>
          )}

          {/* Step 3: Mock Payment Gateway */}
          {step === 3 && (
            <Stack gap={5} as="form" onSubmit={handlePaymentAndSubmit}>
              <Heading size="md" fontWeight="bold">Step 3: Secure Checkout</Heading>

              {/* Order Summary Box */}
              <Box bg="rgba(255,255,255,0.02)" border="1px solid rgba(255,255,255,0.05)" p={4} borderRadius="xl" mb={2}>
                <Flex justify="space-between" align="center">
                  <Text color="gray.400" fontSize="sm">Event Access Pass</Text>
                  <Text fontWeight="bold" color="cyan.400" fontSize="lg">${registrationAmount.toFixed(2)}</Text>
                </Flex>
              </Box>

              <Stack gap={4}>
                <Stack gap={1.5}>
                  <Text fontSize="sm" color="gray.350">Cardholder Name</Text>
                  <Input
                    placeholder={formData.fullName}
                    bg="rgba(255,255,255,0.01)"
                    borderColor="rgba(255, 255, 255, 0.1)"
                    readOnly
                  />
                </Stack>

                <Stack gap={1.5}>
                  <Text fontSize="sm" color="gray.350">Card Number</Text>
                  <Flex align="center" position="relative">
                    <Input
                      name="cardNumber"
                      placeholder="4000 1234 5678 9010"
                      maxLength="19"
                      value={formData.cardNumber}
                      onChange={(e) => {
                        // Formatting input as 4-digit groups
                        const val = e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
                        setFormData({ ...formData, cardNumber: val });
                        if (errors.cardNumber) setErrors({ ...errors, cardNumber: "" });
                      }}
                      bg="rgba(255, 255, 255, 0.03)"
                      borderColor="rgba(255, 255, 255, 0.1)"
                      _focus={{ borderColor: "cyan.500" }}
                      pl={10}
                    />
                    <Flex position="absolute" left={3.5} color="gray.450"><LuCreditCard size={18} /></Flex>
                  </Flex>
                  {errors.cardNumber && <Text color="red.400" fontSize="xs">{errors.cardNumber}</Text>}
                </Stack>

                <SimpleGrid columns={2} gap={4}>
                  <Stack gap={1.5}>
                    <Text fontSize="sm" color="gray.350">Expiration</Text>
                    <Input
                      name="cardExpiry"
                      placeholder="MM/YY"
                      maxLength="5"
                      value={formData.cardExpiry}
                      onChange={(e) => {
                        let val = e.target.value.replace(/\D/g, "");
                        if (val.length > 2) {
                          val = val.substring(0, 2) + "/" + val.substring(2, 4);
                        }
                        setFormData({ ...formData, cardExpiry: val });
                        if (errors.cardExpiry) setErrors({ ...errors, cardExpiry: "" });
                      }}
                      bg="rgba(255, 255, 255, 0.03)"
                      borderColor="rgba(255, 255, 255, 0.1)"
                      _focus={{ borderColor: "cyan.500" }}
                    />
                    {errors.cardExpiry && <Text color="red.400" fontSize="xs">{errors.cardExpiry}</Text>}
                  </Stack>
                  <Stack gap={1.5}>
                    <Text fontSize="sm" color="gray.350">CVC</Text>
                    <Input
                      name="cardCvc"
                      type="password"
                      placeholder="123"
                      maxLength="4"
                      value={formData.cardCvc}
                      onChange={handleInputChange}
                      bg="rgba(255, 255, 255, 0.03)"
                      borderColor="rgba(255, 255, 255, 0.1)"
                      _focus={{ borderColor: "cyan.500" }}
                    />
                    {errors.cardCvc && <Text color="red.400" fontSize="xs">{errors.cardCvc}</Text>}
                  </Stack>
                </SimpleGrid>
              </Stack>

              <Flex gap={4} mt={6}>
                <Button
                  variant="outline"
                  color="white"
                  onClick={prevStep}
                  disabled={isProcessingPayment}
                  borderColor="rgba(255,255,255,0.15)"
                  _hover={{ bg: "rgba(255,255,255,0.05)" }}
                >
                  <LuArrowLeft /> Back
                </Button>
                <Button
                  type="submit"
                  bgGradient="to-r"
                  gradientFrom="cyan.500"
                  gradientTo="blue.600"
                  color="white"
                  flex="1"
                  disabled={isProcessingPayment}
                  _hover={{ opacity: 0.9 }}
                >
                  {isProcessingPayment ? (
                    <Flex align="center" justify="center" gap={2}>
                      <Spinner size="xs" /> Processing...
                    </Flex>
                  ) : (
                    `Pay $${registrationAmount.toFixed(2)}`
                  )}
                </Button>
              </Flex>
            </Stack>
          )}

          {/* Step 4: Success View */}
          {step === 4 && registeredUser && (
            <Stack gap={6} align="center" textAlign="center" py={4}>
              <Flex
                w={16}
                h={16}
                borderRadius="full"
                bg="rgba(34, 197, 94, 0.15)"
                border="2px solid"
                borderColor="green.500"
                color="green.400"
                align="center"
                justify="center"
              >
                <LuCheck size={36} />
              </Flex>

              <Stack gap={2}>
                <Heading size="xl" color="green.400" fontWeight="bold">Registration Completed!</Heading>
                <Text color="gray.350">
                  A confirmation email with receipts has been sent to <strong>{registeredUser.email}</strong>.
                </Text>
              </Stack>

              {/* Receipt Box */}
              <Box
                bg="rgba(255, 255, 255, 0.02)"
                border="1px solid rgba(255,255,255,0.05)"
                p={6}
                borderRadius="xl"
                w="100%"
                textAlign="left"
              >
                <Heading size="xs" textTransform="uppercase" letterSpacing="wider" color="gray.450" mb={4}>
                  Registration Details
                </Heading>
                <SimpleGrid columns={2} gap={4} fontSize="sm">
                  <Text color="gray.400">Registrant:</Text>
                  <Text fontWeight="semibold" textAlign="right">{registeredUser.fullName}</Text>
                  
                  <Text color="gray.400">Parish:</Text>
                  <Text fontWeight="semibold" textAlign="right" noOfLines={1}>{registeredUser.parish}</Text>
                  
                  <Text color="gray.400">Denary:</Text>
                  <Text fontWeight="semibold" textAlign="right">{registeredUser.denary}</Text>
                  
                  <Text color="gray.400">Amount Paid:</Text>
                  <Text fontWeight="bold" color="cyan.400" textAlign="right">${registeredUser.amount.toFixed(2)}</Text>
                  
                  <Text color="gray.400">Transaction ID:</Text>
                  <Text color="gray.350" fontSize="xs" fontFamily="mono" textAlign="right">{registeredUser.transactionId}</Text>
                </SimpleGrid>
              </Box>

              <Button
                bg="cyan.600"
                color="white"
                _hover={{ bg: "cyan.750" }}
                onClick={() => {
                  setFormData({
                    fullName: "",
                    email: "",
                    denary: "",
                    parish: "",
                    cardNumber: "",
                    cardExpiry: "",
                    cardCvc: ""
                  });
                  setStep(1);
                  setRegisteredUser(null);
                }}
                w="100%"
                mt={2}
              >
                Register Another Person
              </Button>
            </Stack>
          )}
        </Box>

      </Container>
    </Box>
  );
};
