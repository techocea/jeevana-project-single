export const getReligionTitles = (religion: string) => {
    switch (religion) {
        case "islam":
            return (
                <div className="space-y-1">
                    <h4
                        className="text-2xl sm:text-4xl font-extrabold tracking-tight">Muslim Nikah
                        Matrimonials</h4>
                    <p
                        className="text-sm sm:text-base text-stone-300 max-w-2xl font-medium">Connect with pious,
                        practicing Muslim grooms and brides seeking a blessed Halal Nikah partnership.</p>
                </div>
            )
        case "Islam":
            return (
                <div className="space-y-1">
                    <h4
                        className="text-2xl sm:text-4xl font-extrabold tracking-tight">Muslim Nikah
                        Matrimonials</h4>
                    <p
                        className="text-sm sm:text-base text-stone-300 max-w-2xl font-medium">Connect with pious,
                        practicing Muslim grooms and brides seeking a blessed Halal Nikah partnership.</p>
                </div>
            )
        case "catholicism":
            return (
                <div className="space-y-1">
                    <h4
                        className="text-2xl sm:text-4xl font-extrabold tracking-tight">Catholic Matrimonial
                        Profiles</h4>
                    <p
                        className="text-sm sm:text-base text-stone-300 max-w-2xl font-medium">Find faithful Catholic
                        life partners rooted in shared sacraments, heritage, and Christian family values.</p>
                </div>
            )
        case "Catholicism":
            return (
                <div className="space-y-1">
                    <h4
                        className="text-2xl sm:text-4xl font-extrabold tracking-tight">Catholic Matrimonial
                        Profiles</h4>
                    <p
                        className="text-sm sm:text-base text-stone-300 max-w-2xl font-medium">Find faithful Catholic
                        life partners rooted in shared sacraments, heritage, and Christian family values.</p>
                </div>
            )
        case "buddhism":
            return (
                <div className="space-y-1">
                    <h4
                        className="text-2xl sm:text-4xl font-extrabold tracking-tight">Buddhist Matrimonial Profiles
                    </h4>
                    <p
                        className="text-sm sm:text-base text-stone-300 max-w-2xl font-medium">Discover compassionate
                        partners aligned with Buddhist principles, mindfulness, and cultural background.</p>
                </div>
            )
        case "Buddhism":
            return (
                <div className="space-y-1">
                    <h4
                        className="text-2xl sm:text-4xl font-extrabold tracking-tight">Buddhist Matrimonial Profiles
                    </h4>
                    <p
                        className="text-sm sm:text-base text-stone-300 max-w-2xl font-medium">Discover compassionate
                        partners aligned with Buddhist principles, mindfulness, and cultural background.</p>
                </div>
            )
        case "hinduism":
            return (
                <div className="space-y-1">
                    <h4
                        className="text-2xl sm:text-4xl font-extrabold tracking-tight">Hindu Matrimonial
                        Profiles</h4>
                    <p
                        className="text-sm sm:text-base text-stone-300 max-w-2xl font-medium">Honor sacred bonds and
                        lineage compatibility with verified Hindu brides and grooms globally.</p>
                </div>
            )
        case "Hinduism":
            return (
                <div className="space-y-1">
                    <h4
                        className="text-2xl sm:text-4xl font-extrabold tracking-tight">Hindu Matrimonial
                        Profiles</h4>
                    <p
                        className="text-sm sm:text-base text-stone-300 max-w-2xl font-medium">Honor sacred bonds and
                        lineage compatibility with verified Hindu brides and grooms globally.</p>
                </div>
            )
        default:
            return (
                <div className="space-y-1">
                    <h4
                        className="text-2xl sm:text-4xl font-extrabold tracking-tight">religion Profiles</h4>
                    <p
                        className="text-sm sm:text-base text-stone-300 max-w-2xl font-medium">Explore verified matches
                        in
                        this religion.</p>
                </div>
            );
    }
}
