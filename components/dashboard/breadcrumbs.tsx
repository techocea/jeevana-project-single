import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface BreadcrumbProps {
    currentPath: string,
    primaryLink: string,
    secondaryLink: string,
    primaryText: string,
    secondaryText: string,
}

export default function Breadcrumbs({
                                        currentPath,
                                        primaryText,
                                        primaryLink,
                                        secondaryText,
                                        secondaryLink
                                    }: BreadcrumbProps) {
    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href={`/${primaryLink}`}>{primaryText}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator/>
                <BreadcrumbItem>
                    <BreadcrumbLink href={`/${primaryLink}/${secondaryLink}`}>{secondaryText}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator/>
                <BreadcrumbItem>
                    <BreadcrumbPage>{currentPath}</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    )
}