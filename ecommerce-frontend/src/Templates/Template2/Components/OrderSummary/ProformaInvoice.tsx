import { dpis } from "Constants/DPI";
import { ForwardedRef } from "react";
import { useGetConfigurationByPlantQuery } from "Services/Admin/ConfigurationApiSlice";
import { useGetProformaInvoiceQuery } from "Services/InvoiceApiSlice";
import { ProformaInvoiceDetailDTO } from "Types/Order/invoice.interface";
import CircularLoader from "../Common/CircularLoader";

type ProformaInvoiceProps = {
    doNo: string,
    dpi: any,
    invoiceRef: ForwardedRef<HTMLDivElement>
}


const ProformaInvoice: React.FC<ProformaInvoiceProps> = ({ doNo, dpi, invoiceRef }) => {
    const PLANT = process.env.REACT_APP_PLANT;
    const { data: ecomConfig } = useGetConfigurationByPlantQuery(PLANT || "");
    const numberOfDecimal =
        ecomConfig &&
        ecomConfig.numberOfDecimal !== undefined &&
        ecomConfig.numberOfDecimal !== null
            ? parseInt(ecomConfig.numberOfDecimal, 10)
            : 2;
    const formatCurrency = (amount: number) => `₹${amount.toFixed(numberOfDecimal)}`;

     const { data: proformaInvoiceData, isLoading: proformaInvoiceDataLoading, error: proformaInvoiceDataError } = useGetProformaInvoiceQuery({ doNo: doNo ?? '' });

    const totalAmount = proformaInvoiceData?.results.proformaInvoiceHeaderDTO.totalPrice;

    return (
        proformaInvoiceDataLoading ? 
            <CircularLoader />
            :
        <div
        ref={invoiceRef}
        style={{
            width: dpis[dpi].width, 
            minHeight: dpis[dpi].height, 
            padding: '40px',
            fontFamily: 'Poppins, sans-serif',
            fontSize: '14px',
            margin: 'auto',
            boxSizing: 'border-box',
            backgroundColor: '#fff',
            position: "relative",
            overflow: "hidden"
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <img src="/logo/caviaar.png" alt="amazon" style={{ height: '80px' }} />
                <div style={{ textAlign: 'right' }}>
                    <strong>Final details for the order {proformaInvoiceData?.results.proformaInvoiceHeaderDTO.doNo}</strong><br />
                </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <div><strong>Order Placed:</strong>  {proformaInvoiceData?.results.proformaInvoiceHeaderDTO.orderDate}</div>
                <div><strong>Order Number:</strong> {proformaInvoiceData?.results.proformaInvoiceHeaderDTO.doNo}</div>
                <div><strong>Order Total:</strong> {formatCurrency(totalAmount)} </div>
            </div>

            <hr style={{ marginTop: '10px', marginBottom: '5px', borderTop: "1px solid black" }} />

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                <thead>
                    <tr>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Items Ordered</th>
                        <th style={{ textAlign: 'right', padding: '8px' }}>Price Per Item</th>
                        <th style={{ textAlign: 'right', padding: '8px' }}>Total Price</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        proformaInvoiceData?.results.proformaInvoiceDetailDTOList.map((item: ProformaInvoiceDetailDTO, i: number) => {
                            return (
                                <tr key={`invoice-item-${i}`}>
                                    <td style={{ padding: '8px' }}>
                                        {item.quantityOr} of: {item.itemDescription}
                                    </td>
                                    <td style={{ padding: '8px', textAlign: 'right' }}>
                                        {formatCurrency(item.ecomUnitPrice)}
                                    </td>
                                    <td style={{ padding: '8px', textAlign: 'right' }}>
                                        {formatCurrency(item.ecomUnitPrice * item.quantityOr)}
                                    </td>
                                </tr>
                            );
                        })
                    }
                    
                </tbody>
            </table>
            <p style={{ fontSize: '12px' }}>All the products are Tax Inclusive</p>


            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                    <strong>Delivery Address:</strong><br />
                    {`${proformaInvoiceData?.results.proformaInvoiceHeaderDTO.shipContactName}\n
                    ${proformaInvoiceData?.results.proformaInvoiceHeaderDTO.shipAddr1}\n
                    ${proformaInvoiceData?.results.proformaInvoiceHeaderDTO.shipAddr2}\n
                    ${proformaInvoiceData?.results.proformaInvoiceHeaderDTO.shipAddr3}\n
                    ${proformaInvoiceData?.results.proformaInvoiceHeaderDTO.shipAddr4}\n - 
                    ${proformaInvoiceData?.results.proformaInvoiceHeaderDTO.shipZip}\n
                    ${proformaInvoiceData?.results.proformaInvoiceHeaderDTO.shipState}\n
                    ${proformaInvoiceData?.results.proformaInvoiceHeaderDTO.shipCountry}
                    `}
                    
                    
                </div>
                
            </div>

            <hr style={{ marginTop: '10px', marginBottom: '5px', borderTop: "1px solid black" }} />
            <div style={{ textAlign: "center", fontSize: 16 }}><strong>Payment Information</strong></div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                    <strong>Payment Method:</strong><br />
                    {proformaInvoiceData?.results.proformaInvoiceHeaderDTO.paymentType}
                </div>
                
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                    <strong>Billing Address:</strong><br />
                    {proformaInvoiceData?.results.proformaInvoiceHeaderDTO.address}
                </div>
                <div style={{ textAlign: 'right', marginBottom: '10px' }}>
                    <div><strong>Item Subtotal: </strong>{formatCurrency(totalAmount)}</div>
                    <div><strong>Shipping Cost: </strong>{formatCurrency(0)}</div>
                    <div><strong>Total Amount: </strong>{formatCurrency(totalAmount)}</div>
                </div>
            </div>



            <div style={{ position: "absolute", bottom: "70px", width: "90%" }}>
                <hr style={{ marginTop: '40px' }} />
                <div style={{ fontSize: '12px', textAlign: 'center' }}>
                    Please Note: This Is Not A GST Invoice.
                </div>
            </div>
            
        </div>
    )
}

export default ProformaInvoice;