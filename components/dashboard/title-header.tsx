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
    isGreeting: boolean;
}) => {
    return (
        <div className="flex flex-col gap-2">
            <h3 className="text-black">{isGreeting ? greeting() + userName : title}</h3>
            <p className="text-muted-foreground">{description}</p>
        </div>
    );
};

export default TitleHeader;
