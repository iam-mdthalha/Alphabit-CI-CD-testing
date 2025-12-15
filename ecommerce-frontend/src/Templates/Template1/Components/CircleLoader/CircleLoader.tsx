import { Loader } from "@mantine/core";

const CircleLoader = () => {
    return (
        <div 
        style={{width: '100%', 
        height: '88vh', 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        left: 0,
        top: 110,
        backgroundColor: 'white'
        }}>
            <Loader color="var(--mantine-primary-color-filled)" />
        </div>
        
    );
}

export default CircleLoader;