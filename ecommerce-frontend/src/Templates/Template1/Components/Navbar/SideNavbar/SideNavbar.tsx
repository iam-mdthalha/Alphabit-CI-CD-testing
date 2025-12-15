import { Drawer } from "@mantine/core";

type Props = {
    children?: string | JSX.Element | JSX.Element[];
    opened: boolean;
    close: () => void;
    title: string | JSX.Element;
}

const SideNavbar = ({children, opened, close, title}: Props) => {
    return (
        <Drawer opened={opened} onClose={close}
            title={title}>
            {children}
        </Drawer>
    );
}

export default SideNavbar;