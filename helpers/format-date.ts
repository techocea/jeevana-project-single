export const formatDate = (dateVal: any) => {
    if (!dateVal) return undefined;

    const date = dateVal instanceof Date ? dateVal : new Date(dateVal);

    if (isNaN(date.getTime())) return "";

    // Extracts only the 'YYYY-MM-DD' segment safely regardless of local timezones
    return date.toISOString().split("T")[0];
};

export function getAccurateAge(dobString: string | null) {
    // 1. Split the "YYYY-MM-DD" string into numbers
    const [birthYear, birthMonth, birthDay] = dobString.split('-').map(Number);

    // 2. Get the current local date
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1; // JavaScript months are 0-indexed
    const currentDay = today.getDate();

    // 3. Calculate initial age difference
    let age = currentYear - birthYear;

    // 4. Subtract a year if the birthday hasn't happened yet this year
    if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay < birthDay)) {
        age--;
    }

    return age;
}