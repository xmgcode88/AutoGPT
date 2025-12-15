import { BlockInfoCategoriesItem } from "@/app/api/__generated__/models/blockInfoCategoriesItem";
import { Badge } from "@/components/__legacy__/ui/badge";
import { cn } from "@/lib/utils";
import { localizeBlockCategoryName } from "@/app/(platform)/build/i18n";

export const NodeBadges = ({
  categories,
}: {
  categories: BlockInfoCategoriesItem[];
}) => {
  return categories.map((category) => (
    <Badge
      key={category.category}
      className={cn(
        "rounded-full border border-slate-500 bg-slate-100 text-black shadow-none",
      )}
    >
      {localizeBlockCategoryName(category.category)}
    </Badge>
  ));
};
