interface DPI {
    [dpi: string]: {
        width: string,
        height: string
    }
}

export const dpis: DPI = {
    "72dpi": {
        width: "595px",
        height: "842px"
    },
    "96dpi": {
        width: "794px",
        height: "1123px"
    },
    "150dpi": {
        width: "1240px",
        height: "1754px"
    }
};