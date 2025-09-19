import * as bcrypt from "bcrypt";

export const Hash = (key: string, saltRounds: number = Number(process.env.SALT_ROUNDS)): string => {
    return bcrypt.hashSync(key, saltRounds);
}

//----------------------------------------------------------------------------------------------------------------

export const Compare = (key: string, hashed: string): boolean => {
    return bcrypt.compareSync(key, hashed)
}