export const natsWrapper = {
    client: {
        // Mock function
        publish: jest.fn().mockImplementation((subject: string, data: string, callback: () => void) => {
            callback()
        }),
    }
};