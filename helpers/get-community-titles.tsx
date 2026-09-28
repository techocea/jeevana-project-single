export const getCommunityTitles = (community: string) => {
    switch (community) {
        case "islam":
            return (
                <div className="space-y-1">
                    <h4
                        className="text-2xl sm:text-4xl font-extrabold tracking-tight">Islamic Nikah
                        Matrimonials</h4>
                    <p
                        className="text-sm sm:text-base text-stone-300 max-w-2xl font-medium">Connect with pious,
                        practicing Muslim grooms and brides seeking a blessed Halal Nikah partnership.</p>
                </div>
            )
        case "catholic":
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
        case "buddhist":
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
        case "tamil":
            return (
                <div className="space-y-1">
                    <h4
                        className="text-2xl sm:text-4xl font-extrabold tracking-tight">Tamil Matrimonial
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
                        className="text-2xl sm:text-4xl font-extrabold tracking-tight">Community Profiles</h4>
                    <p
                        className="text-sm sm:text-base text-stone-300 max-w-2xl font-medium">Explore verified matches in
                        this community.</p>
                </div>
            );
    }
}
