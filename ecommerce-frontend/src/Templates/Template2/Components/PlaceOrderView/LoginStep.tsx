import { List, Text } from "@mantine/core";
import { IconHistory, IconJetpack, IconMoodSmileBeam } from "@tabler/icons-react";

const LoginInsights = () => {
    return (
        <List
            spacing="xl"
            size="md"
            center
        >
            <List.Item
                icon={
                    //  <IconJetpack color="var(--mantine-color-secondary-filled)" />
                     <IconMoodSmileBeam color="black" />
                }
            ><Text fw={700}>Personalized Experience:</Text> Tailors shopping based on preferences.</List.Item>
            <List.Item
                icon={
                    // <IconJetpack color="var(--mantine-color-secondary-filled)" />
                        <IconJetpack color="black"/>

                }
            ><Text fw={700}>Saved Information:</Text> Streamlines checkout with saved details.</List.Item>
            <List.Item
                icon={
                    // <IconHistory color="var(--mantine-color-secondary-filled)" />
                       <IconHistory color="black" />
                }
            ><Text fw={700}>Order Tracking and History:</Text> Provides transparency and control.</List.Item>

        </List>
    );
}

export default LoginInsights;