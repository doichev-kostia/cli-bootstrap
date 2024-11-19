import { ulid } from "@std/ulid";
import { fmt } from "./fmt.ts";

const prefixes = {
	vehicle: "vhc",
	engine: "eng",
} as const;

export function createId(prefix: keyof typeof prefixes): string {
	return fmt.Sprintf("%s_%s", prefixes[prefix], ulid());
}

