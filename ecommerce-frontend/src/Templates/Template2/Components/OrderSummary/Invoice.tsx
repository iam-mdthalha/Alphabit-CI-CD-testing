import { dpis } from "Constants/DPI";
import { ForwardedRef } from "react";
import { useGetConfigurationByPlantQuery } from "Services/Admin/ConfigurationApiSlice";
import { useGetInvoiceQuery } from "Services/InvoiceApiSlice";
import CircularLoader from "Templates/Template3/Components/Common/CircularLoader";
import { InvoiceDetailDTO } from "Types/Order/invoice.interface";

type InvoiceProps = {
    doNo: string,
    dpi: any,
    invoiceRef: ForwardedRef<HTMLDivElement>
}


const Invoice: React.FC<InvoiceProps> = ({ doNo, dpi, invoiceRef }) => {
    const PLANT = process.env.REACT_APP_PLANT;
    const { data: ecomConfig } = useGetConfigurationByPlantQuery(PLANT || "");
    const numberOfDecimal =
        ecomConfig &&
        ecomConfig.numberOfDecimal !== undefined &&
        ecomConfig.numberOfDecimal !== null
            ? parseInt(ecomConfig.numberOfDecimal, 10)
            : 2;
    const formatCurrency = (amount: number) => `₹${amount.toFixed(numberOfDecimal)}`;
    
     const { data: invoiceData, isLoading: invoiceDataLoading, error: invoiceDataError } = useGetInvoiceQuery({ doNo: doNo ?? '' });

     const subTotal = invoiceData?.results.invoiceHeaderDTO.subTotal;
    const totalAmount = invoiceData?.results.invoiceHeaderDTO.totalAmount;
    const shippingCost = invoiceData?.results.invoiceHeaderDTO.shippingCost;

    const hasNull = (item: string) => {
        if(item == null) {
            return '';
        } else {
            return (
                <>
                    {item}
                    <br />
                </>
                );
        }
    }

    return (
        invoiceDataLoading ? 
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
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <div style={{ textAlign: 'center' }}>
                    <strong>Tax Invoice/Bill of Supply/Cash Memo</strong><br />
                    <span>{invoiceData?.results.invoiceHeaderDTO.invoice}(Original for Recipient)</span>
                </div> 
            </div>
            <div style={{ display: 'flex', justifyContent: 'start', marginBottom: '20px' }}>
                <img src="/logo/caviaar.png" alt="amazon" style={{ height: '80px' }} />
            </div>

            <div style={{ marginBottom: '20px' }}>
                <div><strong>Sold By:</strong> Cavier</div>
                <div>Cavier Address</div>
                <div><strong>PAN No:</strong> Cavier PAN NO</div>
                <div><strong>GSTIN:</strong> Cavier GSTIN</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                    <strong>Billing Address:</strong><br />
                    {invoiceData?.results.invoiceHeaderDTO.address}
                </div>
                <div>
                    <strong>Shipping Address:</strong><br />
                    {hasNull(invoiceData?.results.invoiceHeaderDTO.shipAddress1)}
                    {hasNull(invoiceData?.results.invoiceHeaderDTO.shipAddress2)}
                    {hasNull(invoiceData?.results.invoiceHeaderDTO.shipAddress3)}
                    {hasNull(invoiceData?.results.invoiceHeaderDTO.shipAddress4)}
                    {hasNull(invoiceData?.results.invoiceHeaderDTO.shipState)} - {hasNull(invoiceData?.results.invoiceHeaderDTO.shipZip)}
                    {hasNull(invoiceData?.results.invoiceHeaderDTO.shipCountry)}
                    {hasNull(invoiceData?.results.invoiceHeaderDTO.shipEmail)}
                </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <div><strong>Order Number:</strong> {invoiceData?.results.invoiceHeaderDTO.doNo}</div>
                <div><strong>Invoice Date:</strong> {invoiceData?.results.invoiceHeaderDTO.invoiceDate}</div>
                <div><strong>Due Date:</strong> {invoiceData?.results.invoiceHeaderDTO.dueDate}</div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid #000' }}>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Sl. No</th>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
                        <th style={{ textAlign: 'right', padding: '8px' }}>Qty</th>
                        <th style={{ textAlign: 'left', padding: '8px' }}>UOM</th>
                        <th style={{ textAlign: 'right', padding: '8px' }}>Unit Price</th>
                        <th style={{ textAlign: 'right', padding: '8px' }}>Discount</th>
                        <th style={{ textAlign: 'right', padding: '8px' }}>GST %</th>
                        <th style={{ textAlign: 'right', padding: '8px' }}>CESS %</th>
                        <th style={{ textAlign: 'right', padding: '8px' }}>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {invoiceData?.results.invoiceDetailDTOList.map((item: InvoiceDetailDTO, index: number) => (
                        <tr key={index}>
                            <td style={{ padding: '8px' }}>{index + 1}</td>
                            <td style={{ padding: '8px' }}>{item.itemDescription}</td>
                            <td style={{ padding: '8px', textAlign: 'right' }}>{item.qty}</td>
                            <td style={{ padding: '8px', textAlign: 'right' }}>{item.uom}</td>
                            <td style={{ padding: '8px', textAlign: 'right' }}>{formatCurrency(item.unitCost)}</td>
                            <td style={{ padding: '8px', textAlign: 'right' }}>{item.discount}</td>
                            <td style={{ padding: '8px', textAlign: 'right' }}>{item.gst}</td>
                            <td style={{ padding: '8px', textAlign: 'right' }}>{item.cess}</td>
                            <td style={{ padding: '8px', textAlign: 'right' }}>{formatCurrency(item.unitCost * item.qty)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={{ display: 'flex', justifyContent: 'end', marginBottom: '10px' }}>
                <table>
                    <tbody>
                        <tr>
                            <td style={{ textAlign: 'left', padding: '8px' }}><strong>Sub Total :</strong></td>
                            <td style={{ textAlign: 'right', padding: '8px' }}>{formatCurrency(subTotal)}</td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: 'left', padding: '8px' }}><strong>Shipping Cost :</strong></td>
                            <td style={{ textAlign: 'right', padding: '8px' }}>{formatCurrency(shippingCost)}</td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: 'left', padding: '8px' }}><strong>Total Amount: </strong></td>
                            <td style={{ textAlign: 'right', padding: '8px' }}>{formatCurrency(totalAmount)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div style={{ marginTop: '40px', textAlign: 'right' }}>
                <div>For <strong>Cavier</strong></div>
                <br /><br />
                <div>Authorized Signatory</div>
            </div>

            <div style={{ position: "absolute", bottom: "70px", width: "90%" }}>
                <hr style={{ marginTop: '40px' }} />
                <div style={{ fontSize: '12px', textAlign: 'center' }}>
                    Whether tax is payable under reverse charge – No
                </div>
            </div>
            
        </div>
    )
}

export default Invoice;