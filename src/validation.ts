
export function validateCustomerInput(input: unknown): string {
    if (typeof input !== "string") {
        throw new TypeError("Input must be a string.");
    }
    const cleaned = input.trim();
    if (cleaned === "") {
        throw new Error("Input cannot be empty.");
    }
    if (!cleaned.includes("@")) {
        throw new Error("Input must be a valid email address.");
    }
    return cleaned;
}