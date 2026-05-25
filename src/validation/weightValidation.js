import z from "zod";

export const weightSchema = z.object({
    userId: z.coerce.number(),
    
    weight: z.coerce
            .number({ message: "Вес должен быть числом" })
            .min(30, "Вес не может быть меньше 30 кг")
            .max(250, "Вес не должен превышать 250 кг"),
})