import * as path from "node:path";
import fs from "node:fs";
import { run } from "./run.ts";
import { once } from "node:events";

async function main() {
	const outfile = path.resolve("logs", "main.log");
	const exists = await fs.promises.access(outfile).then(() => true, () => false);
	if (!exists) {
		await fs.promises.writeFile(outfile, "");
	}

	const out = fs.createWriteStream(outfile);
	await once(out, "open");

	const result = await run(process.argv, process.stdin, out, (key) => process.env[key], process.cwd);

	if (result.isErr()) {
		const err = result._unsafeUnwrapErr();
		console.error(err);
		if (err instanceof Error && err.stack != null) {
			console.log("Stack trace: ", err.stack);
		}
		if (err instanceof Error && err.cause != null) {
			console.error("Cause: ", err.cause);
		}
		process.exit(69);
	}
}

void main();
