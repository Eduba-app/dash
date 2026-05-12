import Image from "next/image";
import faildSearch from "../../../public/images/searchFailedBg.png";

interface SearchNotFoundProps {
    query: string;
}

export function SearchNotFound({ query }: SearchNotFoundProps) {
    return (
        <div className="flex flex-col items-center justify-start pt-12 gap-2">
            <div className="flex items-center justify-center">
                <Image
                    src={faildSearch}
                    width={320}
                    height={320}
                    alt="No results found"
                />
            </div>
            <p className="text-[#6B7280] text-sm">
                We couldn&apos;t find results for &quot;{query}&quot;
            </p>
        </div>
    );
}