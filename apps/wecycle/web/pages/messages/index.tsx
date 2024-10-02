import {
  get_conversations,
  get_invoices_by_booking,
  get_messages,
  get_single_booking,
  reject_booking_price,
} from "@tanbel/homezz/http-client";
import {
  join_room,
  leave_room,
  listen_message,
  send_message,
} from "@tanbel/homezz/socket-client";
import {
  BookingStatus,
  GetConversationsDTO,
  GetMessageDTO,
  GetSingleBookingsDTO,
  MessageType,
  SingleInvoiceDTO,
} from "@tanbel/homezz/types";
import { fullName, invoiceDownloadUrl, theme } from "@tanbel/homezz/utils";
import { ICON } from "@tanbel/react-icons";
import {
  Avatar,
  Button,
  Card,
  Dropdown,
  Input,
  Layout,
  MessageBubble,
  PreviewableImage,
  Space,
  Text,
} from "@tanbel/react-ui";
import { formatDate } from "@tanbel/utils";
import { Drawer, Modal } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { PaymentCheckoutForm } from "../../components/pages/messages/payment";
import { useHttp } from "../../hook/useHttp";
import { useAuthStore } from "../../store/authStore";
import { toast } from "react-toastify";
import { useScreenWidth } from "../../hook/useScreenWidth";
import { withPrivatePage } from "../../HOC";

const { Header, Sider, Content } = Layout;

enum RightSideTab {
  DETAILS = 0,
  INVOICES = 1,
}

