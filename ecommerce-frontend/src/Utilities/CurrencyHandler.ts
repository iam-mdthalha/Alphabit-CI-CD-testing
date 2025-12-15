
//This function is used to get the text value of the currency
//and converts it into its equivalent symbol
export function getBaseCurrency(currency: string): string | null {
    const currencyEnum: any = Object.freeze({
        INR: '₹',
        AED: 'AED',
        SGD: 'SGD'
    });

    if (currencyEnum.hasOwnProperty(currency)) {
        return currencyEnum[currency];
    } else {
        return null;
    }

}