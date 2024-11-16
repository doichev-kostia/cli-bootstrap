import { err, ok, Result } from "neverthrow";

export const None = {
	__type: "None"
}

export type Option<A> = Result<A, typeof None>;

export const Option = {
	isNone<A>(opt: Option<A>) {
		return opt.isErr();
	},
	isSome<A>(opt: Option<A>) {
		return opt.isOk();
	}
};

export function toOption<A>(value?: A) {
	if (value === undefined || value === null) {
		return err(None);
	} else {
		return ok(value);
	}
}
