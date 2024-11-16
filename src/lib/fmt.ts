import { sprintf } from "@std/fmt/printf";

function Sprintf(pattern: string, ...args: unknown[]): string {
	return sprintf(pattern, args);
}

function Errorf(pattern: string, ...args: unknown[]): Error {
	return new Error(Sprintf(pattern, args));
}

export const fmt = {
	Sprintf,
	Errorf,
};
