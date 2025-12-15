import { Templates } from "Enums/Templates";
import { useSelector } from "react-redux";
import { RootState } from "State/store";

import Template3FloatingWhatsapp from "Templates/Template3/Components/Common/FloatingWhatsapp";


const FloatingWhatsapp = () => {
    const selectedTemplate = useSelector(
        (state: RootState) => state.template.selected
    );

    const chooseTemplate = (template: Templates) => {
        switch (template) {
            case Templates.TEMP3:
                return <Template3FloatingWhatsapp />
            default:
                return null;
        }
    }


    return (
        <>
            {chooseTemplate(selectedTemplate)}
        </>
    );
}

export default FloatingWhatsapp;