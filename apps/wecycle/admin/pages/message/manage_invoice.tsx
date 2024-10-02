import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layout/dashbaord";
import { useHttp } from "../../hook/useHttp";
import {
  create_invoice,
  update_invoice,
  get_single_booking,
} from "@tanbel/homezz/http-client";
import { useRouter } from "next/router";
import {
  GetSingleBookingsDTO,
  IInvoice,
  InvoiceBreakDown,
} from "@tanbel/homezz/types";
import { Button, Loader, Text } from "@tanbel/react-ui";
import { ICON } from "@tanbel/react-icons";
import { Progress } from "antd";

const initialBreakDown = [
  {
    description: "",
    quantity: 0,
    unitPrice: 0,
  },
];

const Index = ({ user, totalDep, service, totalCost }: any) => {
  const router = useRouter();
  const bookingId = router.query.id;
  const create = router.query.create === "true";
  const [discount, setDiscount] = useState(0);
  const [breakDown, setBreakDown] =
    useState<InvoiceBreakDown[]>(initialBreakDown);

  const subTotal = breakDown.reduce((acc, item) => {
    return acc + item.quantity * item.unitPrice;
  }, 0);

  const total = subTotal - discount;

  const {
    request: getBooking,
    data: bookingData,
    loading: getLoading,
  } = useHttp(() => {
    return get_single_booking(bookingId as string);
  });

  const { request: sendInvoice, loading } = useHttp(() => {
    const data = {
      bookingId: bookingId as string,
      invoiceId: bookingData?.invoice?._id,
      breakdowns: breakDown,
      discount,
    };
    if (create || !(bookingData?.totalInvoice > 0)) {
      return create_invoice(data);
    } else {
      return update_invoice(data);
    }
  });

  useEffect(() => {
    if (!create && bookingId) {
      getBooking().then((res) => {
        if (res) {
          setBreakDown(res.invoice?.breakdowns || initialBreakDown);
          setDiscount(res.invoice?.discount || 0);
        }
      });
    }
  }, [bookingId, create]);

  const addBreakDown = () => {
    const newBreakDown = {
      description: "",
      quantity: 0,
      totalPrice: 0,
      unitPrice: 0,
    };
    setBreakDown([...breakDown, newBreakDown]);
  };

  const removeBreakDown = (index: number) => {
    const newBreakDown = [...breakDown];
    newBreakDown.splice(index, 1);
    setBreakDown(newBreakDown);
  };

  const onChangeField = (
    index: number,
    field: keyof InvoiceBreakDown,
    value: any
  ) => {
    const newBreakDown = [...breakDown];
    (newBreakDown[index] as any)[field] = value.target.value;
    setBreakDown(newBreakDown);
  };

  const manage = () => {
    sendInvoice().then((res) => {
      router.push(`/message?id=${bookingId}`);
    });
  };

  return (
    <DashboardLayout>
      {getLoading ? (
        <div className="h-[500px] flex justify-center items-center">
          <Loader />
        </div>
      ) : (
        <div>
          <header className="flex justify-between mb-8">
            <div>
              <h2 className="text-4xl font-bold mb-3">
                Home<span className="text-primary">zz</span>
              </h2>
              <div>
                <Text size="paragraph">360 Bloomfield Ave Streeterville</Text>
                <Text size="paragraph">Phone: 850-123-5021</Text>
              </div>
            </div>
            <div className="client-info">
              <h2 className="text-4xl font-bold mb-3 text-right">Invoice</h2>
              <div className="text-right">
                <Text size="paragraph">
                  {bookingData?.user.firstName +
                    " " +
                    bookingData?.user.lastName}
                </Text>
                <Text size="paragraph">{bookingData?.user.email}</Text>
                <Text size="paragraph">{bookingData?.location.name}</Text>
              </div>
            </div>
          </header>
          <section className="table-container mt-[50px] mb-[200px]">
            <table className="w-full border border-collapse">
              <tr>
                <TH>Service</TH>
                <TH>Description</TH>
                <TH>Quantity</TH>
                <TH>Unit Price</TH>
                <TH>Price</TH>
                <TH></TH>
              </tr>
              {breakDown.map((item, index) => (
                <tr>
                  {index === 0 && (
                    <TD rowspan={breakDown.length}>
                      {bookingData?.service.title}
                    </TD>
                  )}
                  <TD>
                    <TableInput
                      value={item.description}
                      onChange={(v) => onChangeField(index, "description", v)}
                    />
                  </TD>
                  <TD className="w-[200px]">
                    <TableInput
                      value={item.quantity}
                      type="number"
                      onChange={(v) => onChangeField(index, "quantity", v)}
                    />
                  </TD>
                  <TD className="w-[200px]">
                    <TableInput
                      value={item.unitPrice}
                      type="number"
                      onChange={(v) => onChangeField(index, "unitPrice", v)}
                    />
                  </TD>
                  <TD className="w-[200px]">
                    <p>{item.quantity * item.unitPrice}</p>
                  </TD>
                  {index === breakDown.length - 1 ? (
                    <TH onClick={addBreakDown}>
                      <ICON.PLUS />
                    </TH>
                  ) : (
                    <TH
                      className="w-[50px]"
                      onClick={() => removeBreakDown(index)}
                    >
                      <ICON.DELETE_TWO />
                    </TH>
                  )}
                </tr>
              ))}
              <tr>
                <TD colSpan={4} className="text-right py-3 pr-5">
                  <p>Sub Total</p>
                </TD>
                <TD className="w-[200px]">
                  <p>{subTotal}</p>
                </TD>
              </tr>
              <tr>
                <TD colSpan={4} className="text-right py-3 pr-5">
                  <p>Discount</p>
                </TD>
                <TD className="w-[200px]">
                  <TableInput
                    value={discount}
                    type="number"
                    className="pl-[13px]"
                    onChange={(v) => setDiscount(v.target.value)}
                  />
                </TD>
              </tr>
              <tr>
                <TD colSpan={4} className="text-right py-3 pr-5">
                  <p>Total</p>
                </TD>
                <TD className="w-[200px]">
                  <p>{total}</p>
                </TD>
              </tr>
            </table>
          </section>
          <div className="flex justify-between">
            <Button onClick={manage} loading={loading}>
              {create
                ? "Create"
                : bookingData?.totalInvoice > 0
                ? "Update"
                : "Create"}
            </Button>
            <div className="flex justify-end">
              <h2 className="border-t border-black inline-block py-2 px-10 text-xs">
                Service Provider
              </h2>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

const TableInput = ({
  value,
  onChange,
  className,
  ...rest
}: {
  value: any;
  onChange?: (e: any) => void;
  className?: string;
  [key: string]: any;
}) => {
  return (
    <input
      className={"border-none text-center w-full h-[50px] " + className}
      value={value}
      onChange={onChange}
      {...rest}
    />
  );
};

const TH = ({ children, className, ...rest }: any) => {
  return (
    <th className={"border border-collapse py-4 " + className} {...rest}>
      {children}
    </th>
  );
};

const TD = ({ children, className, ...rest }: any) => {
  return (
    <th className={"border border-collapse font-normal " + className} {...rest}>
      {children}
    </th>
  );
};

export default Index;
