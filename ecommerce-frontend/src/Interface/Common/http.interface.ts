export interface WebResponse<T> {
    results: T;
    message: string;
    statusCode: number;
}

