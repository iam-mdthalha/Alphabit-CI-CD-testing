export function toTitleCase(text: string) {
    if((text === null) || (text === '')) {
        return false;
    }
    else {
        text = text.toString();
    }

    return text.replace(/\w\S*/g, 
        function(text) {
            return text.charAt(0).toUpperCase() +
                text.substring(1).toLowerCase();
        }
    );
}