const Index = () => {
  const { user } = useAuthStore();
  const lastMessage = React.useRef<string>();
  const messageArea = React.useRef<HTMLDivElement>(null);
  const [bookingData, setBookingData] = useState<GetSingleBookingsDTO>();
  const router = useRouter();
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<GetMessageDTO[]>([]);
  const [invoices, setInvoices] = useState<SingleInvoiceDTO[]>([]);
  const [left, setLeft] = useState(false);
  const [right, setRight] = useState(false);
  const bookingId = router.query.id;
  const tab = router.query.tab ? parseInt(router.query.tab as string) : 0;
  const receiver = bookingData?.user._id;
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredConversations, setFilteredConversations] = useState<
    GetConversationsDTO[] | null
  >(null);
  const [invoiceModal, setInvoiceModal] = useState(false);
  const [priceModal, setPriceModal] = useState(false);
  const screenWidth = useScreenWidth();

  const { data: conversations, request: getConversations } = useHttp<
    GetConversationsDTO[]
  >(() => {
    return get_conversations();
  });

  const { request: getMessages } = useHttp<GetMessageDTO[]>(() => {
    return get_messages(bookingId as string);
  });

  const { request: getInvoices } = useHttp(() => {
    return get_invoices_by_booking(bookingId as string);
  });

  const { request: getBooking, loading: getBookingLoader } =
    useHttp<GetSingleBookingsDTO>(() => {
      return get_single_booking(bookingId as string);
    });

  const items = [
    {
      key: "1",
      label: "View Invoices",
      onClick: () => {
        setInvoiceModal(true);
      },
    },
    {
      key: "2",
      label: "Service Cost",
      onClick: () => {
        setPriceModal(true);
      },
    },
  ];

  const createMessage = () => {
    if (text === "") {
      return;
    }
    setText("");
    setMessages([
      ...messages,
      {
        isMe: true,
        message: text,
      },
    ]);

    send_message({
      room: bookingId as string,
      booking: bookingId as string,
      message: text,
      receiver,
      sender: user?._id as string,
      type: MessageType.TEXT,
    });
  };

  const filterConversations = () => {
    if (!searchQuery) {
      setFilteredConversations(conversations);
    } else {
      const filtered = conversations?.filter((conversation) =>
        conversation.service.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
      setFilteredConversations(filtered || []);
    }
  };

  const isSelected = (id: string) => {
    return id === bookingId;
  };

  const showInvoice = (id: string) => {
    const url = invoiceDownloadUrl(id);
    const win = window.open(url, "_blank");
  };

  useEffect(() => {
    filterConversations();
  }, [searchQuery, conversations]);

  useEffect(() => {
    if (messageArea.current) {
      messageArea.current.scrollTop = messageArea.current.scrollHeight;
    }
  }, [messages.length]);

  useEffect(() => {
    getConversations();
  }, []);

  useEffect(() => {
    if (bookingId) {
      getInvoices().then((res) => {
        setInvoices(res);
      });
    }
  }, [bookingId]);

  useEffect(() => {
    if (bookingId) {
      join_room(bookingId as string, user?._id);
      listen_message((message: any) => {
        setMessages((prev) => [...prev, message]);
      });
      getMessages().then((res) => {
        if (res.length > 0) {
          lastMessage.current = res[res.length - 1]._id;
        }
        setMessages(res);
      });
      getBooking().then((res) => {
        setBookingData(res);
      });
    }
    return () => {
      leave_room(bookingId as string, user?._id);
    };
  }, [bookingId]);

  return (
    <Layout style={{ height: "calc(100vh - 76px)" }}>
      <Sider
        theme="light"
        width={250}
        collapsedWidth={screenWidth < 768 ? 0 : 80}
        trigger={null}
        collapsible
        collapsed={left}
        className="border-r"
      >
        <div className="flex flex-col h-full">
          {!left && (
            <div className="p-2">
              <Input
                onChange={(e) => setSearchQuery(e.target.value)}
                className="m-0"
                placeholder="Search"
              />
            </div>
          )}
          <div className="overflow-auto h-full py-3">
            <div className="flex flex-col">
              {filteredConversations?.map((conversation, i) => (
                <div
                  key={i}
                  onClick={() => {
                    router.push(
                      `/messages?id=${conversation.bookingId}&tab=${RightSideTab.DETAILS}`
                    );
                  }}
                  className="flex items-center gap-3 px-3 py-3 hover:bg-tertiary cursor-pointer"
                  style={{
                    margin: !left ? "" : "auto",
                    backgroundColor: isSelected(conversation.bookingId)
                      ? theme.primary
                      : "",
                    color: isSelected(conversation.bookingId)
                      ? theme.white
                      : "",
                  }}
                >
                  <Avatar src={conversation.avatar} size="large" />
                  {!left && (
                    <div className="flex flex-col">
                      <Text size="label">
                        {fullName(conversation) || conversation.email}
                      </Text>
                      <Space height={3} />
                      <Text size="subTitle">{conversation.service.title}</Text>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Sider>
      <Layout>
        <Header className="flex flex-row justify-between bg-white border-b items-center px-3 h-[60px]">
          <Button
            type="text"
            icon={left ? <ICON.MENU_UNFOLD /> : <ICON.MENU_FOLD />}
            onClick={() => setLeft(!left)}
          />
          <h3 className="text-lg font-bold overflow-hidden truncate">
            {bookingData?.service?.title || "Messages"}
          </h3>
          <div>
            <Button
              type="text"
              className="hidden lg:block"
              icon={left ? <ICON.MENU_UNFOLD /> : <ICON.MENU_FOLD />}
              onClick={() => setRight(!right)}
            />
            {bookingData?._id ? (
              <Dropdown
                items={items}
                placement="bottomLeft"
                className="block lg:hidden"
                customChildren
                arrow={false}
              >
                <Button
                  type="text"
                  icon={
                    <ICON.MORE className="text-xl font-bold border rounded-full p-1" />
                  }
                />
              </Dropdown>
            ) : null}
          </div>
        </Header>
        <Content className="bg-white flex flex-col">
          <div
            ref={messageArea}
            className="h-full p-3 flex flex-col overflow-auto gap-3 pb-16"
          >
            {messages?.map((message, i) => (
              <MessageBubble
                key={i}
                isMe={message.isMe}
                message={message.message}
                isNotification={message.type === MessageType.NOTIFICATION}
                attachments={message.attachments}
                createdAt={
                  message.type === MessageType.NOTIFICATION
                    ? message.createdAt
                    : undefined
                }
              />
            ))}
          </div>
          {bookingData?._id ? (
            <div className="p-3 flex justify-between items-center gap-4 fixed md:relative bottom-0 left-0 w-full bg-white z-10">
              {/* <FileImageOutlined
                onClick={() => {}}
                className="text-2xl text-primary"
                rev={undefined}
              /> */}
              <div className=" w-full">
                <Input
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      createMessage();
                    }
                  }}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Write a message"
                />
              </div>
              <ICON.SEND onClick={createMessage} />
            </div>
          ) : null}
        </Content>
      </Layout>
      {bookingData && (
        <Sider
          theme="light"
          width={300}
          collapsedWidth={0}
          trigger={null}
          collapsible
          collapsed={right}
          className="border-l hidden lg:block"
        >
          {tab === RightSideTab.DETAILS && (
            <div className="flex flex-col h-full p-3 gap-3 overflow-auto">
              <div className="flex gap-2">
                {bookingData.totalInvoice > 0 && (
                  <Button
                    type="default"
                    block
                    onClick={() => {
                      router.push(
                        `/messages?id=${bookingData._id}&tab=${RightSideTab.INVOICES}`
                      );
                    }}
                  >
                    {"View " +
                      (bookingData.totalInvoice > 1 ? "invoices" : "invoice")}
                  </Button>
                )}
              </div>
              <div className="p-3 border rounded-md">
                <ServicePrice
                  bookingData={bookingData}
                  setBookingData={setBookingData}
                  setPriceModal={setPriceModal}
                />
              </div>
              {!!bookingData?.images?.length && (
                <Card header={<Text>Request images</Text>} bodyClass="p-3">
                  <div className="grid grid-cols-2 gap-2">
                    {bookingData?.images?.map((image, i) => (
                      <div className="h-full" key={i}>
                        <PreviewableImage height={"100%"} src={image} />
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          )}
          {tab === RightSideTab.INVOICES && (
            <div className="p-3">
              <Button
                type="text"
                onClick={() => {
                  router.push(
                    `/messages?id=${bookingData._id}&tab=${RightSideTab.DETAILS}`
                  );
                }}
                className="mb-3 text-sm"
              >
                <ICON.ARROW_LEFT />
                Back
              </Button>
              <InvoicesList invoices={invoices} showInvoice={showInvoice} />
            </div>
          )}
        </Sider>
      )}
      <Modal
        centered
        open={invoiceModal}
        cancelText="Close"
        onClose={() => setInvoiceModal(false)}
        onCancel={() => setInvoiceModal(false)}
        footer={
          <div>
            <Button onClick={() => setInvoiceModal(false)} size="middle">
              Close
            </Button>
          </div>
        }
      >
        <div className="my-8">
          <InvoicesList invoices={invoices} showInvoice={showInvoice} />
        </div>
      </Modal>
      <Modal
        centered
        open={priceModal}
        onCancel={() => setPriceModal(false)}
        footer={null}
      >
        <ServicePrice
          bookingData={bookingData}
          setBookingData={setBookingData}
          setPriceModal={setPriceModal}
        />
      </Modal>
    </Layout>
  );
};

function ServicePrice({
  bookingData,
  setBookingData,
  setPriceModal,
}: {
  bookingData?: GetSingleBookingsDTO;
  setBookingData: React.Dispatch<
    React.SetStateAction<GetSingleBookingsDTO | undefined>
  >;
  setPriceModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [priceRejectModal, setPriceRejectModal] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);

  const { loading: rejectLoader, request: reject } = useHttp(() => {
    return reject_booking_price(bookingData?._id as string);
  });

  const confirmBookingPrice = () => {
    setShowCheckoutForm(true);
    setPriceModal(false);
  };

  const confirmBookingPriceRejection = () => {
    reject().then(() => {
      setBookingData((prev) =>
        prev
          ? {
              ...prev,
              status: BookingStatus.CANCELLED,
            }
          : undefined
      );
      setPriceModal(false);
      setPriceRejectModal(false);
    });
  };

  const notifyPaymentSuccess = () => {
    setBookingData((prev) =>
      prev
        ? {
            ...prev,
            price: {
              ...prev.price,
              acceptedByUser: true,
            },
          }
        : undefined
    );
    setShowCheckoutForm(false);
    toast.success("Payment successful");
  };

  return (
    <div className="py-2">
      <h3 className="mb-2">Offered Price</h3>
      <div>
        <p className="p-1 text-xl font-bold">
          {bookingData?.price?.amount ? "$" + bookingData?.price?.amount : ""}
        </p>
        {bookingData?.status === BookingStatus.CANCELLED ? (
          <p>You have canceled the booking!</p>
        ) : bookingData?.price?.acceptedByUser ? (
          <p>You have accepted the offered price!</p>
        ) : bookingData?.price?.acceptedByProvider ? (
          <div className="flex items-center gap-2 justify-end mt-4">
            <Button onClick={confirmBookingPrice} size="middle">
              Accept
            </Button>
            <Button
              size="middle"
              className="!bg-danger hover:!bg-red-400"
              onClick={() => setPriceRejectModal(true)}
            >
              Reject
            </Button>
          </div>
        ) : (
          <p>Wait for the provider to set a price</p>
        )}
      </div>
      <Modal
        centered
        open={priceRejectModal}
        onCancel={() => setPriceRejectModal(false)}
        footer={null}
      >
        <div className="p-4">
          <h3 className="mb-2">Reject Offered Price</h3>
          <p>Are you sure you want to reject the offered price?</p>
          <div className="flex items-center gap-2 justify-end mt-4">
            <Button
              size="middle"
              className="!bg-danger hover:!bg-red-400"
              onClick={confirmBookingPriceRejection}
              loading={rejectLoader}
            >
              Yes
            </Button>
            <Button size="middle" onClick={() => setPriceRejectModal(false)}>
              No
            </Button>
          </div>
        </div>
      </Modal>
      <Drawer
        placement="bottom"
        size="large"
        open={showCheckoutForm}
        onClose={() => setShowCheckoutForm(false)}
      >
        {showCheckoutForm && bookingData?._id && (
          <PaymentCheckoutForm
            bookingId={bookingData?._id as string}
            amount={bookingData?.price?.amount || 0}
            notifyPaymentSuccess={notifyPaymentSuccess}
          />
        )}
      </Drawer>
    </div>
  );
}

function InvoicesList({
  invoices,
  showInvoice,
}: {
  invoices: SingleInvoiceDTO[];
  showInvoice: (id: string) => void;
}) {
  return (
    <div className="flex flex-col justify-center gap-2 overflow-y-auto">
      {invoices.length > 0 ? (
        invoices.map((invoice, i) => (
          <button
            onClick={() => showInvoice(invoice._id)}
            className="w-full outline-none focus:outline-none border-none bg-transparent cursor-pointer hover:shadow-md"
            key={i}
          >
            <Card
              header={
                <div className="flex justify-between items-center">
                  <Text size="base">Invoice no #{invoice._id.slice(0, 6)}</Text>
                  <Text>{formatDate(invoice.createdAt, "P")}</Text>
                </div>
              }
              bodyClass="p-3"
            >
              <div className="flex flex-col gap-3">
                <div className="flex justify-between">
                  <Text>Total</Text>
                  <Text>{invoice.total}</Text>
                </div>
                {invoice.serviceHistory.length > 0 ? (
                  <>
                    <div className="flex justify-between">
                      <Text size="subTitle">Service complition on</Text>
                      <Text size="subTitle">
                        {formatDate(invoice.serviceHistory.at(0)?.date, "PP")}
                      </Text>
                    </div>
                    <div className="flex justify-between">
                      <Text size="subTitle">Paid on</Text>
                      <Text size="subTitle">
                        {formatDate(invoice.serviceHistory.at(0)?.date, "PP")}
                      </Text>
                    </div>
                  </>
                ) : null}
              </div>
            </Card>
          </button>
        ))
      ) : (
        <div className="py-4">No invoices found</div>
      )}
    </div>
  );
}

export default withPrivatePage(Index);
