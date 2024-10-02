import { InvoiceBreakDown } from "@tanbel/homezz/types";
import { format } from "date-fns";

interface InvoiceTemplateProps {
  user: {
    name: string;
    email?: string;
    address?: string;
  };
  service: {
    name?: string;
    completionDate?: Date | string;
  };
  invoice: {
    id: string;
    createdAt: Date | string;
    priceInput?: InvoiceBreakDown[];
  };
  discount?: number;
}

export function invoiceTemplate(props: InvoiceTemplateProps) {
  const totalDep = props?.invoice?.priceInput?.length;
  const totalCost = props?.invoice?.priceInput?.reduce(
    (acc, item) => acc + +item.quantity * item.unitPrice,
    0
  );
  const discount = props?.discount;
  const discountedPrice = (totalCost || 0) - (discount || 0);
  const firstBreakdown = props.invoice.priceInput?.[0];
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
      body {
        background-color: #f0f4f7;
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
      }
      
      p {
        margin-bottom: 5px;
          margin-top: 0px;
      }

      .container {
        width: 900px;
        margin: 0 auto;
        padding: 20px;
        background-color: #fff;
        border-radius: 8px;
      }

      .header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
      }

      .logo {
        font-size: 40px;
        font-weight: bold;
      }

      .logo span {
        color: #00b871;
      }

      .email-add {
        color: #000;
        text-decoration: none;
      }

      .invoice-header {
        font-weight: bold;
        margin-bottom: 20px;
      }

      .invoice-header > h2 {
        margin: 0;
      }

      .completion-date {
        font-size: 14px;
        margin: 0;
      }

      .invoice-date {
        font-size: 12px;
      }

      .client-info {
        margin-top: 20px;
        text-align: right;
      }

      .table-container {
        display: flex;
        justify-content: space-between;
        width: 100%;
      }

      .table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
      }

      th,
      td {
        border: 1px solid #ccc;
        padding: 10px;
      }

      th {
        background-color: #e2f0e9;
        font-weight: bold;
      }
      
      .sig {
        margin-top: 90px;
        display: flex;
        justify-content: end;
      }
      
      .sigtext {
        border-top: 1px dashed black;
        display: inline;
        padding: 10px;
        font-size: 12px;
        width: 200px;
        text-align: center
      }

      .result{
        text-align: right;
      }
      </style>
    </head>
    <body>
      <div class="container">
        ${
          props.invoice.createdAt
            ? `<p class="invoice-date">${format(
                props.invoice.createdAt as Date,
                "Pp"
              )}</p>`
            : ""
        }
        <header class="header">
          <div>
            <h2 class="logo">Home<span>zz</span></h2>
            <div>
              <p>360 Bloomfield Ave Streeterville</p>
              <a class="email-add" href="mailto:hello@homezz.co">Email: hello@homezz.co</a>
            </div>
          </div>
          <div class="client-info">
            <div class="invoice-header">
              <h2>Invoice # ${props.invoice.id.slice(0, 9)}</h2>
              ${
                props.service.completionDate
                  ? `<p class="completion-date">Service Completion: ${format(
                      props.service.completionDate as Date,
                      "PP"
                    )}</p>`
                  : ""
              }
            </div>
            <p>${props.user.name}</p>
            <p>${props.user.email}</p>
            <p>${props.user.address}</p>
          </div>
        </header>
        <section class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th colspan="2">Service</th>
                <th>Information</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colspan="2" rowspan="${totalDep || 1}">
                  ${props.service.name}
                </td>
                <td>${firstBreakdown?.description || ""}</td>
                <td>${firstBreakdown?.quantity || 0}</td>
                <td>$${firstBreakdown?.unitPrice || 0}</td>
                <td>$${
                  (firstBreakdown?.quantity || 0) *
                  (firstBreakdown?.unitPrice || 0)
                }</td>
              </tr>
              ${props.invoice.priceInput?.slice(1).map((item) => {
                return `
                    <tr>
                    <td>${item.description || ""}</td>
                    <td>${item.quantity || 0}</td>
                    <td>$${item.unitPrice || 0}</td>
                    <td>$${(item.quantity || 0) * (item.unitPrice || 0)}</td>
                    </tr>
                  `;
              })}
              <tr>
                <td colspan="5" class="result">Estimated Cost</td>
                <td>$${totalCost}</td>
              </tr>
              <tr>
                <td colspan="5" class="result">Discount</td>
                <td>$${discount}</td>
              </tr>
              <tr>
                <td colspan="5" class="result">Actual Cost</td>
                <td>$${discountedPrice || 0}</td>
              </tr>
            </tbody>
          </table>
        </section>
        <div class="sig">
          <h2 class="sigtext">Service Provider</h2>
        </div>
      </div>
    </body>
    </html>
    `;
}
