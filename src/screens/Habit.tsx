import { View, ScrollView, Text, Alert } from "react-native";
import { useRoute } from "@react-navigation/native";
import dayjs from "dayjs";

import { BackButton } from "../Components/BackButton";
import { ProgressBar } from "../Components/ProgressBar";
import { CheckBox } from "../Components/CheckBox";
import { useEffect, useState } from "react";
import { Loading } from "../Components/Loading";
import { api } from "../lib/axios";
import { GenerateProgressProcentage } from "../utils/generate-progress-procentage";
import { HabitEmpaty } from "../Components/HabitEmpaty";
import clsx from "clsx";

interface Params {
    date: string
}

interface DayInfoProps {
    completedHabits: string[];
    possibleHabits: {
        id: string,
        title: string,
    }[];
}

export function Habits() {

    const route = useRoute();
    const { date } = route.params as Params;

    const [loading, setLoading] = useState(true);
    const [dayInfo, setdayInfo] = useState<DayInfoProps | null>(null);
    const [completedHabits, setcompletedHabits] = useState<String[]>([]);

    const parseDate = dayjs(date);
    const dayOfWeek = parseDate.format('dddd')
    const dayAndWeek = parseDate.format("DD/MM")
    const isDateInPast = parseDate.endOf('day').isBefore(new Date());


    const habitProgress = dayInfo?.possibleHabits.length ? GenerateProgressProcentage(dayInfo.possibleHabits.length, completedHabits.length) : 0;

    async function fetcHabits() {
        try {
            setLoading(true)
            const response = await api.get('/day', { params: { date } });
            setdayInfo(response.data)
            setcompletedHabits(response.data.completedHabits)
            console.log(response);

        } catch (error) {
            console.log(error);
            Alert.alert('Ops', 'Não foi posssivel carregar as informações dos habitos')
        } finally {
            setLoading(false)
        }
    }

    async function handleTogglehabit(habitId: string) {
        try {
            await api.patch(`/habits/${habitId}/toggle`)
            if (completedHabits.includes(habitId)) {
                setcompletedHabits(prevState => prevState.filter(habit => habit !== habitId))
            } else {
                setcompletedHabits(prevState => [...prevState, habitId])
            }
        } catch (error) {
            console.log(error);
            Alert.alert("Ops", 'Não foi possivel atualizar o status do habito.')
        }
    }

    useEffect(() => {
        fetcHabits()
    }, [])

    if (loading) {
        return (
            <Loading />
        );
    };

    return (
        <View className="flex-1 bg-background px-8 pt-16">
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >

                <BackButton />

                <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
                    {dayOfWeek}
                </Text>
                <Text className="text-white font-extrabold text-3xl">
                    {dayAndWeek}
                </Text>

                <ProgressBar progress={habitProgress} />

                <View className={clsx("mt-6", {
                    ['opacity-50']: isDateInPast
                }
                )}>
                    {
                        dayInfo?.possibleHabits ? dayInfo?.possibleHabits.map(habit => (
                            <CheckBox
                                key={habit.id}
                                title={habit.title}
                                checked={completedHabits.includes(habit.id)}
                                disabled={isDateInPast}
                                onPress={() => { handleTogglehabit(habit.id) }}
                            />
                        )
                        ) : <HabitEmpaty />
                    }
                </View>{
                    isDateInPast && (
                        <Text
                            className="text-white mt-10 text-center">
                            Você não pode editar habitos de uma data passada
                        </Text>
                    )
                }

            </ScrollView>

        </View>
    )
}