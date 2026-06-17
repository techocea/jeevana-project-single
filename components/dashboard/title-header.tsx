const greeting = () => {
  const currentTime = new Date().getHours();
  switch (true) {
    case currentTime < 12:
      return "Good Morning, Shazmin";
    case currentTime < 18:
      return "Good Afternoon, Shazmin";
    default:
      return "Good Evening, Shazmin";
  }
};

const TitleHeader = ({
  title,
  description,
  isGreeting,
}: {
  title?: string;
  description: string;
  isGreeting: boolean;
}) => {
  return (
    <div className="flex flex-col gap-2 px-4 lg:px-6">
      <h3 className="text-black">{isGreeting ? greeting() : title}</h3>
      <p className="text-muted-foreground text-lg">{description}</p>
    </div>
  );
};

export default TitleHeader;
