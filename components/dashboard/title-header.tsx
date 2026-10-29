const greeting = () => {
    const currentTime = new Date().getHours();
    switch (true) {
        case currentTime < 12:
            return "Good Morning, ";
        case currentTime < 18:
            return "Good Afternoon, ";
        default:
            return "Good Evening, ";
    }
};

const TitleHeader = ({
                         title,
                         userName,
                         description,
                         isGreeting,
                     }: {
    title?: string;
    userName?: string;
    description: string;
    isGreeting?: boolean;
}) => {
    return (
        <div className="flex flex-col gap-1.5">
            <h1>{isGreeting ? greeting() + userName : title}</h1>
            <p className="text-xs text-muted-foreground">{description}</p>
        </div>
    );
};

export default TitleHeader;
