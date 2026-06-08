import { 
  Toaster as ChakraToaster, 
  Portal, 
  Spinner, 
  Stack, 
  Toast, 
  createToaster 
} from "@chakra-ui/react";

// Initialize the toaster instance
export const toaster = createToaster({
  placement: "bottom-end",
  pauseOnPageIdle: true,
});

export const Toaster = () => {
  return (
    <Portal>
      <ChakraToaster toaster={toaster}>
        {(toast) => (
          <Toast.Root width={{ md: "sm" }} p={4} bg="gray.800" color="white" borderRadius="md" boxShadow="lg" display="flex" alignItems="center" gap={3}>
            {toast.type === "loading" ? (
              <Spinner size="sm" color="blue.solid" />
            ) : (
              <Toast.Indicator />
            )}
            <Stack gap="1" flex="1" maxWidth="100%">
              {toast.title && <Toast.Title fontWeight="bold">{toast.title}</Toast.Title>}
              {toast.description && (
                <Toast.Description fontSize="sm" color="gray.300">{toast.description}</Toast.Description>
              )}
            </Stack>
            {toast.action && (
              <Toast.ActionTrigger>{toast.action.label}</Toast.ActionTrigger>
            )}
            {toast.meta?.closable && <Toast.CloseTrigger />}
          </Toast.Root>
        )}
      </ChakraToaster>
    </Portal>
  );
};
