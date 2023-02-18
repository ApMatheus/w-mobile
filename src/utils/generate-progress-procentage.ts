export function GenerateProgressProcentage(amount: number, completed: number) {
    return Math.round((amount / completed) * 100);
}