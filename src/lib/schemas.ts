import { z } from "zod";

export const Year = z.string()
	.refine(x => x.length === 4 && Number(x) > 0)
	.brand("Year").describe("yyyy");

export const Now = z.literal("0").describe("until now");
export const YearRange = z.string()
	.trim()
	.refine(x => {
		const [l, r] = x.split("-");
		return Year.parse(l?.trim()) && z.union([Year, Now]).parse(r?.trim());
	}, "invalid range")
	.brand("YearRange").describe("yyyy - yyyy or yyyy - 0");
export const KwPS = z.string().describe("kW/PS");
