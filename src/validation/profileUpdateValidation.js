import { z } from "zod";

export const profileUpdateSchema = z.object({
    nickname: z
        .string()
        .min(2, "Никнейм должен содержать минимум 2 символа")
        .max(30, "Никнейм не должен превышать 30 символов")
        .regex(/^[a-zA-Zа-яА-Я0-9_]+$/, "Никнейм может содержать только буквы, цифры и подчёркивание"),

    userHeight: z.coerce
        .number({ message: "Рост должен быть числом" })
        .min(120, "Рост не может быть меньше 120 см")
        .max(240, "Рост не должен превышать 240 см"),

    userAge: z.coerce
        .number({ message: "Возраст должен быть числом" })
        .min(12, "Минимальный возраст — 12 лет")
        .max(99, "Максимальный возраст — 99 лет")
        .int("Возраст должен быть целым числом"),
    
    activity: z.enum(["passive", "low", "medium", "high", "ultra"], {
        message: "Выберите уровень активности",
    }),

    goal: z.enum(["fit", "weightMaintenance", "bodyBuild"], {
        message: "Выберите цель",
    }),

    goalWeight: z.coerce
        .number({ message: "Целевой вес должен быть числом" })
        .min(30, "Целевой вес не может быть меньше 30 кг")
        .max(250, "Целевой вес не должен превышать 250 кг"),
})