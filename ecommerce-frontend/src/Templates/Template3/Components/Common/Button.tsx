type ButtonProps = {
    label: string;
    onClick: () => void;
};

const Button = ({label, onClick}: ButtonProps) => {
    return (
        <div className="bg-black hover:bg-white text-white hover:text-black transition w-fit px-5 py-3">
            <button className="uppercase font-circe text-lg" onClick={onClick}>{label}</button>
        </div>
    );
}

export default Button;