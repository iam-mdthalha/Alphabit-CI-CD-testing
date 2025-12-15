import { dpis } from "Constants/DPI";
import { ForwardedRef } from "react";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "State/store";
import { useGetConfigurationByPlantQuery } from "Services/Admin/ConfigurationApiSlice";
import { useGetProformaInvoiceQuery } from "Services/InvoiceApiSlice";
import { ProformaInvoiceDetailDTO } from "Types/Order/invoice.interface";
import CircularLoader from "Templates/Template4/Components/Common/CircularLoader";
import { getBrandName } from "Utilities/templateUtils";

type ProformaInvoiceProps = {
  doNo: string;
  dpi: any;
  invoiceRef: ForwardedRef<HTMLDivElement>;
};

const ProformaInvoice: React.FC<ProformaInvoiceProps> = ({
  doNo,
  dpi,
  invoiceRef,
}) => {
  const PLANT = process.env.REACT_APP_PLANT;
  const { selected } = useSelector((state: RootState) => state.template);
  const brandName = getBrandName(selected);
  const { data: ecomConfig } = useGetConfigurationByPlantQuery(PLANT || "");
  const numberOfDecimal =
    ecomConfig &&
    ecomConfig.numberOfDecimal !== undefined &&
    ecomConfig.numberOfDecimal !== null
      ? parseInt(ecomConfig.numberOfDecimal, 10)
      : 2;
  const formatCurrency = (amount: number) =>
    `₹${amount.toFixed(numberOfDecimal)}`;

  const {
    data: proformaInvoiceData,
    isLoading: proformaInvoiceDataLoading,
    error: proformaInvoiceDataError,
  } = useGetProformaInvoiceQuery({ doNo: doNo ?? "" });

  const totalAmount =
    proformaInvoiceData?.results.proformaInvoiceHeaderDTO.totalPrice;

  return proformaInvoiceDataLoading ? (
    <CircularLoader />
  ) : (
    <div
      ref={invoiceRef}
      style={{
        width: dpis[dpi].width,
        minHeight: dpis[dpi].height,
        padding: "40px",
        fontFamily: "Gilroy, sans-serif",
        fontSize: "14px",
        margin: "auto",
        boxSizing: "border-box",
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        position: "relative",
        overflow: "hidden",
        border: "1px solid #326638",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
          paddingBottom: "20px",
          borderBottom: "2px solid #326638",
        }}
      >
        <h1
          className="text-2xl lg:text-3xl xl:text-4xl text-vintageText font-melodramaRegular tracking-wider font-bold"
          style={{ color: "#326638" }}
        >
          {brandName}
        </h1>
        <div style={{ textAlign: "right" }}>
          <strong style={{ color: "#326638", fontSize: "16px" }}>
            Proforma Invoice
          </strong>
          <br />
          <span style={{ fontSize: "12px", color: "#666" }}>
            Order {proformaInvoiceData?.results.proformaInvoiceHeaderDTO.doNo}
          </span>
        </div>
      </div>

      <div
        style={{
          marginBottom: "25px",
          padding: "15px",
          backgroundColor: "#eae9e9ff",
          borderLeft: "4px solid #326638",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "15px",
          }}
        >
          <div>
            <strong style={{ color: "#326638" }}>Order Placed:</strong>{" "}
            {proformaInvoiceData?.results.proformaInvoiceHeaderDTO.orderDate}
          </div>
          <div>
            <strong style={{ color: "#326638" }}>Order Number:</strong>{" "}
            {proformaInvoiceData?.results.proformaInvoiceHeaderDTO.doNo}
          </div>
          <div>
            <strong style={{ color: "#326638" }}>Order Total:</strong>{" "}
            {formatCurrency(totalAmount)}{" "}
          </div>
        </div>
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "25px",
          fontFamily: "Gilroy, sans-serif",
        }}
      >
        <thead>
          <tr
            style={{
              borderBottom: "2px solid #326638",
              borderTop: "2px solid #326638",
            }}
          >
            <th
              style={{
                textAlign: "left",
                padding: "12px 8px",
                backgroundColor: "#eae9e9ff",
                color: "#326638",
                fontWeight: "600",
              }}
            >
              Items Ordered
            </th>
            <th
              style={{
                textAlign: "right",
                padding: "12px 8px",
                backgroundColor: "#eae9e9ff",
                color: "#326638",
                fontWeight: "600",
              }}
            >
              Price Per Item
            </th>
            <th
              style={{
                textAlign: "right",
                padding: "12px 8px",
                backgroundColor: "#eae9e9ff",
                color: "#326638",
                fontWeight: "600",
              }}
            >
              Total Price
            </th>
          </tr>
        </thead>
        <tbody>
          {proformaInvoiceData?.results.proformaInvoiceDetailDTOList.map(
            (item: ProformaInvoiceDetailDTO, i: number) => {
              return (
                <tr
                  key={`invoice-item-${i}`}
                  style={{
                    borderBottom: "1px solid #e5e5e5",
                    backgroundColor:
                      i % 2 === 0
                        ? "rgba(255, 255, 255, 0.5)"
                        : "rgba(255, 255, 255, 0.7)",
                  }}
                >
                  <td style={{ padding: "10px 8px" }}>
                    {item.quantityOr} of: {item.itemDescription}
                  </td>
                  <td style={{ padding: "10px 8px", textAlign: "right" }}>
                    {formatCurrency(item.ecomUnitPrice)}
                  </td>
                  <td
                    style={{
                      padding: "10px 8px",
                      textAlign: "right",
                      fontWeight: "600",
                      color: "#326638",
                    }}
                  >
                    {formatCurrency(item.ecomUnitPrice * item.quantityOr)}
                  </td>
                </tr>
              );
            }
          )}
        </tbody>
      </table>

      <p
        style={{
          fontSize: "12px",
          color: "#666",
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        All the products are Tax Inclusive
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "25px",
          gap: "20px",
        }}
      >
        <div style={{ flex: 1 }}>
          <strong
            style={{ color: "#326638", marginBottom: "8px", display: "block" }}
          >
            Delivery Address:
          </strong>
          <div style={{ fontSize: "13px", lineHeight: "1.5" }}>
            <p>
              {
                proformaInvoiceData?.results.proformaInvoiceHeaderDTO
                  .shipContactName
              }
            </p>
            <p>
              {proformaInvoiceData?.results.proformaInvoiceHeaderDTO.shipAddr1},{" "}
              {proformaInvoiceData?.results.proformaInvoiceHeaderDTO.shipAddr2},{" "}
              {proformaInvoiceData?.results.proformaInvoiceHeaderDTO.shipAddr3}
              {proformaInvoiceData?.results.proformaInvoiceHeaderDTO
                .shipAddr4 && (
                <>
                  ,{" "}
                  {
                    proformaInvoiceData.results.proformaInvoiceHeaderDTO
                      .shipAddr4
                  }
                </>
              )}
              ,{" "}
              {proformaInvoiceData?.results.proformaInvoiceHeaderDTO.shipState}{" "}
              - {proformaInvoiceData?.results.proformaInvoiceHeaderDTO.shipZip}
              {/* {
                proformaInvoiceData?.results.proformaInvoiceHeaderDTO
                  .shipCountry
              } */}
            </p>
          </div>
        </div>
      </div>

      <div
        style={{
          padding: "20px",
          backgroundColor: "#eae9e9ff",
          marginBottom: "25px",
          borderRadius: "4px",
        }}
      >
        <div
          style={{
            textAlign: "center",
            fontSize: "16px",
            marginBottom: "15px",
          }}
        >
          <strong style={{ color: "#326638" }}>Payment Information</strong>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <strong style={{ color: "#326638" }}>Payment Method:</strong>
            <br />
            <div style={{ fontSize: "13px", marginTop: "5px" }}>
              {
                proformaInvoiceData?.results.proformaInvoiceHeaderDTO
                  .paymentType
              }
            </div>
          </div>

          <table style={{ width: "auto", borderCollapse: "collapse" }}>
            <tbody>
              <tr>
                <td style={{ padding: "2px 0", textAlign: "right" }}>
                  <strong style={{ color: "#326638" }}>Item Subtotal: </strong>
                </td>
                <td
                  style={{
                    padding: "2px 0",
                    textAlign: "right",
                    paddingLeft: "10px",
                  }}
                >
                  {formatCurrency(totalAmount)}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "2px 0", textAlign: "right" }}>
                  <strong style={{ color: "#326638" }}>Shipping Cost: </strong>
                </td>
                <td
                  style={{
                    padding: "2px 0",
                    textAlign: "right",
                    paddingLeft: "10px",
                  }}
                >
                  {formatCurrency(0)}
                </td>
              </tr>
              <tr>
                <td
                  colSpan={2}
                  style={{
                    padding: "8px 0 2px 0",
                    borderTop: "1px solid #326638",
                    textAlign: "right",
                  }}
                >
                  <strong style={{ color: "#326638", fontSize: "16px" }}>
                    Total Amount:{" "}
                  </strong>
                  {formatCurrency(totalAmount)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div
        style={{
          marginBottom: "20px",
        }}
      >
        <strong
          style={{ color: "#326638", marginBottom: "8px", display: "block" }}
        >
          Billing Address:
        </strong>
        <div style={{ fontSize: "13px" }}>
          <p>
            {proformaInvoiceData?.results.proformaInvoiceHeaderDTO.customerName}
          </p>
          <p>
            {proformaInvoiceData?.results.proformaInvoiceHeaderDTO.address},{" "}
            {proformaInvoiceData?.results.proformaInvoiceHeaderDTO.addressTwo},{" "}
            {proformaInvoiceData?.results.proformaInvoiceHeaderDTO.addressThree}
            , {proformaInvoiceData?.results.proformaInvoiceHeaderDTO.state} -{" "}
            {proformaInvoiceData?.results.proformaInvoiceHeaderDTO.pinCode}
            {/* {proformaInvoiceData?.results.proformaInvoiceHeaderDTO.country} */}
          </p>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "40px",
          width: "90%",
          paddingTop: "20px",
          borderTop: "1px solid #ddd",
        }}
      >
        <div
          style={{
            fontSize: "12px",
            textAlign: "center",
            color: "#666",
            fontStyle: "italic",
          }}
        >
          Please Note: This Is Not A GST Invoice.
        </div>
      </div>
    </div>
  );
};

export default ProformaInvoice;
