import {
  get_conversations,
  get_invoices_by_booking,
  get_messages,
  get_single_booking,
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
  Input,
  Layout,
  MessageBubble,
  PreviewableImage,
  Space,
  Text,
} from "@tanbel/react-ui";
import { formatDate } from "@tanbel/utils";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useHttp } from "../../hook/useHttp";
import DashboardLayout from "../../layout/dashbaord";
import { useAppState } from "../../store/appState";

const { Header, Sider, Content } = Layout;

enum RightSideTab {
  DETAILS = 0,
  INVOICES = 1,
}

const Index = () => {
  const { user } = useAppState();
  const lastMessage = React.useRef<string>();
  const messageArea = React.useRef<HTMLDivElement>(null);
  const [bookingData, setBookingData] = useState<GetSingleBookingsDTO>();
  const router = useRouter();
  const [text, setText] = useState("");
  const [price, setPrice] = useState("");
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

  useEffect(() => {
    filterConversations();
  }, [searchQuery, conversations]);

  useEffect(() => {
    if (messageArea.current) {
      messageArea.current.scrollTop = messageArea.current.scrollHeight;
    }
  }, [messages.length]);

  const isSelected = (id: string) => {
    return id === bookingId;
  };

  const showInvoice = (id: string) => {
    const url = invoiceDownloadUrl(id);
    const win = window.open(url, "_blank");
  };

  return (
    <DashboardLayout
      className="!px-0 !py-0 overflow-hidden"
      parentClassName="!p-0 !overflow-hidden"
    >
      <Layout style={{ height: "calc(100vh - 60px)" }}>
        <Sider
          theme="light"
          width={250}
          trigger={null}
          collapsible
          collapsed={left}
          className="border-r"
        >
          <div className="flex flex-col h-full">
            {!left && (
              <div className="p-3 border-b">
                <Input
                  onChange={(e) => setSearchQuery(e.target.value)}
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
                        `/message?id=${conversation.bookingId}&tab=${RightSideTab.DETAILS}`
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
                        <Text size="subTitle">
                          {conversation.service.title}
                        </Text>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Sider>
        <Layout>
          <Header className="flex flex-row justify-between bg-white border-b items-center px-3 h-[75px]">
            <Button
              type="text"
              icon={left ? <ICON.MENU_UNFOLD /> : <ICON.MENU_FOLD />}
              onClick={() => setLeft(!left)}
            />
            <Button
              type="text"
              icon={left ? <ICON.MENU_UNFOLD /> : <ICON.MENU_FOLD />}
              onClick={() => setRight(!right)}
            />
          </Header>
          <Content className="bg-white flex flex-col">
            <div
              ref={messageArea}
              className="h-full border-b p-3 flex flex-col overflow-auto gap-3"
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
            <div className="p-3 flex justify-between items-center gap-4">
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
          </Content>
        </Layout>
        {bookingData && (
          <Sider
            theme="light"
            width={400}
            collapsedWidth={0}
            trigger={null}
            collapsible
            collapsed={right}
            className="border-l"
          >
            {tab === RightSideTab.DETAILS && (
              <div className="flex flex-col h-full p-3 gap-3 overflow-auto">
                {!getBookingLoader &&
                  !!bookingData &&
                  bookingData.totalInvoice > 0 && (
                    <Card
                      header={<Text>Total cost (from invoice)</Text>}
                      bodyClass="p-3"
                    >
                      <Input
                        value={bookingData?.price?.amount || price}
                        disabled={true}
                        onChange={(e) => setPrice(e.target.value)}
                        type="number"
                        placeholder="Search"
                      />
                      {bookingData?.status === BookingStatus.CANCELLED ? (
                        <Text className="mt-2" size="subTitle">
                          User has cancelled the booking!
                        </Text>
                      ) : (
                        bookingData?.price?.acceptedByProvider &&
                        (bookingData?.price?.acceptedByUser ? (
                          <Text className="mt-2" size="subTitle">
                            The price has been accepted by the user
                          </Text>
                        ) : (
                          <Text className="mt-2" size="subTitle">
                            You have set the invoice. Wait for the user to
                            accept your price
                          </Text>
                        ))
                      )}
                    </Card>
                  )}
                <div className="flex gap-2">
                  <Button
                    block
                    onClick={() => {
                      router.push(
                        "/message/manage_invoice?id=" + bookingData._id
                      );
                    }}
                  >
                    {bookingData.totalInvoice > 0
                      ? `Update ${bookingData.totalInvoice > 1 ? "latest" : ""}`
                      : "Create"}{" "}
                    invoice
                  </Button>
                  {bookingData.totalInvoice > 0 && (
                    <Button
                      type="default"
                      block
                      onClick={() => {
                        router.push(
                          `/message?id=${bookingData._id}&tab=${RightSideTab.INVOICES}`
                        );
                      }}
                    >
                      {"View " +
                        (bookingData.totalInvoice > 1 ? "invoices" : "invoice")}
                    </Button>
                  )}
                </div>
                {bookingData.totalInvoice > 0 ? (
                  <Button
                    block
                    onClick={() => {
                      router.push(
                        `/message/manage_invoice?id=${bookingData._id}&create=true`
                      );
                    }}
                  >
                    Create invoice
                  </Button>
                ) : null}
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
                      `/message?id=${bookingData._id}&tab=${RightSideTab.DETAILS}`
                    );
                  }}
                  className="mb-3 text-sm"
                >
                  <ICON.ARROW_LEFT />
                  Back
                </Button>
                <div className="flex flex-col justify-center gap-2 overflow-y-auto">
                  {invoices.map((invoice, i) => (
                    <button
                      onClick={() => showInvoice(invoice._id)}
                      className="w-full outline-none focus:outline-none border-none bg-transparent cursor-pointer hover:shadow-md"
                    >
                      <Card
                        key={i}
                        header={
                          <div className="flex justify-between items-center">
                            <Text size="base">
                              Invoice no #{invoice._id.slice(0, 6)}
                            </Text>
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
                                <Text size="subTitle">
                                  Service complition on
                                </Text>
                                <Text size="subTitle">
                                  {formatDate(
                                    invoice.serviceHistory.at(0)?.date,
                                    "PP"
                                  )}
                                </Text>
                              </div>
                              <div className="flex justify-between">
                                <Text size="subTitle">Paid on</Text>
                                <Text size="subTitle">
                                  {formatDate(
                                    invoice.serviceHistory.at(0)?.date,
                                    "PP"
                                  )}
                                </Text>
                              </div>
                            </>
                          ) : null}
                        </div>
                      </Card>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </Sider>
        )}
      </Layout>
    </DashboardLayout>
  );
};

export default Index;
