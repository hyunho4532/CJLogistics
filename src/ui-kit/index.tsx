export const meterToKm = (meter: number) => {
    return meter / 1000.0
}

export const millisecondToHHMMSS = (millisecond: number) => {
    const hour = Math.floor((millisecond / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((millisecond / (1000 * 60)) %  60);
    const seconds = Math.floor((millisecond / 1000) % 60);

    return hour + "시간 " + minutes + "분 " + seconds + "초"
}