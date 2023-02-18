import '../lib/dayjs'
import { View, Text, ScrollView, Alert } from "react-native";
import { useCallback, useState } from 'react';

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const generateDay = generateDatesFromYearBeginning();
const minimunSummaryDatesSizes = 18 * 5;
const amountOfDaysToFill = minimunSummaryDatesSizes - generateDay.length;

import { Header } from "../Components/Header";
import { HabitDay, DAY_SIZE } from "../Components/HabitDay";
import { generateDatesFromYearBeginning } from "../utils/generate-dates-from-year-beginnirs";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { api } from '../lib/axios';
import { Loading } from '../Components/Loading';
import dayjs from 'dayjs';

type SummaryProps = Array<{
    id: string;
    date: string;
    amount: number;
    completed: number;

}>

export function Home() {
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState<SummaryProps | null>(null);

    const { navigate } = useNavigation();

    async function fetchDate() {

        try {
            setLoading(true);
            const response = await api.get("/summary");
            setSummary(response.data);
            console.log(response.data)

        } catch (error) {
            Alert.alert('Ops', 'Não foi possivel carregar o sumario de hábitos.');
            console.log(error);

        } finally {
            setLoading(false)
        }
    }

    useFocusEffect(useCallback(() => {
        fetchDate();
    },[]))

    if (loading) {
        return (
            <Loading />
        )
    }


    return (
        <View className="flex-1 bg-background px-8 pt-16 ">
            <Header />

            <View className="flex-row mt-6 mb-2">
                {
                    weekDays.map((weekDays, i) => {
                        return (
                            <Text key={`${weekDays}-${i}`}
                                className="text-zinc-400 text-xl font-bold text text-center mx-1"
                                style={{ width: DAY_SIZE }}
                            >
                                {weekDays}
                            </Text>
                        )
                    })
                }
            </View>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}>
                {summary &&
                    <View className="flex-row flex-wrap">
                        {
                            generateDay.map(date => {
                                const dayWithHabits = summary.find(day => {
                                    return dayjs(date).isSame(day.date, 'day')
                                })
                                return (
                                    <HabitDay
                                        key={date.toISOString()}
                                        onPress={() => navigate('habit', { date: date.toISOString() })}
                                        date={date}
                                        amountOfHabits={dayWithHabits?.amount}
                                        amountCompleted={dayWithHabits?.completed}
                                    />
                                )
                            })
                        }
                        {
                            amountOfDaysToFill > 0 && Array.from({ length: amountOfDaysToFill }).map((_, i) => {
                                return (
                                    <View
                                        key={i.toString()}
                                        className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
                                        style={{ width: DAY_SIZE, height: DAY_SIZE }}
                                    />
                                )
                            })
                        }
                    </View>}
            </ScrollView>


        </View>
    )
}