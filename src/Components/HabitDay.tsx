import { Dimensions, TouchableOpacity, TouchableOpacityProps } from "react-native"
import { GenerateProgressProcentage } from "../utils/generate-progress-procentage";
import clsx from "clsx";
import dayjs from "dayjs";

const WEEK_DAYS = 7;
const SCREEN_HORIZONTAL_PADDING = (32 * 2) / 5

export const DAY_MARGIN_BETWWEN = 8;
export const DAY_SIZE = (Dimensions.get('screen').width / WEEK_DAYS) - (SCREEN_HORIZONTAL_PADDING + 5);

interface Props extends TouchableOpacityProps {
    amountOfHabits?: number;
    amountCompleted?: number;
    date: Date
}

export function HabitDay({ amountCompleted = 0, amountOfHabits = 0, date, ...res }: Props) {
    const amountAccomplishedPorcentage = amountOfHabits > 0 ? GenerateProgressProcentage(amountCompleted, amountOfHabits) : 0;
    const toDay =dayjs().startOf('day').toDate()
    const isCurrentDay = dayjs(date).isSame(toDay)
    return (
        <TouchableOpacity
            className={clsx("rounded-lg border-2 m-1", {
                ["bg-zinc-900 border-zinc-800"]: amountAccomplishedPorcentage === 0,
                ["bg-violet-900 border-violet-700"]: amountAccomplishedPorcentage > 0 && amountAccomplishedPorcentage < 20,
                ["bg-violet-800 border-violet-600"]: amountAccomplishedPorcentage >= 20 && amountAccomplishedPorcentage < 40,
                ["bg-violet-700 border-violet-500"]: amountAccomplishedPorcentage >= 40 && amountAccomplishedPorcentage < 60,
                ["bg-violet-600 border-violet-500"]: amountAccomplishedPorcentage >= 60 && amountAccomplishedPorcentage < 80,
                ["bg-violet-500 border-violet-400"]: amountAccomplishedPorcentage >= 80,
                ["border-white border-4"]: isCurrentDay
            })}
            style={{ width: DAY_SIZE, height: DAY_SIZE }}
            activeOpacity={0.7}
            {...res}
        />
    )
}