import { Box, Card, Group, Stack, Text, Title } from "@mantine/core";
import { Templates } from "Enums/Templates";
import { setTemplate } from "State/TemplateSlice/TemplateSlice";
import type { RootState } from "State/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const AdminTemplates = () => {
  const dispatch = useDispatch();
  const selectedTemplate = useSelector(
    (state: RootState) => state.template.selected
  );
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    setPreviewUrl(`/?template=${selectedTemplate}&t=${Date.now()}`);
  }, [selectedTemplate]);

  const handleTemplateChange = (value: Templates) => {
    dispatch(setTemplate(value));
    localStorage.setItem("selectedTemplate", value);
  };

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      style={{ backgroundColor: "#fff" }}
    >
      <Title
        order={2}
        mt="sm"
        style={{
          color: "#000",
          fontFamily: "Montserrat , sans",
        }}
        ta="center"
      >
        Template Selection
      </Title>
      <Text size="sm" c="dimmed" my="md">
        The selected template will be applied to all pages, including the home
        page and cart page.
      </Text>
      <Stack>
        <Group grow>
          {[Templates.TEMP1, Templates.TEMP2, Templates.TEMP3].map((template) => (
            <Stack
              align="center"
              onClick={() => handleTemplateChange(template)}
            >
              {/* <Box
                style={{
                  width: "100%",
                  height: "50vh",
                  overflow: "hidden",
                  borderRadius: "8px",
                  border: "1px solid #e0e0e0",
                }}
              >
                <iframe
                  src={`/?template=${template}`}
                  title={`Template ${template}`}
                  scrolling="no"
                  style={{
                    width: "200%",
                    height: "200%",
                    transform: "scale(0.5)",
                    transformOrigin: "0 0",
                  }}
                />
              </Box> */}
              <Card
                shadow="xs"
                padding="xs"
                radius="md"
                ta="center"
                style={{
                  width: "100%",
                  cursor: "pointer",
                  border:
                    selectedTemplate === template
                      ? "2px solid #000"
                      : "1px solid #e0e0e0",
                }}
              >
                Template {template === "template1" ? "1" : "2"}
              </Card>
            </Stack>
          ))}
        </Group>
        <Box
          mt="xl"
          mb="md"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Title
            order={2}
            style={{
              color: "#000",
              fontFamily: "Montserrat , sans",
            }}
          >
            Template Preview
          </Title>
          <button
            className="uppercase tracking-widest bg-black text-white border border-black text-xs font-semibold px-8 py-4 transition-all duration-300 ease-in-out hover:bg-transparent hover:text-black relative overflow-hidden group"
            onClick={() => window.open("/", "_blank")}
          >
            <span className="relative z-10">Open Full Preview</span>
            <span className="absolute inset-0 bg-transparent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out"></span>
          </button>
        </Box>
        <Box
          style={{
            width: "100%",
            height: "75vh",
            overflow: "hidden",
            borderRadius: "8px",
            border: "1px solid #e0e0e0",
          }}
        >
          <iframe
            src={previewUrl}
            title="Selected Template Preview"
            scrolling="no"
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              overflow: "hidden",
            }}
          />
        </Box>
      </Stack>
    </Card>
  );
};

export default AdminTemplates;
