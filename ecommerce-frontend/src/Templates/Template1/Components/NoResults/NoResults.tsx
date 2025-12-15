import { Card, Text } from "@mantine/core";

type Props = {
    text: string
}

const NoResults = ({ text }: Props) => {
    return (
        <Card withBorder={true} w={'max-content'}>
            <Text>{text}</Text>
        </Card>
    );
}

export default NoResults;