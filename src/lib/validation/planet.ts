import { Static, Type } from "@sinclair/typebox";

export const planetSchema = Type.Object(
    {
        name: Type.String(),
        moons: Type.Integer(),
        description: Type.Optional(Type.String()),
    },
    { additionalProperties: false }
);

export type PlanetDate = Static<typeof planetSchema>;
