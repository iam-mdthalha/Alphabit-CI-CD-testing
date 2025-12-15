import { dpis } from "Constants/DPI";
import { ForwardedRef } from "react";
import { useGetConfigurationByPlantQuery } from "Services/Admin/ConfigurationApiSlice";
import { useGetInvoiceQuery } from "Services/InvoiceApiSlice";
import CircularLoader from "Templates/Template4/Components/Common/CircularLoader";
import { InvoiceDetailDTO } from "Types/Order/invoice.interface";

type InvoiceProps = {
  doNo: string;
  dpi: any;
  invoiceRef: ForwardedRef<HTMLDivElement>;
};

const Invoice: React.FC<InvoiceProps> = ({ doNo, dpi, invoiceRef }) => {
  const PLANT = process.env.REACT_APP_PLANT;
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
    data: invoiceData,
    isLoading: invoiceDataLoading,
    error: invoiceDataError,
  } = useGetInvoiceQuery({ doNo: doNo ?? "" });

  const subTotal = invoiceData?.results.invoiceHeaderDTO.subTotal;
  const totalAmount = invoiceData?.results.invoiceHeaderDTO.totalAmount;
  const shippingCost = invoiceData?.results.invoiceHeaderDTO.shippingCost;

  const hasNull = (item: string) => {
    if (item == null) {
      return "";
    } else {
      return (
        <>
          {item}
          <br />
        </>
      );
    }
  };

  return invoiceDataLoading ? (
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
        backgroundColor: "#fff",
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
          marginBottom: "30px",
          paddingBottom: "20px",
          borderBottom: "2px solid #326638",
        }}
      >
        <div>
          <img
            src="/logo/caviaar.png"
            alt="Moore Market Private Limited"
            style={{ height: "60px" }}
          />
        </div>
        <div style={{ textAlign: "center" }}>
          <strong
            style={{
              fontSize: "18px",
              color: "#326638",
              fontFamily: "Melodrama, serif",
            }}
          >
            Tax Invoice/Bill of Supply/Cash Memo
          </strong>
          <br />
          <span style={{ fontSize: "12px", color: "#666" }}>
            {invoiceData?.results.invoiceHeaderDTO.invoice}(Original for
            Recipient)
          </span>
        </div>
      </div>

      <div
        style={{
          marginBottom: "25px",
          padding: "15px",
          backgroundColor: "#ECE6C2",
          borderLeft: "4px solid #326638",
        }}
      >
        <div
          style={{ fontWeight: "bold", color: "#326638", marginBottom: "5px" }}
        >
          Sold By: Moore Market Private Limited
        </div>
        <div style={{ fontSize: "13px" }}>Moore Market Private Limited Address</div>
        <div style={{ fontSize: "13px" }}>
          <strong>PAN No:</strong> Moore Market Private Limited PAN NO
        </div>
        <div style={{ fontSize: "13px" }}>
          <strong>GSTIN:</strong> Moore Market Private Limited GSTIN
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "25px",
          gap: "20px",
        }}
      >
        <div style={{ flex: 1 }}>
          <strong style={{ color: "#326638" }}>Billing Address:</strong>
          <br />
          <div style={{ fontSize: "13px", marginTop: "5px" }}>
            {invoiceData?.results.invoiceHeaderDTO.address}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <strong style={{ color: "#326638" }}>Shipping Address:</strong>
          <br />
          <div style={{ fontSize: "13px", marginTop: "5px" }}>
            {hasNull(invoiceData?.results.invoiceHeaderDTO.shipAddress1)}
            {hasNull(invoiceData?.results.invoiceHeaderDTO.shipAddress2)}
            {hasNull(invoiceData?.results.invoiceHeaderDTO.shipAddress3)}
            {hasNull(invoiceData?.results.invoiceHeaderDTO.shipAddress4)}
            {hasNull(invoiceData?.results.invoiceHeaderDTO.shipState)} -{" "}
            {hasNull(invoiceData?.results.invoiceHeaderDTO.shipZip)}
            {hasNull(invoiceData?.results.invoiceHeaderDTO.shipCountry)}
            {hasNull(invoiceData?.results.invoiceHeaderDTO.shipEmail)}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "25px",
          padding: "15px",
          backgroundColor: "#f8f5e6",
        }}
      >
        <div>
          <strong style={{ color: "#326638" }}>Order Number:</strong>{" "}
          {invoiceData?.results.invoiceHeaderDTO.doNo}
        </div>
        <div>
          <strong style={{ color: "#326638" }}>Invoice Date:</strong>{" "}
          {invoiceData?.results.invoiceHeaderDTO.invoiceDate}
        </div>
        <div>
          <strong style={{ color: "#326638" }}>Due Date:</strong>{" "}
          {invoiceData?.results.invoiceHeaderDTO.dueDate}
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
                backgroundColor: "#ECE6C2",
                color: "#326638",
                fontWeight: "600",
              }}
            >
              Sl. No
            </th>
            <th
              style={{
                textAlign: "left",
                padding: "12px 8px",
                backgroundColor: "#ECE6C2",
                color: "#326638",
                fontWeight: "600",
              }}
            >
              Description
            </th>
            <th
              style={{
                textAlign: "right",
                padding: "12px 8px",
                backgroundColor: "#ECE6C2",
                color: "#326638",
                fontWeight: "600",
              }}
            >
              Qty
            </th>
            <th
              style={{
                textAlign: "left",
                padding: "12px 8px",
                backgroundColor: "#ECE6C2",
                color: "#326638",
                fontWeight: "600",
              }}
            >
              UOM
            </th>
            <th
              style={{
                textAlign: "right",
                padding: "12px 8px",
                backgroundColor: "#ECE6C2",
                color: "#326638",
                fontWeight: "600",
              }}
            >
              Unit Price
            </th>
            <th
              style={{
                textAlign: "right",
                padding: "12px 8px",
                backgroundColor: "#ECE6C2",
                color: "#326638",
                fontWeight: "600",
              }}
            >
              Discount
            </th>
            <th
              style={{
                textAlign: "right",
                padding: "12px 8px",
                backgroundColor: "#ECE6C2",
                color: "#326638",
                fontWeight: "600",
              }}
            >
              GST %
            </th>
            <th
              style={{
                textAlign: "right",
                padding: "12px 8px",
                backgroundColor: "#ECE6C2",
                color: "#326638",
                fontWeight: "600",
              }}
            >
              CESS %
            </th>
            <th
              style={{
                textAlign: "right",
                padding: "12px 8px",
                backgroundColor: "#ECE6C2",
                color: "#326638",
                fontWeight: "600",
              }}
            >
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {invoiceData?.results.invoiceDetailDTOList.map(
            (item: InvoiceDetailDTO, index: number) => (
              <tr
                key={index}
                style={{
                  borderBottom: "1px solid #e5e5e5",
                  backgroundColor: index % 2 === 0 ? "#fff" : "#f9f9f9",
                }}
              >
                <td style={{ padding: "10px 8px" }}>{index + 1}</td>
                <td style={{ padding: "10px 8px" }}>{item.itemDescription}</td>
                <td style={{ padding: "10px 8px", textAlign: "right" }}>
                  {item.qty}
                </td>
                <td style={{ padding: "10px 8px", textAlign: "right" }}>
                  {item.uom}
                </td>
                <td style={{ padding: "10px 8px", textAlign: "right" }}>
                  {formatCurrency(item.unitCost)}
                </td>
                <td style={{ padding: "10px 8px", textAlign: "right" }}>
                  {item.discount}
                </td>
                <td style={{ padding: "10px 8px", textAlign: "right" }}>
                  {item.gst}
                </td>
                <td style={{ padding: "10px 8px", textAlign: "right" }}>
                  {item.cess}
                </td>
                <td
                  style={{
                    padding: "10px 8px",
                    textAlign: "right",
                    fontWeight: "600",
                    color: "#326638",
                  }}
                >
                  {formatCurrency(item.unitCost * item.qty)}
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>

      <div
        style={{ display: "flex", justifyContent: "end", marginBottom: "20px" }}
      >
        <table style={{ width: "300px" }}>
          <tbody>
            <tr>
              <td
                style={{ textAlign: "left", padding: "8px", fontWeight: "600" }}
              >
                Sub Total :
              </td>
              <td style={{ textAlign: "right", padding: "8px" }}>
                {formatCurrency(subTotal)}
              </td>
            </tr>
            <tr>
              <td
                style={{ textAlign: "left", padding: "8px", fontWeight: "600" }}
              >
                Shipping Cost :
              </td>
              <td style={{ textAlign: "right", padding: "8px" }}>
                {formatCurrency(shippingCost)}
              </td>
            </tr>
            <tr
              style={{
                borderTop: "2px solid #326638",
                fontSize: "16px",
              }}
            >
              <td
                style={{
                  textAlign: "left",
                  padding: "12px 8px",
                  fontWeight: "bold",
                  color: "#326638",
                }}
              >
                Total Amount:{" "}
              </td>
              <td
                style={{
                  textAlign: "right",
                  padding: "12px 8px",
                  fontWeight: "bold",
                  color: "#326638",
                }}
              >
                {formatCurrency(totalAmount)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        style={{
          marginTop: "40px",
          textAlign: "right",
          paddingTop: "20px",
          borderTop: "2px solid #326638",
        }}
      >
        <div style={{ fontWeight: "bold", color: "#326638" }}>
          For <strong>Moore Market Private Limited</strong>
        </div>
        <br />
        <br />
        <div>Authorized Signatory</div>
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
          }}
        >
          Whether tax is payable under reverse charge - No
        </div>
      </div>
    </div>
  );
};

export default Invoice;
