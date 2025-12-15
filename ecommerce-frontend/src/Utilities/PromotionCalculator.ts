//calculates promotions on item, category, and brand

import { Promotion } from "Types/ProductMetaDTO";

export const calculatePromotions = (promotions: Array<Promotion>, ecomUnitPrice: number) => {
    let discountPrice_: number = 0;
    let discountPer_: number = 0;
    let isByValue_: boolean = false;
    for (let promotion of promotions) {

        if (promotion.promotionBy === "ByValue") {
            // setIsByValue(true);
            isByValue_ = true;
            if (promotion.promotionType === "%") {
                discountPer_ = discountPer_ + promotion.promotion
                discountPrice_ = discountPrice_ + (promotion.promotion / 100) * ecomUnitPrice;
            }
            else {
                discountPrice_ = discountPrice_ + (ecomUnitPrice - promotion.promotion);
            }
        }
    }
    discountPrice_ = ecomUnitPrice - discountPrice_;
    // setDiscountPrice(discountPrice_);
    // setDiscountPer(discountPer_);

    return {discountPrice_, discountPer_, isByValue_};
}