import fs from "node:fs";
import path from "node:path";
import { fmt } from "../lib/fmt.ts";

export async function backup(filename: string) {
	const exists = await fs.promises.access(filename).then(
		() => true,
		() => false
	);
	if (!exists) {
		console.warn(
			fmt.Sprintf("file %s doesn't exist, skipping backup", filename)
		);
		return;
	}

	const extension = path.extname(filename); // with .
	const name = path.basename(filename, extension);
	const newName = fmt.Sprintf(
		"%s-%s%s",
		name,
		new Date().toISOString(),
		extension
	);

	const directory = path.dirname(filename);
	const copyPath = path.join(directory, newName);
	await fs.promises.copyFile(filename, copyPath);
	console.info(fmt.Sprintf("backup is successful; path = %s", copyPath));
}
